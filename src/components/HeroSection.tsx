import { motion } from "framer-motion";
import { useMouseParallax } from "@/hooks/useMouseParallax";
import GlowOrb from "@/components/motion/GlowOrb";
import MagneticButton from "@/components/motion/MagneticButton";
import SplitTextReveal from "@/components/motion/SplitTextReveal";

const heroContainer = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 40, rotateX: 15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] },
  },
};

const HeroSection = () => {
  const { rotateX, rotateY } = useMouseParallax({ strength: 5 });

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Ambient glow orbs */}
      <GlowOrb size={400} opacity={0.07} x="20%" y="40%" animationDuration={7} />
      <GlowOrb size={350} opacity={0.05} x="78%" y="62%" animationDuration={9} />

      <motion.div
        className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center"
        style={{ rotateX, rotateY, willChange: "transform", perspective: "800px" }}
      >
        <motion.div variants={heroContainer} initial="hidden" animate="visible">
          <motion.p
            variants={heroItem}
            className="text-primary text-xs sm:text-sm md:text-base tracking-[0.35em] uppercase mb-6 font-sans font-medium text-shadow-hard"
          >
            Bangkok's Premier Digital Studio
          </motion.p>

          <motion.div variants={heroItem} className="mb-8">
            <SplitTextReveal
              text="We'll Devour"
              tag="h1"
              className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black leading-[0.9] tracking-tight text-white text-shadow-hard block"
              delay={0.2}
              staggerDelay={0.03}
              duration={0.8}
            />
            <div className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black leading-[0.9] tracking-tight text-shadow-hard block mt-1">
              <span className="text-white">Your </span>
              <motion.span
                className="text-gold-gradient italic"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                Competition
              </motion.span>
            </div>
          </motion.div>

          <motion.div
            variants={heroItem}
            initial={{ width: 0 }}
            animate={{ width: "140px" }}
            transition={{ duration: 1.2, delay: 1 }}
            className="h-[2px] bg-primary mx-auto mb-8"
            style={{ originX: 0.5 }}
          />

          <motion.p
            variants={heroItem}
            className="text-white/70 max-w-xl mx-auto text-sm sm:text-base md:text-lg leading-relaxed mb-3 font-sans text-shadow-hard"
          >
            This city runs 24/7. So do we.
          </motion.p>

          <motion.p
            variants={heroItem}
            className="text-white/55 max-w-lg mx-auto text-sm md:text-base leading-relaxed mb-12 font-sans text-shadow-hard"
          >
            Strategy, design, and technology. Built for brands that refuse to stand still.
          </motion.p>

          <motion.div variants={heroItem}>
            <MagneticButton threshold={90} strength={0.5}>
              <a
                href="#contact"
                data-cursor-hover
                className="inline-block bg-primary text-primary-foreground px-12 py-5 text-xs sm:text-sm tracking-[0.35em] uppercase font-sans font-bold hover:bg-primary/80 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
              >
                Start a Project
              </a>
            </MagneticButton>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <p className="text-primary/60 text-[10px] tracking-[0.4em] uppercase font-sans font-medium">Scroll</p>
        <svg width="2" height="40" viewBox="0 0 2 40" className="overflow-visible">
          <motion.line
            x1="1" y1="0" x2="1" y2="40"
            stroke="url(#grad)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
          <defs>
            <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="hsl(185 100% 52%)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>
    </section>
  );
};

export default HeroSection;
