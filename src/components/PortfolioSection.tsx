import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import lobster from "@/assets/lobster.jpg";
import burgerChef from "@/assets/burger-chef.jpg";
import truffle from "@/assets/truffle.jpg";
import chefPlating from "@/assets/chef-plating.jpg";
import wineGlasses from "@/assets/wine-glasses.jpg";
import burgerLobster from "@/assets/burger-lobster.jpg";

const projects = [
  { suite: "Suite 01", title: "Ocean Marina",     category: "Branding & Web",      image: wineGlasses   },
  { suite: "Suite 02", title: "Thara Thong",      category: "Photography & Design", image: truffle       },
  { suite: "Suite 03", title: "Burger & Lobster", category: "Digital Marketing",    image: lobster       },
  { suite: "Suite 04", title: "Canolini",         category: "Brand Identity",       image: burgerChef    },
  { suite: "Suite 05", title: "ROSH",             category: "UX/UI Design",         image: chefPlating   },
  { suite: "Suite 06", title: "Aspira",           category: "Web & SEO",            image: burgerLobster },
];

const PortfolioSection = () => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="work" className="py-32 md:py-44 relative" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1 }}
          className="mb-20"
        >
          <p className="text-xs tracking-[0.4em] uppercase text-primary font-sans mb-4">03 — The Penthouse Collection</p>
          <h2 className="font-serif text-3xl md:text-5xl font-bold">
            Our Most Coveted <span className="text-gold-gradient italic">Suites</span>
          </h2>
        </motion.div>

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
              <img
                src={project.image}
                alt={project.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent group-hover:from-background/80 transition-all duration-500" />
              <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-[10px] tracking-[0.3em] uppercase text-primary/60 font-sans mb-1">{project.suite}</p>
                  <p className="text-xs tracking-[0.2em] uppercase text-primary/80 font-sans mb-2">{project.category}</p>
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
