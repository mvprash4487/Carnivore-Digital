import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import logo from "@/assets/logo-carnivore.png";
import MagneticButton from "@/components/motion/MagneticButton";

const Footer = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  return (
    <footer ref={ref} className="border-t border-border bg-charcoal/50 relative overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 right-0 h-[1px] bg-primary/30"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : {}}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ originX: 0 }}
      />
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 py-2">
        <motion.a
          href="#"
          className="flex items-center h-16 md:h-20"
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
        >
          <img src={logo} alt="Carnivore Digital" className="h-full w-auto" />
        </motion.a>

        <div className="flex items-center gap-8">
          <MagneticButton threshold={40} strength={0.3}>
            <motion.a
              href="https://www.linkedin.com/company/72004968/"
              target="_blank"
              rel="noopener noreferrer"
              data-cursor-hover
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 font-sans"
              whileHover={{ x: 3 }}
            >
              LinkedIn
            </motion.a>
          </MagneticButton>
        </div>

        <motion.p
          className="text-xs text-muted-foreground/50 font-sans"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          © {new Date().getFullYear()} Carnivore Digital. All rights reserved.
        </motion.p>
      </div>
    </footer>
  );
};

export default Footer;
