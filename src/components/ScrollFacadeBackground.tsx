import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 362;
const framePath = (i: number) =>
  `/facade/frame_${String(i).padStart(4, "0")}.jpg`;

// Each section eases through a slice of frames. Hold a bit at start/end of
// each slice so the pan reads as discrete "floor" beats.
const HOLD = 0.06;
const smoothstep = (t: number) => t * t * (3 - 2 * t);
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

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

  // Compute target frame from section progress
  const computeTarget = () => {
    const sections = sectionsRef.current;
    if (!sections.length) return;
    const n = sections.length;
    const sliceSize = (FRAME_COUNT - 1) / n;
    const centerY = window.innerHeight / 2;

    // Find active section: the one whose [top, bottom] contains center,
    // else the nearest by midpoint.
    let activeIdx = 0;
    let localT = 0;
    let found = false;
    for (let i = 0; i < n; i++) {
      const r = sections[i].getBoundingClientRect();
      if (r.top <= centerY && r.bottom >= centerY) {
        activeIdx = i;
        const span = Math.max(1, r.height);
        localT = clamp01((centerY - r.top) / span);
        found = true;
        break;
      }
    }
    if (!found) {
      // Above first or below last
      const firstTop = sections[0].getBoundingClientRect().top;
      if (firstTop > centerY) {
        activeIdx = 0;
        localT = 0;
      } else {
        activeIdx = n - 1;
        localT = 1;
      }
    }

    // Hold at start/end of each slice, then ease the middle
    const held = clamp01((localT - HOLD) / (1 - 2 * HOLD));
    const eased = smoothstep(held);
    const sliceStart = activeIdx * sliceSize;
    const sliceEnd = sliceStart + sliceSize;
    targetFrameRef.current = sliceStart + (sliceEnd - sliceStart) * eased;
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
