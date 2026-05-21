import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 md:py-44 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">

          {/* Left: editorial number */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="md:col-span-4"
          >
            <span className="font-serif text-[8rem] md:text-[12rem] font-black leading-none text-gold-gradient opacity-40 select-none">
              01
            </span>
            <div className="mt-4">
              <div className="h-[2px] w-16 bg-primary mb-4" />
              <p className="text-xs sm:text-sm tracking-[0.35em] uppercase text-primary font-sans font-semibold">At the Desk</p>
            </div>
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="md:col-span-8"
          >
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-[1.0] mb-8 text-white text-shadow-hard">
              Checked In Since 2015.
              <br />
              <span className="text-gold-gradient italic">Still Taking Reservations.</span>
            </h2>

            <div className="space-y-5 font-sans leading-[1.85] text-base md:text-lg text-white/80">
              <p>
                Carnivore Digital is a full-service digital agency based in Bangkok, Thailand.
                Consider us your concierge — we handle every detail of your digital presence
                so you can focus on running your brand.
              </p>
              <p>
                Our team of designers, developers, and strategists work in lockstep to deliver
                solutions that don't just look beautiful — they perform. From brand identity to
                digital marketing, every floor of our hotel is a specialty.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 md:gap-8 mt-14 pt-14 border-t border-border">
              {[
                { number: "2015", label: "Checked In" },
                { number: "150+", label: "Projects" },
                { number: "50+",  label: "Guests Served" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }}
                >
                  <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-primary">{stat.number}</p>
                  <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/60 mt-2 font-sans">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
