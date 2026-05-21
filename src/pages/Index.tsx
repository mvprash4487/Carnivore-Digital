import { lazy, Suspense } from "react";
import Navigation from "@/components/Navigation";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ServicesSection from "@/components/ServicesSection";
import PortfolioSection from "@/components/PortfolioSection";
import ClientsSection from "@/components/ClientsSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

const ScrollFacadeBackground = lazy(() => import("@/components/ScrollFacadeBackground"));

const Index = () => {
  return (
    <SmoothScroll>
      <Suspense fallback={null}>
        <LiquidGoldScene />
      </Suspense>
      <div className="relative z-10 text-foreground min-h-screen">
        <Navigation />
        <HeroSection />
        <AboutSection />
        <ServicesSection />
        <PortfolioSection />
        <ClientsSection />
        <ContactSection />
        <Footer />
      </div>
    </SmoothScroll>
  );
};

export default Index;
