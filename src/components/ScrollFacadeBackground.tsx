import { useEffect, useRef, useState } from "react";

const FRAME_COUNT = 100;
const framePath = (i: number) =>
  `/facade/frame_${String(i).padStart(4, "0")}.jpg`;

const ScrollFacadeBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const currentFrameRef = useRef(0);
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
        // Render first frame as soon as it's available so the bg isn't black
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
    const img = imagesRef.current[frameIdx];
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

    // cover-fit
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

  // Scroll → frame
  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const onScroll = () => {
      const max =
        document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      const target = reduced
        ? 0
        : Math.min(FRAME_COUNT - 1, Math.floor(p * (FRAME_COUNT - 1)));
      if (target === currentFrameRef.current) return;
      currentFrameRef.current = target;
      cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => draw(target));
    };

    const onResize = () => draw(currentFrameRef.current);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(rafRef.current);
    };
  }, [ready]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      {/* Legibility overlay — oxblood vignette + bottom darken */}
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
