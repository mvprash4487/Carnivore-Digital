import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Palette, TrendingUp, Camera, Layers, Globe } from "lucide-react";
import TiltCard3D from "@/components/motion/TiltCard3D";
import SplitTextReveal from "@/components/motion/SplitTextReveal";

const services = [
  {
    floor: "01",
    icon: Palette,
    title: "UX / UI Design",
    description: "Interfaces that stop the scroll. Built for humans, sharpened by data, designed to convert.",
  },
  {
    floor: "02",
    icon: TrendingUp,
    title: "Digital Marketing",
    description: "We put your brand in front of the right people and make them act. Data-driven, street-smart.",
  },
  {
    floor: "03",
    icon: Camera,
    title: "Photo & Video",
    description: "Visual content with bite. Product photography to brand films — we make people stop and look.",
  },
  {
    floor: "04",
    icon: Layers,
    title: "Branding",
    description: "Identity built to outlast the competition. Sharp, distinctive, and impossible to ignore.",
  },
  {
    floor: "05",
    icon: Globe,
    title: "Web Design & SEO",
    description: "Fast sites, ranked high, built to close. Your digital presence working as hard as you do.",
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="font-serif text-[8rem] md:text-[12rem] font-black leading-none text-gold-gradient opacity-40 select-none block">
              02
            </span>
            <motion.div
              className="h-[2px] bg-primary mb-4 mx-auto"
              initial={{ scaleX: 0 }}
              animate={headInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0.5, width: 64 }}
            />
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-sans font-medium mb-5">
              What We Do
            </p>
          </motion.div>
          <SplitTextReveal
            text="Five Disciplines. One Team."
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
            Pick your weapon. We've sharpened every one of them.
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
                    <span className="text-[10px] tracking-[0.15em] text-primary font-sans font-semibold">{service.floor}</span>
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
