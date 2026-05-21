import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, TrendingUp, Camera, Layers, Globe } from "lucide-react";

const services = [
  {
    floor: "F1",
    icon: Palette,
    title: "UX / UI Design",
    description: "Creating intuitive, visually stunning interfaces that captivate users and drive engagement through thoughtful design decisions.",
  },
  {
    floor: "F2",
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "Data-driven marketing strategies that amplify your brand reach and convert audiences into loyal customers.",
  },
  {
    floor: "F3",
    icon: Camera,
    title: "Photo & Video",
    description: "Cinematic visual content that tells your brand story with impact — from product photography to brand films.",
  },
  {
    floor: "F4",
    icon: Layers,
    title: "Branding",
    description: "Crafting distinctive brand identities that resonate with your audience and stand the test of time.",
  },
  {
    floor: "F5",
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="text-center mb-20"
        >
          <p className="text-xs sm:text-sm tracking-[0.45em] uppercase text-primary font-sans font-semibold mb-5">02 — Select Your Floor</p>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white text-shadow-hard mb-5">
            Every Floor,{" "}
            <span className="text-gold-gradient italic">A Specialty</span>
          </h2>
          <p className="text-white/65 font-sans text-base md:text-lg max-w-md mx-auto">
            Press your button. Each floor is fully staffed and ready.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
              className="group relative p-8 md:p-10 rounded-lg border border-white/10 bg-black/40 backdrop-blur-sm hover:border-primary/50 hover:bg-black/60 transition-all duration-500"
            >
              {/* Floor badge */}
              <div className="absolute top-6 right-6 w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/15 transition-all duration-300">
                <span className="text-[11px] tracking-wider text-primary font-sans font-bold">{service.floor}</span>
              </div>

              <service.icon className="text-primary mb-6" size={30} strokeWidth={1.5} />

              <h3 className="font-serif text-2xl md:text-3xl font-black mb-4 text-white group-hover:text-primary transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-white/65 text-sm md:text-base leading-relaxed font-sans">
                {service.description}
              </p>

              <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-primary/0 group-hover:bg-primary/40 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
