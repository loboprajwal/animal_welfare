import { useEffect } from "react";
import HeroSection from "@/components/home/hero-section";
import QuickActions from "@/components/home/quick-actions";
import RecentReports from "@/components/home/recent-reports";
import NearbyVets from "@/components/home/nearby-vets";
import AdoptionSection from "@/components/home/adoption-section";
import Testimonials from "@/components/home/testimonials";
import CTASection from "@/components/home/cta-section";
import { useQuery } from "@tanstack/react-query";
import { Report, Vet, Adoption } from "@shared/schema";

const HomePage = () => {
  // Fetch recent reports
  const { data: reports } = useQuery<Report[]>({
    queryKey: ["/api/reports?limit=3"],
  });

  // Fetch veterinarians
  const { data: vets } = useQuery<Vet[]>({
    queryKey: ["/api/vets"],
  });

  // Fetch adoption pets
  const { data: adoptions } = useQuery<Adoption[]>({
    queryKey: ["/api/adoptions"],
  });

  // Donations section removed as per user request

  // Set document title
  useEffect(() => {
    document.title = "AnimalSOS - Animal Rescue & Welfare Platform";
  }, []);

  return (
    <div>
      <HeroSection />
      <QuickActions />
      <RecentReports reports={reports || []} />
      <NearbyVets vets={vets || []} />
      <AdoptionSection adoptions={adoptions || []} />
      <Testimonials />
      <CTASection />
    </div>
  );
};

export default HomePage;
