import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import lobster from "@/assets/lobster.jpg";
import burgerChef from "@/assets/burger-chef.jpg";
import truffle from "@/assets/truffle.jpg";
import chefPlating from "@/assets/chef-plating.jpg";
import wineGlasses from "@/assets/wine-glasses.jpg";
import burgerLobster from "@/assets/burger-lobster.jpg";
import TiltCard3D from "@/components/motion/TiltCard3D";
import SplitTextReveal from "@/components/motion/SplitTextReveal";

const projects = [
  { suite: "Case 01", title: "Ocean Marina",     category: "Branding & Web",       image: wineGlasses   },
  { suite: "Case 02", title: "Thara Thong",      category: "Photography & Design",  image: truffle       },
  { suite: "Case 03", title: "Burger & Lobster", category: "Digital Marketing",     image: lobster       },
  { suite: "Case 04", title: "Canolini",         category: "Brand Identity",        image: burgerChef    },
  { suite: "Case 05", title: "ROSH",             category: "UX/UI Design",          image: chefPlating   },
  { suite: "Case 06", title: "Aspira",           category: "Web & SEO",             image: burgerLobster },
];

const cardVariants = {
  hidden: { opacity: 0, rotateY: -15, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    rotateY: 0,
    scale: 1,
    transition: {
      duration: 0.9,
      delay: 0.1 * i,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

const PortfolioSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const headRef = useRef(null);
  const headInView = useInView(headRef, { once: true, margin: "-80px" });

  return (
    <section id="work" className="py-32 md:py-44 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">

        <div ref={headRef} className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={headInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
          >
            <span className="font-serif text-[8rem] md:text-[12rem] font-black leading-none text-gold-gradient opacity-40 select-none block">
              03
            </span>
            <motion.div
              className="h-[2px] bg-primary mb-4"
              initial={{ scaleX: 0 }}
              animate={headInView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ originX: 0, width: 64 }}
            />
            <p className="text-xs sm:text-sm tracking-[0.3em] uppercase text-primary font-sans font-medium mb-5">
              The Work
            </p>
          </motion.div>
          <SplitTextReveal
            text="Campaigns That Landed"
            tag="h2"
            className="font-serif text-4xl sm:text-5xl md:text-6xl font-black text-white text-shadow-hard"
            delay={0.1}
            staggerDelay={0.03}
          />
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6"
          style={{ perspective: "1200px" }}
        >
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              animate={inView ? "visible" : "hidden"}
              data-cursor-view
              style={{ willChange: "transform, opacity" }}
              className={`${i === 0 || i === 3 ? "md:row-span-2" : ""}`}
            >
              <TiltCard3D
                maxTilt={8}
                className={`relative overflow-hidden rounded-lg cursor-pointer w-full h-full ${
                  i === 0 || i === 3 ? "aspect-[3/4]" : "aspect-square"
                }`}
              >
                <div className="group relative w-full h-full">
                  <motion.img
                    src={project.image}
                    alt={project.title}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover"
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/90 transition-all duration-500" />
                  <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
                    <motion.div
                      initial={{ y: 12, opacity: 0.8 }}
                      whileHover={{ y: 0, opacity: 1 }}
                      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p className="text-[10px] tracking-[0.25em] uppercase text-primary/70 font-sans font-medium mb-1">{project.suite}</p>
                      <p className="text-xs tracking-[0.25em] uppercase text-white/60 font-sans mb-2">{project.category}</p>
                      <h3 className="font-serif text-xl sm:text-2xl md:text-3xl font-black text-white">{project.title}</h3>
                    </motion.div>
                    <motion.div
                      className="h-[2px] bg-primary mt-4"
                      initial={{ scaleX: 0 }}
                      whileHover={{ scaleX: 1 }}
                      transition={{ duration: 0.4 }}
                      style={{ originX: 0 }}
                    />
                  </div>
                </div>
              </TiltCard3D>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
