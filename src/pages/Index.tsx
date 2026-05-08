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

const ScrollScene = lazy(() => import("@/components/three/ScrollScene"));

const Index = () => {
  return (
    <SmoothScroll>
      <div className="bg-background text-foreground min-h-screen relative">
        <Suspense fallback={null}>
          <ScrollScene />
        </Suspense>
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
