import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import TiltCard3D from "@/components/motion/TiltCard3D";
import SplitTextReveal from "@/components/motion/SplitTextReveal";

import aspiraLogo       from "@/assets/clients/aspira.png";
import radissonLogo     from "@/assets/clients/radisson-blu.png";
import oceanLogo        from "@/assets/clients/ocean.png";
import marriottLogo     from "@/assets/clients/marriott-bangkok.png";
import getfreshLogo     from "@/assets/clients/getfresh.png";
import roshLogo         from "@/assets/clients/rosh.png";

const CLIENT_LOGOS = [
  { name: "Ocean",            logo: oceanLogo        },
  { name: "Radisson Blu",     logo: radissonLogo     },
  { name: "Aspira",           logo: aspiraLogo       },
  { name: "Marriott Bangkok", logo: marriottLogo     },
  { name: "Getfresh",         logo: getfreshLogo     },
  { name: "ROSH",             logo: roshLogo         },
];

const stats = [
  { value: "98%",  label: "Guest Satisfaction" },
  { value: "150+", label: "Projects Delivered"  },
  { value: "8+",   label: "Years Experience"    },
  { value: "24/7", label: "Concierge Support"   },
];

const ClientsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="clients" className="py-44 md:py-64 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <div className="text-center mb-6">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-xs sm:text-sm tracking-[0.45em] uppercase text-primary font-sans font-semibold mb-5"
          >
            04 — The Guest Book
          </motion.p>
          <SplitTextReveal
            text="Distinguished Guests"
            tag="h2"
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white text-shadow-hard"
            delay={0.1}
            staggerDelay={0.03}
          />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center text-white/65 font-sans text-base md:text-lg mb-20 max-w-md mx-auto"
        >
          Some of the world's most discerning names have checked in.
        </motion.p>

        {/* Logo grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto mb-24">
          {CLIENT_LOGOS.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, rotateX: 45, y: 30 }}
              animate={inView ? { opacity: 1, rotateX: 0, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.08 * i, ease: [0.22, 1, 0.36, 1] }}
              style={{ willChange: "transform, opacity" }}
            >
              <TiltCard3D maxTilt={6} className="rounded-lg">
                <motion.div
                  className="group aspect-square flex items-center justify-center p-4 rounded-lg border border-border/40 bg-card/30 hover:border-primary/30 hover:bg-card/60 transition-all duration-500"
                  whileHover={{ filter: "drop-shadow(0 0 16px hsl(185 100% 52% / 0.55))" }}
                >
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-500"
                  />
                </motion.div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.7 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-14 border-t border-border"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl md:text-4xl font-black text-primary">{stat.value}</p>
              <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/55 mt-2 font-sans">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ClientsSection;
