import { motion } from "framer-motion";
import { useMagneticEffect } from "@/hooks/useMagneticEffect";

interface MagneticButtonProps {
  children: React.ReactNode;
  threshold?: number;
  strength?: number;
  className?: string;
  as?: "div" | "span";
}

const MagneticButton = ({
  children,
  threshold = 80,
  strength = 0.35,
  className = "",
}: MagneticButtonProps) => {
  const { ref, x, y } = useMagneticEffect({ threshold, strength });

  return (
    <motion.div
      ref={ref as React.RefObject<HTMLDivElement>}
      style={{ x, y, willChange: "transform" }}
      className={`inline-block ${className}`}
    >
      <motion.div
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default MagneticButton;
