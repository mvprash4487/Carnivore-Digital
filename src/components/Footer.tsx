const Footer = () => {
  return (
    <footer className="py-12 border-t border-border bg-charcoal/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="font-serif text-lg">
          <span className="text-gold-gradient">CARNIVORE</span>
          <span className="text-foreground ml-1 font-light">DIGITAL</span>
        </div>

        <div className="flex items-center gap-8">
          {["Facebook", "Instagram", "LinkedIn"].map((social) => (
            <a
              key={social}
              href="#"
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground hover:text-primary transition-colors duration-300 font-sans"
            >
              {social}
            </a>
          ))}
        </div>

        <p className="text-xs text-muted-foreground/50 font-sans">
          © {new Date().getFullYear()} Carnivore Digital. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
