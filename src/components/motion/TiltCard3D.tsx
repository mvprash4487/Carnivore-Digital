import { useRef, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useReducedMotion } from "framer-motion";

interface TiltCard3DProps {
  children: React.ReactNode;
  maxTilt?: number;
  glareEnabled?: boolean;
  glareColor?: string;
  perspective?: number;
  className?: string;
}

const TiltCard3D = ({
  children,
  maxTilt = 12,
  glareEnabled = false,
  glareColor = "rgba(224,168,50,0.07)",
  perspective = 1000,
  className = "",
}: TiltCard3DProps) => {
  const shouldReduce = useReducedMotion();
  const cardRef = useRef<HTMLDivElement>(null);

  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const glareX = useMotionValue(50);
  const glareY = useMotionValue(50);
  const glareOpacity = useMotionValue(0);

  const rotateX = useSpring(useTransform(rawY, [-0.5, 0.5], [maxTilt, -maxTilt]), {
    stiffness: 150,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(rawX, [-0.5, 0.5], [-maxTilt, maxTilt]), {
    stiffness: 150,
    damping: 20,
  });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    rawX.set(nx);
    rawY.set(ny);
    if (glareEnabled) {
      glareX.set(((e.clientX - rect.left) / rect.width) * 100);
      glareY.set(((e.clientY - rect.top) / rect.height) * 100);
      glareOpacity.set(1);
    }
  }, [shouldReduce, rawX, rawY, glareEnabled, glareX, glareY, glareOpacity]);

  const handleMouseLeave = useCallback(() => {
    rawX.set(0);
    rawY.set(0);
    glareOpacity.set(0);
  }, [rawX, rawY, glareOpacity]);

  if (shouldReduce) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      ref={cardRef}
      style={{ perspective: `${perspective}px` }}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="relative w-full h-full"
      >
        {children}
        {glareEnabled && (
          <motion.div
            className="absolute inset-0 pointer-events-none rounded-[inherit] overflow-hidden"
            style={{ opacity: glareOpacity }}
          >
            <motion.div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at ${glareX.get()}% ${glareY.get()}%, ${glareColor}, transparent 60%)`,
              }}
            />
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default TiltCard3D;
