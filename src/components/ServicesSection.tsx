import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, TrendingUp, Camera, Layers, Globe } from "lucide-react";

const services = [
  {
    icon: Palette,
    title: "UX / UI Design",
    description: "Creating intuitive, visually stunning interfaces that captivate users and drive engagement through thoughtful design decisions.",
  },
  {
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "Data-driven marketing strategies that amplify your brand reach and convert audiences into loyal customers.",
  },
  {
    icon: Camera,
    title: "Photo & Video",
    description: "Cinematic visual content that tells your brand story with impact — from product photography to brand films.",
  },
  {
    icon: Layers,
    title: "Branding",
    description: "Crafting distinctive brand identities that resonate with your audience and stand the test of time.",
  },
  {
    icon: Globe,
    title: "Web Design & SEO",
    description: "High-performance websites optimized for search engines, built to convert visitors into customers.",
  },
];

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="services" className="py-32 md:py-44 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-sans mb-4">02 — What We Do</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Our <span className="text-gold-gradient italic">Services</span>
          </h2>
        </motion.div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              className="group relative p-8 md:p-10 rounded-lg border border-border bg-card hover:border-primary/40 transition-all duration-500 hover:border-gold-glow"
            >
              <service.icon className="text-primary mb-6" size={28} strokeWidth={1.5} />
              <h3 className="font-serif text-xl md:text-2xl font-semibold mb-4 group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed font-sans">
                {service.description}
              </p>
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-8 right-8 h-[1px] bg-primary/0 group-hover:bg-primary/30 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
