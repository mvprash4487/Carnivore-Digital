import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const CLIENT_LOGOS = [
  { name: "Ocean",            src: "/clients/Ocean%202.png"                      },
  { name: "Radisson Blu",     src: "/clients/Radisson%20Blu.png"                 },
  { name: "Aspira",           src: "/clients/Aspira.png"                         },
  { name: "Marriott Bangkok", src: "/clients/Marriott%20Bangkok%20Sukhumvit.png" },
  { name: "Getfresh",         src: "/clients/Getfresh%20White%20Background.png"  },
  { name: "ROSH",             src: "/clients/rosh%20logo.png"                    },
];

const ClientsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="clients" className="py-44 md:py-64 relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-6"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-sans mb-4">04 — The Guest Book</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Distinguished <span className="text-gold-gradient italic">Guests</span>
          </h2>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-center text-muted-foreground font-sans text-sm mb-20 max-w-md mx-auto"
        >
          Some of the world's most discerning names have checked in.
        </motion.p>

        {/* Logo grid — 2 rows × 3 columns */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-10 max-w-4xl mx-auto mb-24">
          {CLIENT_LOGOS.map((client, i) => (
            <motion.div
              key={client.name}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 * i }}
              className="group aspect-square flex items-center justify-center p-4 rounded-lg border border-border/40 bg-card/30 hover:border-primary/30 hover:bg-card/60 transition-all duration-500"
            >
              <img
                src={client.src}
                alt={client.name}
                className="w-full h-full object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-500"
              />
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
          {[
            { value: "98%",  label: "Guest Satisfaction" },
            { value: "150+", label: "Projects Delivered"  },
            { value: "8+",   label: "Years Experience"    },
            { value: "24/7", label: "Concierge Support"   },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-2xl md:text-3xl font-bold text-primary">{stat.value}</p>
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mt-2 font-sans">{stat.label}</p>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default ClientsSection;
