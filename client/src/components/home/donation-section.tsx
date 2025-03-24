import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Donation } from "@shared/schema";

interface DonationSectionProps {
  donations: Donation[];
}

const DonationSection: React.FC<DonationSectionProps> = ({ donations }) => {
  // Calculate progress percentage for a donation campaign
  const calculateProgress = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  // Sample donation images (in real app we'd use actual imageUrl from the database)
  const getDonationImage = (id: number) => {
    const images = [
      "https://images.unsplash.com/photo-1604848698030-c434ba08ece1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1600443588173-5f984fca0d7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    ];
    
    return images[id % images.length];
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center mb-8">Support Animal Welfare</h2>
        <p className="text-neutral-600 text-center max-w-2xl mx-auto mb-10">
          Your donations help provide food, shelter, medical care, and rescue operations for animals in need. Choose a cause to support below.
        </p>
        
        {donations.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-neutral-500">No active donation campaigns at the moment.</p>
            <Link href="/donate">
              <Button className="mt-4 bg-primary hover:bg-primary-dark">Contact Us to Start a Campaign</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {donations.map((donation) => {
              const progressPercentage = calculateProgress(donation.raisedAmount, donation.goalAmount);
              
              return (
                <Card key={donation.id} className="bg-neutral-50 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img
                    src={donation.imageUrl || getDonationImage(donation.id)}
                    alt={donation.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-5">
                    <h3 className="font-heading font-semibold text-lg mb-2">{donation.title}</h3>
                    <p className="text-neutral-600 text-sm mb-4">{donation.description}</p>
                    <div className="mb-4">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium">₹{donation.raisedAmount.toLocaleString()}</span>
                        <span className="text-neutral-500">of ₹{donation.goalAmount.toLocaleString()} goal</span>
                      </div>
                      <Progress value={progressPercentage} className="h-2 bg-neutral-200" />
                    </div>
                    <Button className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors">
                      Donate Now
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default DonationSection;
