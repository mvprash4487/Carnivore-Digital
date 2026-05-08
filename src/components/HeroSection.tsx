import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle gradient over the 3D canvas for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/30 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-primary text-xs md:text-sm tracking-[0.4em] uppercase mb-8 font-sans"
        >
          Premium Digital Agency
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 [text-shadow:0_2px_30px_rgba(0,0,0,0.7)]"
        >
          <span className="block">We'll Devour</span>
          <span className="block mt-2">
            Your <span className="text-gold-gradient italic">Competition</span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ duration: 1.2, delay: 1 }}
          className="h-[1px] bg-primary mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10 font-sans"
        >
          Crafting digital experiences that command attention. Strategy, design, and technology —
          fused into something extraordinary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <a
            href="#contact"
            className="inline-block border border-primary text-primary px-10 py-4 text-xs tracking-[0.3em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-500 backdrop-blur-sm"
          >
            Start a Project
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ duration: 2, repeat: Infinity }}>
          <ArrowDown className="text-primary/60" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
