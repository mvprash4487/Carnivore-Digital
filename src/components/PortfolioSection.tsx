import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const projects = [
  {
    title: "Ocean Marina",
    category: "Branding & Web",
    image: "/images/portfolio/ocean-marina.jpg",
  },
  {
    title: "Thara Thong",
    category: "Photography & Design",
    image: "/images/portfolio/thara-thong.jpg",
  },
  {
    title: "Burger & Lobster",
    category: "Digital Marketing",
    image: "/images/portfolio/burger-lobster.jpg",
  },
  {
    title: "Canolini",
    category: "Brand Identity",
    image: "/images/portfolio/canolini.jpg",
  },
  {
    title: "ROSH",
    category: "UX/UI Design",
    image: "/images/portfolio/rosh.jpg",
  },
  {
    title: "Aspira",
    category: "Web & SEO",
    image: "/images/portfolio/aspira.jpg",
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
              {/* Project Image */}
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-background/50 group-hover:bg-background/30 transition-all duration-500" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-xs tracking-[0.3em] uppercase text-primary/80 font-sans mb-2">{project.category}</p>
                  <h3 className="font-serif text-xl md:text-2xl font-bold text-foreground">{project.title}</h3>
                </div>
                <div className="h-[1px] bg-primary/0 group-hover:bg-primary/50 transition-all duration-500 mt-4" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PortfolioSection;
