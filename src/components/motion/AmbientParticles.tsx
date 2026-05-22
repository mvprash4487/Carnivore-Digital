import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { globalScrollProgress } from "@/components/SmoothScroll";

interface Particle {
  x: number;
  y: number;
  baseY: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  opacityDir: number;
  hue: number;
  phase: number;
  speed: number;
}

const AmbientParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const shouldReduce = useReducedMotion();
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (shouldReduce) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const isMobile = window.innerWidth < 768;
    const COUNT = isMobile ? 20 : 60;
    let W = window.innerWidth;
    let H = window.innerHeight;

    const resize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const particles: Particle[] = Array.from({ length: COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      baseY: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.15,
      vy: (Math.random() - 0.5) * 0.1,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.3 + 0.05,
      opacityDir: Math.random() > 0.5 ? 1 : -1,
      hue: Math.random() > 0.5 ? 38 : 46,
      phase: Math.random() * Math.PI * 2,
      speed: Math.random() * 0.3 + 0.1,
    }));

    let lastFrame = 0;
    const draw = (time: number) => {
      if (time - lastFrame < 33) {
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      lastFrame = time;

      ctx.clearRect(0, 0, W, H);
      const scrollDrift = globalScrollProgress.get() * 80;

      for (const p of particles) {
        p.x += p.vx + Math.sin(time * 0.0003 + p.phase) * 0.2;
        p.y += p.vy + Math.cos(time * 0.0002 + p.phase) * 0.15;
        p.opacity += p.opacityDir * 0.003;
        if (p.opacity > 0.4 || p.opacity < 0.05) p.opacityDir *= -1;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        const displayY = p.y - scrollDrift;
        const sat = p.hue === 38 ? "88%" : "100%";
        const lit = p.hue === 38 ? "54%" : "66%";
        ctx.beginPath();
        ctx.arc(p.x, displayY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, ${sat}, ${lit}, ${p.opacity})`;
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [shouldReduce]);

  if (shouldReduce) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[2]"
      style={{ mixBlendMode: "screen" }}
    />
  );
};

export default AmbientParticles;
