import logo from "@/assets/logo-carnivore.png";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-charcoal/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 py-2">
        <a href="#" className="flex items-center h-16 md:h-20">
          <img src={logo} alt="Carnivore Digital" className="h-full w-auto" />
        </a>

        <div className="flex items-center gap-8">
          <a
            href="https://www.linkedin.com/company/72004968/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 font-sans"
          >
            LinkedIn
          </a>
        </div>

        <p className="text-xs text-muted-foreground/50 font-sans">
          © {new Date().getFullYear()} Carnivore Digital. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
