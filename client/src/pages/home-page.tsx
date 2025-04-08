import { useEffect } from "react";
import HeroSection from "@/components/home/hero-section";
import QuickActions from "@/components/home/quick-actions";

const HomePage = () => {
  // Set document title
  useEffect(() => {
    document.title = "AnimalSOS - Animal Rescue & Welfare Platform";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <QuickActions />
    </div>
  );
};

export default HomePage;
