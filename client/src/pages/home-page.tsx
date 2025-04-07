import { useEffect } from "react";
import HeroSection from "@/components/home/hero-section";
import QuickActions from "@/components/home/quick-actions";
import RecentReports from "@/components/home/recent-reports";
import NearbyVets from "@/components/home/nearby-vets";
import { useQuery } from "@tanstack/react-query";
import { Report, Vet } from "@shared/schema";

const HomePage = () => {
  // Fetch recent reports
  const { data: reports } = useQuery<Report[]>({
    queryKey: ["/api/reports?limit=3"],
  });

  // Fetch veterinarians
  const { data: vets } = useQuery<Vet[]>({
    queryKey: ["/api/vets"],
  });

  // Set document title
  useEffect(() => {
    document.title = "AnimalSOS - Animal Rescue & Welfare Platform";
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <HeroSection />
      <QuickActions />
      <RecentReports reports={reports || []} />
      <NearbyVets vets={vets || []} />
    </div>
  );
};

export default HomePage;
