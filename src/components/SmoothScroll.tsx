import { useEffect } from "react";
import Lenis from "lenis";
import { motionValue } from "framer-motion";

export const globalScrollProgress = motionValue(0);
export let lenisInstance: Lenis | null = null;

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    });
    lenisInstance = lenis;
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      globalScrollProgress.set(h > 0 ? lenis.scroll / h : 0);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
  return <>{children}</>;
};

export default SmoothScroll;
