import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import SplitTextReveal from "@/components/motion/SplitTextReveal";
import MagneticButton from "@/components/motion/MagneticButton";
import GlowOrb from "@/components/motion/GlowOrb";

const contactItems = [
  { Icon: Mail,   text: "hello@carnivoredigital.com", href: "mailto:hello@carnivoredigital.com" },
  { Icon: Phone,  text: "+66 84 221 7954",            href: "tel:+66842217954" },
  { Icon: MapPin, text: "Bangkok, Thailand",           href: undefined },
];

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 md:py-44 relative overflow-hidden" ref={ref}>
      <GlowOrb size={600} opacity={0.05} blur={120} x="50%" y="45%" animationDuration={10} />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="font-serif text-[8rem] md:text-[12rem] font-black leading-none text-gold-gradient opacity-40 select-none block">
              05
            </span>
            <motion.div
              className="h-[2px] bg-primary mb-4 mx-auto"
              initial={{ scaleX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0.5, width: 64 }}
            />
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-sans font-medium mb-6">
              Let's Move
            </p>
          </motion.div>

          <div className="mb-6 leading-[0.92]">
            <SplitTextReveal
              text="The City"
              tag="h2"
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white text-shadow-hard block"
              delay={0}
              staggerDelay={0.05}
              duration={0.8}
            />
            <motion.h2
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-neon-cyan italic block"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              Never Sleeps.
            </motion.h2>
            <SplitTextReveal
              text="Neither Do We."
              tag="h2"
              className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white text-shadow-hard block"
              delay={0.6}
              staggerDelay={0.05}
              duration={0.8}
            />
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-primary font-sans text-xs sm:text-sm tracking-[0.2em] uppercase font-medium mb-8"
          >
            Drop us a line. We'll be on it before dawn.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-white/70 font-sans text-base md:text-lg leading-relaxed mb-14 max-w-xl mx-auto"
          >
            Tell us about your brand. We'll tell you exactly how to take the competition apart.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="mb-20"
          >
            <MagneticButton threshold={120} strength={0.6}>
              <a
                href="mailto:hello@carnivoredigital.com"
                data-cursor-hover
                className="inline-block bg-primary text-primary-foreground px-14 py-6 text-xs sm:text-sm tracking-[0.35em] uppercase font-sans font-bold hover:bg-primary/80 transition-all duration-300 shadow-[0_4px_40px_rgba(0,0,0,0.6)] relative overflow-hidden group"
              >
                <span className="relative z-10">Start the Hunt</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              </a>
            </MagneticButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="grid md:grid-cols-3 gap-8 pt-14 border-t border-white/15"
          >
            {contactItems.map(({ Icon, text, href }, i) => (
              <motion.div
                key={text}
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, rotateX: 30 }}
                animate={inView ? { opacity: 1, rotateX: 0 } : {}}
                transition={{ duration: 0.7, delay: 1.0 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              >
                <motion.div whileHover={{ rotate: [0, -10, 10, 0] }} transition={{ duration: 0.4 }}>
                  <Icon className="text-primary" size={22} strokeWidth={1.5} />
                </motion.div>
                {href ? (
                  <a href={href} className="text-sm md:text-base text-white/70 font-sans hover:text-primary transition-colors">{text}</a>
                ) : (
                  <p className="text-sm md:text-base text-white/70 font-sans">{text}</p>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
