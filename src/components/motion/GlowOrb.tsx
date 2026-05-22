import { motion } from "framer-motion";

interface GlowOrbProps {
  size?: number;
  color?: string;
  blur?: number;
  opacity?: number;
  x?: string;
  y?: string;
  animationDuration?: number;
  className?: string;
}

const GlowOrb = ({
  size = 300,
  color = "hsl(38 88% 54%)",
  blur = 80,
  opacity = 0.06,
  x = "50%",
  y = "50%",
  animationDuration = 8,
  className = "",
}: GlowOrbProps) => {
  return (
    <motion.div
      className={`absolute pointer-events-none rounded-full ${className}`}
      style={{
        width: size,
        height: size,
        left: x,
        top: y,
        transform: "translate(-50%, -50%)",
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: `blur(${blur}px)`,
        opacity,
        willChange: "transform",
      }}
      animate={{
        y: [0, -30, 0],
        x: [0, 15, 0],
        scale: [1, 1.08, 1],
      }}
      transition={{
        duration: animationDuration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default GlowOrb;
