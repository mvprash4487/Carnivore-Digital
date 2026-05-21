import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";

const ContactSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="contact" className="py-32 md:py-44 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center max-w-4xl mx-auto"
        >
          <p className="text-xs sm:text-sm tracking-[0.45em] uppercase text-primary font-sans font-semibold mb-6">05 — The View From Here</p>

          <h2 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white text-shadow-hard leading-[0.92] mb-6">
            Let's Create
            <br />
            <span className="text-gold-gradient italic">Something</span>
            <br />
            Extraordinary
          </h2>

          <p className="text-primary font-sans text-xs sm:text-sm tracking-[0.25em] uppercase font-semibold mb-8">
            The 19th floor awaits. Come up.
          </p>

          <p className="text-white/70 font-sans text-base md:text-lg leading-relaxed mb-14 max-w-xl mx-auto">
            Ready to elevate your digital presence? We'd love to hear about your
            project and explore how we can bring your vision to life.
          </p>

          <motion.a
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            href="mailto:hello@carnivoredigital.com"
            className="inline-block bg-primary text-primary-foreground px-14 py-6 text-xs sm:text-sm tracking-[0.35em] uppercase font-sans font-bold hover:bg-primary/80 transition-all duration-300 shadow-[0_4px_40px_rgba(0,0,0,0.6)] mb-20"
          >
            Let's Connect
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="grid md:grid-cols-3 gap-8 pt-14 border-t border-white/15"
          >
            {[
              { Icon: Mail,  text: "hello@carnivoredigital.com", href: "mailto:hello@carnivoredigital.com" },
              { Icon: Phone, text: "+66 84 221 7954",            href: "tel:+66842217954" },
              { Icon: MapPin,text: "Bangkok, Thailand",          href: undefined },
            ].map(({ Icon, text, href }) => (
              <div key={text} className="flex flex-col items-center gap-3">
                <Icon className="text-primary" size={22} strokeWidth={1.5} />
                {href ? (
                  <a href={href} className="text-sm md:text-base text-white/70 font-sans hover:text-primary transition-colors">{text}</a>
                ) : (
                  <p className="text-sm md:text-base text-white/70 font-sans">{text}</p>
                )}
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactSection;
