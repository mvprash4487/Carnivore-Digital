import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import SplitTextReveal from "@/components/motion/SplitTextReveal";
import TiltCard3D from "@/components/motion/TiltCard3D";
import GlowOrb from "@/components/motion/GlowOrb";
import { ParallaxLayer } from "@/components/motion/ParallaxSection";

const stats = [
  { number: "2015", label: "On the Street" },
  { number: "150+", label: "Projects Run"  },
  { number: "50+",  label: "Brands Fed"   },
];

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const lineRef = useRef(null);
  const lineInView = useInView(lineRef, { once: true, margin: "-80px" });

  return (
    <section id="about" className="py-32 md:py-44 relative overflow-hidden" ref={ref}>
      <GlowOrb size={500} opacity={0.03} blur={100} x="85%" y="60%" animationDuration={11} />

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">

          {/* Left: editorial number with parallax */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="md:col-span-4"
          >
            <ParallaxLayer speed={0.2} className="relative">
              <span className="font-serif text-[8rem] md:text-[12rem] font-black leading-none text-gold-gradient opacity-40 select-none">
                01
              </span>
            </ParallaxLayer>
            <div className="mt-4">
              <motion.div
                ref={lineRef}
                className="h-[2px] bg-primary mb-4"
                initial={{ scaleX: 0 }}
                animate={lineInView ? { scaleX: 1 } : {}}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ originX: 0, width: 64 }}
              />
              <p className="text-xs sm:text-sm tracking-[0.25em] uppercase text-primary font-sans font-medium">On the Ground</p>
            </div>
          </motion.div>

          {/* Right: content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="md:col-span-8"
          >
            <SplitTextReveal
              text="Running Since 2015."
              tag="h2"
              className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-[1.0] mb-2 text-white text-shadow-hard"
              delay={0.2}
              staggerDelay={0.025}
            />
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-black leading-[1.0] mb-8">
              <span className="text-gold-gradient italic">Still Hungry.</span>
            </h2>

            <div className="space-y-5 font-sans leading-[1.85] text-sm md:text-base text-white/65">
              <p>
                Carnivore Digital is a full-service digital agency based in Bangkok, Thailand.
                We move fast, we move smart, and we don't stop until the work hits.
              </p>
              <p>
                Designers, developers, and strategists in lockstep — delivering work that
                doesn't just look sharp, it performs. Every discipline under one roof,
                every project treated like it's the most important one on the street.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-6 md:gap-8 mt-14 pt-14 border-t border-border">
              {stats.map((stat, i) => (
                <TiltCard3D key={stat.label} maxTilt={8} className="rounded-lg">
                  <motion.div
                    initial={{ opacity: 0, y: 20, rotateX: 20 }}
                    animate={inView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                    className="p-4"
                  >
                    <p className="font-serif text-3xl sm:text-4xl md:text-5xl font-black text-primary">{stat.number}</p>
                    <p className="text-xs sm:text-sm tracking-[0.2em] uppercase text-white/60 mt-2 font-sans">{stat.label}</p>
                  </motion.div>
                </TiltCard3D>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
