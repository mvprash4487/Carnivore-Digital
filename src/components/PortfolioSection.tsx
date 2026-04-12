import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    title: "Ocean Marina",
    category: "Branding & Web",
    color: "from-blue-900/80 to-blue-600/40",
  },
  {
    title: "Thara Thong",
    category: "Photography & Design",
    color: "from-amber-900/80 to-amber-600/40",
  },
  {
    title: "Burger & Lobster",
    category: "Digital Marketing",
    color: "from-red-900/80 to-red-600/40",
  },
  {
    title: "Canolini",
    category: "Brand Identity",
    color: "from-emerald-900/80 to-emerald-600/40",
  },
  {
    title: "ROSH",
    category: "UX/UI Design",
    color: "from-purple-900/80 to-purple-600/40",
  },
  {
    title: "Aspira",
    category: "Web & SEO",
    color: "from-cyan-900/80 to-cyan-600/40",
  },
];

const PortfolioSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="work" className="py-32 md:py-44 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-sans mb-4">03 — Selected Work</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Our <span className="text-gold-gradient italic">Portfolio</span>
          </h2>
        </motion.div>

        {/* Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, i) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 40 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15 * i }}
              className={`group relative overflow-hidden rounded-lg cursor-pointer ${
                i === 0 || i === 3 ? "md:row-span-2 aspect-[3/4]" : "aspect-square"
              }`}
            >
              {/* Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${project.color}`} />
              <div className="absolute inset-0 bg-charcoal/40" />

              {/* Pattern overlay */}
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: "radial-gradient(circle at 2px 2px, hsl(43 52% 54% / 0.3) 1px, transparent 0)", backgroundSize: "24px 24px" }}
              />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs tracking-[0.3em] uppercase text-primary/80 font-sans mb-2">{project.category}</p>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">{project.title}</h3>
                </div>
                <div className="h-[1px] bg-primary/0 group-hover:bg-primary/50 transition-all duration-500 mt-4" />
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 transition-all duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
