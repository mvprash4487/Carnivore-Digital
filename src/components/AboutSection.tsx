import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const AboutSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="py-32 md:py-44 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid md:grid-cols-12 gap-12 md:gap-20 items-start">
          {/* Left: Editorial Number */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 1 }}
            className="md:col-span-4"
          >
            <span className="font-serif text-[8rem] md:text-[12rem] font-bold leading-none text-gold-gradient opacity-20">
              01
            </span>
            <div className="mt-4">
              <div className="h-[1px] w-16 bg-primary mb-4" />
              <p className="text-xs tracking-[0.3em] uppercase text-primary font-sans">Who We Are</p>
            </div>
          </motion.div>

          {/* Right: Content */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            className="md:col-span-8"
          >
            <h2 className="font-serif text-3xl md:text-5xl font-bold leading-tight mb-8">
              A Digital Agency That
              <br />
              <span className="text-gold-gradient italic">Means Business</span>
            </h2>

            <div className="space-y-6 text-muted-foreground font-sans leading-[1.8] text-sm md:text-base">
              <p>
                Carnivore Digital is a full-service digital agency based in Bangkok, Thailand. 
                We specialize in creating stunning digital experiences that drive results and 
                leave lasting impressions.
              </p>
              <p>
                Our team of designers, developers, and strategists work together to deliver 
                solutions that not only look beautiful but perform exceptionally. From brand 
                identity to digital marketing, we cover every aspect of your digital presence.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-14 pt-14 border-t border-border">
              {[
                { number: "2015", label: "Founded" },
                { number: "150+", label: "Projects" },
                { number: "50+", label: "Clients" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={inView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.8, delay: 0.6 + i * 0.15 }}
                >
                  <p className="font-serif text-2xl md:text-4xl font-bold text-primary">{stat.number}</p>
                  <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mt-2 font-sans">{stat.label}</p>
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
