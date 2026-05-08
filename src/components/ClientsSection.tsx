import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const clients = [
  "OCEAN",
  "RADISSON BLU",
  "ROYAL ORCHID SHERATON",
  "ASPIRA",
  "GETFRESH",
  "MARRIOTT BANGKOK",
  "BURGER & LOBSTER",
  "CANOLINI",
];

const ClientsSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="clients" className="py-32 md:py-44 bg-charcoal/40 backdrop-blur-sm relative overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-sans mb-4">04 — Trusted By</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Our <span className="text-gold-gradient italic">Clients</span>
          </h2>
        </motion.div>
      </div>

      {/* Marquee */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-charcoal to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-charcoal to-transparent z-10" />
        
        <div className="flex animate-marquee whitespace-nowrap">
          {[...clients, ...clients].map((client, i) => (
            <div
              key={`${client}-${i}`}
              className="flex items-center mx-8 md:mx-14"
            >
              <span className="font-serif text-xl md:text-3xl font-bold text-muted-foreground/30 hover:text-primary transition-colors duration-500 cursor-default tracking-wider">
                {client}
              </span>
              <span className="ml-8 md:ml-14 text-primary/20">◆</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats bar */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.5 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-14 border-t border-border"
        >
          {[
            { value: "98%", label: "Client Satisfaction" },
            { value: "150+", label: "Projects Delivered" },
            { value: "8+", label: "Years Experience" },
            { value: "24/7", label: "Support" },
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
