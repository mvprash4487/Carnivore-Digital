import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";

interface SplitTextRevealProps {
  text: string;
  tag?: "h1" | "h2" | "h3" | "p" | "span";
  className?: string;
  delay?: number;
  staggerDelay?: number;
  duration?: number;
  once?: boolean;
}

const SplitTextReveal = ({
  text,
  tag: Tag = "span",
  className = "",
  delay = 0,
  staggerDelay = 0.04,
  duration = 0.7,
  once = true,
}: SplitTextRevealProps) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once, margin: "-60px" });
  const shouldReduce = useReducedMotion();

  const words = text.split(" ");

  if (shouldReduce) {
    return <Tag className={className}>{text}</Tag>;
  }

  let charIndex = 0;

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} className="inline-block" style={{ overflow: "hidden", perspective: "400px" }}>
          {word.split("").map((char) => {
            const ci = charIndex++;
            return (
              <motion.span
                key={ci}
                className="inline-block"
                aria-hidden="true"
                initial={{ opacity: 0, rotateX: 90, y: "0.15em" }}
                animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
                transition={{
                  duration,
                  delay: delay + ci * staggerDelay,
                  ease: [0.22, 1, 0.36, 1],
                }}
                style={{ transformOrigin: "50% 100%", willChange: "transform, opacity" }}
              >
                {char}
              </motion.span>
            );
          })}
          {/* word gap */}
          <span className="inline-block">&nbsp;</span>
        </span>
      ))}
    </Tag>
  );
};

export default SplitTextReveal;
