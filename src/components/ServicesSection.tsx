import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, TrendingUp, Camera, Layers, Globe } from "lucide-react";
import TiltCard3D from "@/components/motion/TiltCard3D";
import SplitTextReveal from "@/components/motion/SplitTextReveal";

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

const cardVariants = {
  hidden: { opacity: 0, rotateX: 30, y: 60, scale: 0.92 },
  visible: (i: number) => ({
    opacity: 1,
    rotateX: 0,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      delay: i * 0.12,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const ServicesSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section id="services" className="py-32 md:py-44 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div ref={headRef} className="text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="text-xs sm:text-sm tracking-[0.45em] uppercase text-primary font-sans font-semibold mb-5"
          >
            02 — Select Your Floor
          </motion.p>
          <SplitTextReveal
            text="Every Floor, A Specialty"
            tag="h2"
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white text-shadow-hard mb-5"
            delay={0.1}
            staggerDelay={0.03}
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={headInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.6 }}
            className="text-white/65 font-sans text-base md:text-lg max-w-md mx-auto"
          >
            Press your button. Each floor is fully staffed and ready.
          </motion.p>
        </div>

        <div
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-7"
          style={{ perspective: "1200px" }}
        >
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              style={{ willChange: "transform, opacity" }}
            >
              <TiltCard3D maxTilt={10} glareEnabled className="h-full rounded-lg">
                <div className="group relative p-8 md:p-10 rounded-lg border border-white/10 bg-black/50 hover:border-primary/50 hover:bg-black/65 transition-all duration-500 h-full">
                  {/* Floor badge */}
                  <motion.div
                    className="absolute top-6 right-6 w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center group-hover:border-primary group-hover:bg-primary/15 transition-all duration-300"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <span className="text-[11px] tracking-wider text-primary font-sans font-bold">{service.floor}</span>
                  </motion.div>

                  <motion.div
                    whileHover={{ rotateY: 180, scale: 1.15 }}
                    transition={{ type: "spring", stiffness: 200, damping: 15 }}
                    className="mb-6 inline-block"
                    style={{ transformStyle: "preserve-3d" }}
                  >
                    <service.icon className="text-primary" size={30} strokeWidth={1.5} />
                  </motion.div>

                  <h3 className="font-serif text-2xl md:text-3xl font-black mb-4 text-white group-hover:text-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-white/65 text-sm md:text-base leading-relaxed font-sans">
                    {service.description}
                  </p>

                  <div className="absolute bottom-0 left-8 right-8 h-[2px] bg-primary/0 group-hover:bg-primary/40 transition-all duration-500" />
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
