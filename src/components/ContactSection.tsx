import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 md:py-44 relative" ref={ref}>
      {/* Gold glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, hsl(43 52% 54%) 0%, transparent 70%)" }}
      />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center max-w-3xl mx-auto"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-sans mb-4">05 — Get In Touch</p>
          <h2 className="font-serif text-3xl md:text-6xl font-bold mb-6">
            Let's Create Something
            <br />
            <span className="text-gold-gradient italic">Extraordinary</span>
          </h2>
          <p className="text-muted-foreground font-sans text-sm md:text-base leading-relaxed mb-12">
            Ready to elevate your digital presence? We'd love to hear about your project 
            and explore how we can bring your vision to life.
          </p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            href="mailto:hello@carnivoredigital.com"
            className="inline-block border-2 border-primary text-primary px-12 py-5 text-xs tracking-[0.3em] uppercase font-sans hover:bg-primary hover:text-primary-foreground transition-all duration-500 mb-16"
          >
            Let's Connect
          </motion.a>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 pt-14 border-t border-border"
          >
            <div className="flex flex-col items-center gap-3">
              <Mail className="text-primary" size={20} strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground font-sans">hello@carnivoredigital.com</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <Phone className="text-primary" size={20} strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground font-sans">+66 2 XXX XXXX</p>
            </div>
            <div className="flex flex-col items-center gap-3">
              <MapPin className="text-primary" size={20} strokeWidth={1.5} />
              <p className="text-sm text-muted-foreground font-sans">Bangkok, Thailand</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
