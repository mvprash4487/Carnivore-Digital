import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 text-center">

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-primary text-xs sm:text-sm md:text-base tracking-[0.55em] uppercase mb-6 font-sans font-semibold text-shadow-hard"
        >
          Bangkok's Premier Digital Studio
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-serif text-5xl sm:text-7xl md:text-8xl lg:text-[9rem] font-black leading-[0.9] tracking-tight mb-8 text-white text-shadow-hard"
        >
          <span className="block">We'll Devour</span>
          <span className="block mt-1">
            Your{" "}
            <span className="text-gold-gradient italic">Competition</span>
          </span>
        </motion.h1>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "140px" }}
          transition={{ duration: 1.2, delay: 1 }}
          className="h-[2px] bg-primary mx-auto mb-8"
        />

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="text-white/85 max-w-xl mx-auto text-base sm:text-lg md:text-xl leading-relaxed mb-3 font-sans text-shadow-hard"
        >
          Step inside. The world's most discerning brands check in here.
        </motion.p>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="text-white/55 max-w-lg mx-auto text-sm md:text-base leading-relaxed mb-12 font-sans text-shadow-hard"
        >
          Strategy, design, and technology — fused into something extraordinary.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.6 }}
        >
          <a
            href="#contact"
            className="inline-block bg-primary text-primary-foreground px-12 py-5 text-xs sm:text-sm tracking-[0.35em] uppercase font-sans font-bold hover:bg-primary/80 transition-all duration-300 shadow-[0_4px_30px_rgba(0,0,0,0.6)]"
          >
            Request a Suite
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <p className="text-primary/60 text-[10px] tracking-[0.4em] uppercase font-sans font-medium">Enter</p>
        <motion.div
          className="w-[2px] h-10 bg-gradient-to-b from-primary to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
};

export default HeroSection;
