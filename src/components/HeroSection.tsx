import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background to-charcoal" />
      
      {/* Subtle gold radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, hsl(43 52% 54%) 0%, transparent 70%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
        {/* Overline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-primary text-xs md:text-sm tracking-[0.4em] uppercase mb-8 font-sans"
        >
          Premium Digital Agency
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8"
        >
          <span className="block">We'll Devour</span>
          <span className="block mt-2">
            Your <span className="text-gold-gradient italic">Competition</span>
          </span>
        </motion.h1>

        {/* Gold Divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "120px" }}
          transition={{ duration: 1.2, delay: 1 }}
          className="h-[1px] bg-primary mx-auto mb-8"
        />

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-10 font-sans"
        >
          Crafting digital experiences that command attention. Strategy, design, and technology — 
          fused into something extraordinary.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.5 }}
        >
          <a
            href="#contact"
            className="inline-block border border-primary text-primary px-10 py-4 text-xs tracking-[0.3em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            Start a Project
          </a>
        </motion.div>

        {/* Pull Quote */}
        <motion.blockquote
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-20 md:mt-28"
        >
          <p className="font-serif italic text-sm md:text-lg text-muted-foreground/60 max-w-lg mx-auto">
            "Design is not just what it looks like and feels like. Design is how it works."
          </p>
          <cite className="block mt-3 text-xs tracking-[0.2em] uppercase text-primary/60 font-sans not-italic">
            — Steve Jobs
          </cite>
        </motion.blockquote>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ArrowDown className="text-primary/40" size={20} />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
