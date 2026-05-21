import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-primary text-xs md:text-sm tracking-[0.5em] uppercase mb-8 font-sans"
        >
          Bangkok's Premier Digital Studio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold leading-[0.95] mb-8 [text-shadow:0_2px_40px_rgba(0,0,0,0.8)]"
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
          className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base leading-relaxed mb-4 font-sans"
        >
          Step inside. The world's most discerning brands check in here.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-muted-foreground/60 max-w-lg mx-auto text-xs md:text-sm leading-relaxed mb-10 font-sans"
        >
          Strategy, design, and technology — fused into something extraordinary.
          Scroll to enter the lobby.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <a
            href="#contact"
            className="inline-block border border-primary text-primary px-10 py-4 text-xs tracking-[0.3em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-500 backdrop-blur-sm"
          >
            Request a Suite
          </a>
        </motion.div>
      </div>

      {/* Subtle scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <p className="text-primary/40 text-[10px] tracking-[0.3em] uppercase font-sans">Enter</p>
        <motion.div
          className="w-[1px] h-8 bg-gradient-to-b from-primary/60 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
