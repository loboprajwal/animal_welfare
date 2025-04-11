import { useEffect } from "react";
import HeroSection from "../components/home/hero-section";

const HomePage = () => {
  // Set document title
  useEffect(() => {
    document.title = "AnimalSOS - Animal Rescue & Welfare Platform";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
    </div>
  );
};

export default HomePage;