import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 360;
const FRAME_START = 0; // maps to frame_0001.jpg
const FRAME_END = FRAME_COUNT - 1;
const ASSET_VERSION = 4; // bump to bust browser cache
const framePath = (i: number) =>
  `/facade/frame_${String(i).padStart(4, "0")}.jpg?v=${ASSET_VERSION}`;

// Widened transition band: pan breathes across more of the section
const BAND_START = 0.25;
const BAND_END = 0.75;

// Smootherstep: zero 1st & 2nd derivatives at endpoints — silkier than smoothstep
const smootherstep = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ScrollFacadeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const displayFrameRef = useRef(0);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef(0);
  const lastTsRef = useRef<number>(0);
  const [, setReady] = useState(false);

  // Preload frames
  useEffect(() => {
    let cancelled = false;
    let loaded = 0;
    const imgs: HTMLImageElement[] = [];
    for (let i = 1; i <= FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      img.onload = () => {
        loaded++;
        if (i === 1 && !cancelled) {
          imagesRef.current = imgs;
          drawBlended(0);
        }
        if (loaded >= FRAME_COUNT && !cancelled) {
          imagesRef.current = imgs;
          setReady(true);
        }
      };
      imgs[i - 1] = img;
    }
    return () => {
      cancelled = true;
    };
  }, []);

  const drawImage = (
    ctx: CanvasRenderingContext2D,
    img: HTMLImageElement,
    w: number,
    h: number,
    alpha: number
  ) => {
    if (!img || !img.complete || img.naturalWidth === 0) return;
    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.globalAlpha = alpha;
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Sub-frame draw: crossfade between two nearest integer frames
  const drawBlended = (frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
    }
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const clamped = Math.max(FRAME_START, Math.min(FRAME_END, frameIdx));
    const lo = Math.floor(clamped);
    const hi = Math.min(FRAME_END, lo + 1);
    const f = clamped - lo;
    const imgs = imagesRef.current;
    drawImage(ctx, imgs[lo], w, h, 1);
    if (hi !== lo && f > 0) drawImage(ctx, imgs[hi], w, h, f);
    ctx.globalAlpha = 1;
  };

  // Compute target frame: hold on section anchors, scrub only between them
  const computeTarget = (tSec: number) => {
    const sections = sectionsRef.current;
    if (!sections.length) return;
    const n = sections.length;
    const centerY = window.innerHeight / 2;

    const anchor = (i: number) =>
      n === 1 ? FRAME_START : lerp(FRAME_START, FRAME_END, i / (n - 1));

    const mids = sections.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    });

    // Subtle breathing while held — kills the "stuck poster" feel
    const breathe = Math.sin(tSec * 2 * Math.PI * 0.15) * 0.4;

    if (centerY <= mids[0]) {
      targetFrameRef.current = anchor(0) + breathe;
      return;
    }
    if (centerY >= mids[n - 1]) {
      targetFrameRef.current = anchor(n - 1) + breathe;
      return;
    }

    let i = 0;
    for (let k = 0; k < n - 1; k++) {
      if (centerY >= mids[k] && centerY <= mids[k + 1]) {
        i = k;
        break;
      }
    }
    const span = Math.max(1, mids[i + 1] - mids[i]);
    const t = clamp01((centerY - mids[i]) / span);

    let bandT: number;
    if (t <= BAND_START) bandT = 0;
    else if (t >= BAND_END) bandT = 1;
    else bandT = (t - BAND_START) / (BAND_END - BAND_START);

    const eased = smootherstep(bandT);
    // Apply breathe more strongly while held, fade it out during the scrub
    const holdWeight = 1 - Math.sin(Math.PI * bandT); // 1 at edges, 0 at middle
    targetFrameRef.current =
      lerp(anchor(i), anchor(i + 1), eased) + breathe * holdWeight;
  };

  // RAF loop: critically-damped follow + sub-frame crossfade
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const collectSections = () => {
      const root = document.querySelector("main") || document.body;
      sectionsRef.current = Array.from(
        root.querySelectorAll<HTMLElement>("section, footer")
      );
    };
    collectSections();
    const recollectTimer = window.setTimeout(collectSections, 500);

    const TAU = 0.22; // seconds — larger = creamier follow
    const MAX_FRAMES_PER_SEC = 220; // velocity cap so flings glide

    const loop = (ts: number) => {
      const prev = lastTsRef.current || ts;
      const dt = Math.min(0.064, Math.max(0.001, (ts - prev) / 1000));
      lastTsRef.current = ts;
      const tSec = ts / 1000;

      computeTarget(tSec);

      if (reduced) {
        displayFrameRef.current = targetFrameRef.current;
      } else {
        // Frame-rate independent exponential smoothing
        const k = 1 - Math.exp(-dt / TAU);
        const delta = (targetFrameRef.current - displayFrameRef.current) * k;
        const maxStep = MAX_FRAMES_PER_SEC * dt;
        const clamped =
          Math.abs(delta) > maxStep ? Math.sign(delta) * maxStep : delta;
        displayFrameRef.current += clamped;
      }

      drawBlended(displayFrameRef.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      collectSections();
      drawBlended(displayFrameRef.current);
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(recollectTimer);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(10,5,6,0.25) 0%, rgba(10,5,6,0.55) 60%, rgba(10,5,6,0.85) 100%), linear-gradient(to bottom, rgba(10,5,6,0.35) 0%, rgba(10,5,6,0.15) 30%, rgba(10,5,6,0.6) 100%)",
        }}
      />
    </div>
  );
};

export default ScrollFacadeBackground;
