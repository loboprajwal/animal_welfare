import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Adoption } from "@shared/schema";

interface AdoptionSectionProps {
  adoptions: Adoption[];
}

const AdoptionSection: React.FC<AdoptionSectionProps> = ({ adoptions }) => {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  // Filter adoptions based on selected filter
  const filteredAdoptions = activeFilter === "all" 
    ? adoptions 
    : adoptions.filter(pet => pet.type.toLowerCase() === activeFilter.toLowerCase());

  // Sample pet images by type (in real app we'd use actual imageUrl from the database)
  const getPetImage = (type: string, id: number) => {
    const images = {
      dog: [
        "https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
        "https://images.unsplash.com/photo-1541599188000-695de4cedd22?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      ],
      cat: [
        "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      ],
      bird: [
        "https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
      ],
    };
    
    const typeImages = images[type.toLowerCase() as keyof typeof images] || [];
    return typeImages[id % typeImages.length] || "https://images.unsplash.com/photo-1601979031925-424e53b6caaa";
  };

  return (
    <section className="py-12 bg-neutral-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-heading font-bold text-2xl md:text-3xl">Pets for Adoption</h2>
          <Link href="/adopt" className="text-primary font-medium hover:underline flex items-center">
            View All <span className="ml-1">→</span>
          </Link>
        </div>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-3 mb-6">
          <Button 
            variant={activeFilter === "all" ? "default" : "outline"}
            onClick={() => setActiveFilter("all")}
            className={activeFilter === "all" ? "bg-primary text-white" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"}
          >
            All Pets
          </Button>
          <Button 
            variant={activeFilter === "dog" ? "default" : "outline"}
            onClick={() => setActiveFilter("dog")}
            className={activeFilter === "dog" ? "bg-primary text-white" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"}
          >
            Dogs
          </Button>
          <Button 
            variant={activeFilter === "cat" ? "default" : "outline"}
            onClick={() => setActiveFilter("cat")}
            className={activeFilter === "cat" ? "bg-primary text-white" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"}
          >
            Cats
          </Button>
          <Button 
            variant={activeFilter === "bird" ? "default" : "outline"}
            onClick={() => setActiveFilter("bird")}
            className={activeFilter === "bird" ? "bg-primary text-white" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"}
          >
            Birds
          </Button>
          <Button 
            variant={activeFilter === "other" ? "default" : "outline"}
            onClick={() => setActiveFilter("other")}
            className={activeFilter === "other" ? "bg-primary text-white" : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50"}
          >
            Other
          </Button>
        </div>
        
        {adoptions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-neutral-500">No pets available for adoption at the moment.</p>
            <p className="text-neutral-500 mt-2">Check back soon or contact us to be notified when new pets arrive.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAdoptions.slice(0, 4).map((pet) => (
              <Card key={pet.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-neutral-200">
                <div className="relative">
                  <img
                    src={pet.imageUrl || getPetImage(pet.type, pet.id)}
                    alt={`${pet.name} - ${pet.breed || pet.type}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3">
                    <Badge className="bg-secondary text-white hover:bg-secondary">{pet.type}</Badge>
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-heading font-semibold text-lg">{pet.name}</h3>
                    <span className="text-neutral-500 text-sm">{pet.age}</span>
                  </div>
                  <p className="text-neutral-600 text-sm mb-3">{pet.breed || pet.type} • {pet.gender}</p>
                  <p className="text-neutral-600 text-xs mb-3 line-clamp-2">{pet.description}</p>
                  <Button className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors">
                    Adopt Me
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default AdoptionSection;
