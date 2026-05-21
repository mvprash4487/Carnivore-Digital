import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 362;
const FRAME_START = 1;
const FRAME_END = 320; // trim pulled-back tail
const ASSET_VERSION = 3; // bump to bust browser cache when frames are replaced
const framePath = (i: number) =>
  `/facade/frame_${String(i).padStart(4, "0")}.jpg?v=${ASSET_VERSION}`;

// Transition band: scroll inside the middle of this window between two
// adjacent section midpoints triggers the pan; outside it the bg holds.
const BAND_START = 0.4;
const BAND_END = 0.6;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const ScrollFacadeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const targetFrameRef = useRef(0);
  const displayFrameRef = useRef(0);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const rafRef = useRef(0);
  const [ready, setReady] = useState(false);

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
          draw(0);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const draw = (frameIdx: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[Math.round(frameIdx)];
    if (!canvas || !img || !img.complete || img.naturalWidth === 0) return;
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

    const iw = img.naturalWidth;
    const ih = img.naturalHeight;
    const scale = Math.max(w / iw, h / ih);
    const dw = iw * scale;
    const dh = ih * scale;
    const dx = (w - dw) / 2;
    const dy = (h - dh) / 2;
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, dx, dy, dw, dh);
  };

  // Compute target frame: hold on section anchors, scrub only between them
  const computeTarget = () => {
    const sections = sectionsRef.current;
    if (!sections.length) return;
    const n = sections.length;
    const centerY = window.innerHeight / 2;

    // Per-section anchor frame
    const anchor = (i: number) =>
      n === 1
        ? FRAME_START
        : lerp(FRAME_START, FRAME_END, i / (n - 1));

    // Collect section midpoints (in document space via getBoundingClientRect
    // referenced to the viewport center)
    const mids = sections.map((el) => {
      const r = el.getBoundingClientRect();
      return r.top + r.height / 2;
    });

    // Above first section
    if (centerY <= mids[0]) {
      targetFrameRef.current = anchor(0);
      return;
    }
    // Below last section
    if (centerY >= mids[n - 1]) {
      targetFrameRef.current = anchor(n - 1);
      return;
    }

    // Find the pair [i, i+1] that brackets the viewport center
    let i = 0;
    for (let k = 0; k < n - 1; k++) {
      if (centerY >= mids[k] && centerY <= mids[k + 1]) {
        i = k;
        break;
      }
    }
    const span = Math.max(1, mids[i + 1] - mids[i]);
    const t = clamp01((centerY - mids[i]) / span);

    // Hold outside the band, scrub inside
    let bandT: number;
    if (t <= BAND_START) bandT = 0;
    else if (t >= BAND_END) bandT = 1;
    else bandT = (t - BAND_START) / (BAND_END - BAND_START);

    const eased = smoothstep(bandT);
    targetFrameRef.current = lerp(anchor(i), anchor(i + 1), eased);
  };

  // RAF loop: lerp displayed frame toward target, redraw on change
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
    // Recollect once layout settles (lazy content, fonts)
    const recollectTimer = window.setTimeout(collectSections, 500);

    let last = 0;
    const loop = () => {
      computeTarget();
      if (reduced) {
        displayFrameRef.current = 0;
      } else {
        displayFrameRef.current +=
          (targetFrameRef.current - displayFrameRef.current) * 0.18;
      }
      const rounded = Math.round(displayFrameRef.current);
      if (rounded !== last) {
        last = rounded;
        draw(rounded);
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    const onResize = () => {
      collectSections();
      draw(Math.round(displayFrameRef.current));
    };
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.clearTimeout(recollectTimer);
      window.removeEventListener("resize", onResize);
    };
  }, [ready]);

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
