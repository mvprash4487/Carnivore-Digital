import { useRef, useEffect, useCallback } from "react";
import { useMotionValue, useSpring } from "framer-motion";

interface UseMagneticEffectOptions {
  threshold?: number;
  strength?: number;
}

export const useMagneticEffect = ({
  threshold = 80,
  strength = 0.35,
}: UseMagneticEffectOptions = {}) => {
  const ref = useRef<HTMLElement>(null);
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const x = useSpring(rawX, { stiffness: 200, damping: 20 });
  const y = useSpring(rawY, { stiffness: 200, damping: 20 });
  const isActive = useMotionValue(false);

  const onMove = useCallback((e: MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < threshold) {
      rawX.set(dx * strength);
      rawY.set(dy * strength);
      isActive.set(true);
    } else {
      rawX.set(0);
      rawY.set(0);
      isActive.set(false);
    }
  }, [threshold, strength, rawX, rawY, isActive]);

  const onLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    isActive.set(false);
  }, [rawX, rawY, isActive]);

  useEffect(() => {
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
    };
  }, [onMove, onLeave]);

  return { ref, x, y, isActive };
};
