import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

const TRAIL_LENGTH = 6;

const CustomCursor = () => {
  const [isTouch, setIsTouch] = useState(false);
  const [cursorState, setCursorState] = useState<"default" | "hover" | "view">("default");

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const dotX = useSpring(mouseX, { stiffness: 800, damping: 40 });
  const dotY = useSpring(mouseY, { stiffness: 800, damping: 40 });
  const ringX = useSpring(mouseX, { stiffness: 180, damping: 22 });
  const ringY = useSpring(mouseY, { stiffness: 180, damping: 22 });

  const trailPositions = useRef<{ x: number; y: number }[]>(
    Array(TRAIL_LENGTH).fill({ x: 0, y: 0 })
  );
  const trailRefs = useRef<(HTMLDivElement | null)[]>(Array(TRAIL_LENGTH).fill(null));
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      setIsTouch(true);
      return;
    }

    const onMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      trailPositions.current = [
        { x: e.clientX, y: e.clientY },
        ...trailPositions.current.slice(0, TRAIL_LENGTH - 1),
      ];
    };

    const animateTrail = () => {
      trailPositions.current.forEach((pos, i) => {
        const el = trailRefs.current[i];
        if (el) {
          el.style.transform = `translate(${pos.x - 4}px, ${pos.y - 4}px)`;
          el.style.opacity = String((1 - i / TRAIL_LENGTH) * 0.3);
        }
      });
      rafRef.current = requestAnimationFrame(animateTrail);
    };

    const onEnterHover = (e: Event) => {
      const target = e.target as HTMLElement;
      if (target.closest("[data-cursor-view]")) setCursorState("view");
      else if (target.closest("[data-cursor-hover], a, button")) setCursorState("hover");
    };
    const onLeaveHover = () => setCursorState("default");

    window.addEventListener("mousemove", onMove, { passive: true });
    document.addEventListener("mouseover", onEnterHover, { passive: true });
    document.addEventListener("mouseout", onLeaveHover, { passive: true });
    rafRef.current = requestAnimationFrame(animateTrail);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onEnterHover);
      document.removeEventListener("mouseout", onLeaveHover);
      cancelAnimationFrame(rafRef.current);
    };
  }, [mouseX, mouseY]);

  if (isTouch) return null;

  const ringScale = cursorState === "view" ? 3.5 : cursorState === "hover" ? 2.5 : 1;
  const dotScale = cursorState === "hover" ? 0.4 : 1;
  const ringBg = cursorState === "hover" ? "rgba(224,168,50,0.1)" : "transparent";

  return (
    <>
      {/* Trail */}
      {Array(TRAIL_LENGTH).fill(null).map((_, i) => (
        <div
          key={i}
          ref={(el) => { trailRefs.current[i] = el; }}
          className="fixed top-0 left-0 w-2 h-2 rounded-full bg-primary pointer-events-none z-[9998]"
          style={{ opacity: 0, willChange: "transform, opacity" }}
        />
      ))}

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] flex items-center justify-center"
        style={{
          x: ringX,
          y: ringY,
          width: 32,
          height: 32,
          marginLeft: -16,
          marginTop: -16,
          willChange: "transform",
        }}
        animate={{
          scale: ringScale,
          backgroundColor: ringBg,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      >
        <div
          className="w-full h-full rounded-full border border-primary/60"
          style={{ boxShadow: "0 0 8px hsl(38 88% 54% / 0.3)" }}
        />
        {cursorState === "view" && (
          <span
            className="absolute text-[6px] tracking-widest uppercase text-primary font-sans font-bold"
            style={{ fontSize: "5px", letterSpacing: "0.15em" }}
          >
            VIEW
          </span>
        )}
      </motion.div>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[9999] rounded-full bg-primary"
        style={{
          x: dotX,
          y: dotY,
          width: 8,
          height: 8,
          marginLeft: -4,
          marginTop: -4,
          boxShadow: "0 0 10px hsl(38 88% 54% / 0.6)",
          willChange: "transform",
        }}
        animate={{ scale: dotScale }}
        transition={{ type: "spring", stiffness: 600, damping: 30 }}
      />
    </>
  );
};

export default CustomCursor;
