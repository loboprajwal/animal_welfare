import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Star, MapIcon } from "lucide-react";
import { Vet } from "@shared/schema";

interface NearbyVetsProps {
  vets: Vet[];
}

const NearbyVets: React.FC<NearbyVetsProps> = ({ vets }) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Render star ratings for a vet
  const renderRating = (rating: number | undefined) => {
    if (!rating) return null;
    
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    
    return (
      <div className="flex items-center my-1">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star className="h-4 w-4 text-yellow-400" />
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-yellow-400" />
        ))}
        <span className="text-sm text-neutral-500 ml-1">({rating.toFixed(1)})</span>
      </div>
    );
  };

  return (
    <section className="py-12 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center mb-8">Find Veterinarians Nearby</h2>
        
        <div className="bg-neutral-50 p-4 rounded-lg shadow-md mb-8">
          <div className="flex flex-wrap gap-4">
            <div className="flex-grow">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                <Input
                  type="text"
                  placeholder="Enter your location"
                  className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            <div>
              <Button className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary-dark transition-colors">
                Search
              </Button>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-2 bg-neutral-200 rounded-lg overflow-hidden h-[400px]">
            {/* Google Maps API would be implemented here */}
            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
              <div className="text-center">
                <MapIcon className="h-16 w-16 text-neutral-400 mb-4" />
                <p className="text-neutral-500">Map showing nearby veterinarians</p>
              </div>
            </div>
          </div>
          
          {/* Vet Listings */}
          <div className="h-[400px] overflow-y-auto pr-2">
            <h3 className="font-heading font-semibold text-xl mb-4">Nearby Veterinarians</h3>
            
            {vets.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-neutral-500">No veterinarians found nearby.</p>
              </div>
            ) : (
              vets.map((vet) => (
                <Card key={vet.id} className="mb-3 shadow-sm hover:shadow-md transition-shadow border border-neutral-200">
                  <CardContent className="p-4">
                    <h4 className="font-heading font-medium text-lg">{vet.name}</h4>
                    {renderRating(vet.rating)}
                    <p className="text-sm text-neutral-600 mb-2 flex items-center">
                      <MapPin className="h-4 w-4 text-neutral-500 mr-1" />
                      {vet.address}
                    </p>
                    <p className="text-sm text-neutral-600 mb-2 flex items-center">
                      <Phone className="h-4 w-4 text-neutral-500 mr-1" />
                      {vet.phone}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      {vet.isOpen ? (
                        <Badge variant="outline" className="text-xs text-green-600 bg-green-100 hover:bg-green-100">Open Now</Badge>
                      ) : (
                        <Badge variant="outline" className="text-xs text-red-600 bg-red-100 hover:bg-red-100">Closed</Badge>
                      )}
                      <Button variant="link" className="text-primary text-sm font-medium hover:underline">
                        Get Directions
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NearbyVets;
