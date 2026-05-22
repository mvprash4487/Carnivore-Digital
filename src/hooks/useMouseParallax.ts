import { useEffect } from "react";
import { useMotionValue, useSpring, type SpringOptions } from "framer-motion";

interface UseMouseParallaxOptions {
  strength?: number;
  springConfig?: SpringOptions;
}

export const useMouseParallax = ({
  strength = 15,
  springConfig = { stiffness: 150, damping: 20 },
}: UseMouseParallaxOptions = {}) => {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const rotateX = useSpring(rawY, springConfig);
  const rotateY = useSpring(rawX, springConfig);
  const x = useSpring(rawX, springConfig);
  const y = useSpring(rawY, springConfig);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth - 0.5) * strength;
      const ny = -(e.clientY / window.innerHeight - 0.5) * strength;
      rawX.set(nx);
      rawY.set(ny);
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [strength, rawX, rawY]);

  return { rotateX, rotateY, x, y };
};
