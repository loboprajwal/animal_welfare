import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Vet } from "@shared/schema";
import {
  MapPin,
  Phone,
  Star,
  MapIcon,
  Search,
  Mail,
  Navigation,
  RefreshCw,
  List,
  Map,
} from "lucide-react";

const FindVets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredVets, setFilteredVets] = useState<Vet[]>([]);
  const [viewMode, setViewMode] = useState("list");

  // Get vets data
  const { data: vets, isLoading } = useQuery<Vet[]>({
    queryKey: ["/api/vets"],
  });

  useEffect(() => {
    document.title = "Find Veterinarians - AnimalSOS";
  }, []);

  // Filter vets when search query changes
  useEffect(() => {
    if (!vets) return;

    if (!searchQuery.trim()) {
      setFilteredVets(vets);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = vets.filter(
      (vet) =>
        vet.name.toLowerCase().includes(query) ||
        vet.address.toLowerCase().includes(query)
    );
    setFilteredVets(filtered);
  }, [searchQuery, vets]);

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

  // Get directions to a vet (mock function - would use Google Maps API in real app)
  const getDirections = (vet: Vet) => {
    if (vet.latitude && vet.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${vet.latitude},${vet.longitude}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          vet.address
        )}`,
        "_blank"
      );
    }
  };

  const detectLocation = () => {
    // Would integrate with browser geolocation and Google Maps API in a real application
    // For now, just clear the search to show all vets
    setSearchQuery("");
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Find Veterinarians Nearby</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Locate the nearest veterinary clinics for animal emergencies and regular checkups
        </p>
      </div>

      <div className="bg-neutral-50 p-6 rounded-lg shadow-md mb-8">
        <div className="flex flex-wrap gap-4">
          <div className="flex-grow relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by location or clinic name"
              className="w-full pl-10 pr-4 py-6"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div>
            <Button
              onClick={detectLocation}
              className="bg-primary text-white px-6 py-6 h-full rounded-lg hover:bg-primary-dark transition-colors flex items-center"
            >
              <MapPin className="mr-2 h-4 w-4" />
              <span>Detect Location</span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-end mb-4">
        <Tabs value={viewMode} onValueChange={setViewMode}>
          <TabsList>
            <TabsTrigger value="list" className="flex items-center gap-1">
              <List className="h-4 w-4" />
              List View
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-1">
              <Map className="h-4 w-4" />
              Map View
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TabsContent value="list" className="lg:col-span-1 order-2 lg:order-1">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-heading font-semibold text-xl">
                {isLoading ? "Loading..." : `${filteredVets?.length || 0} Clinics Found`}
              </h3>
              {!isLoading && filteredVets?.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-neutral-500"
                  onClick={() => setSearchQuery("")}
                >
                  <RefreshCw className="h-3 w-3 mr-1" /> Reset
                </Button>
              )}
            </div>
            
            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
              {isLoading ? (
                <div className="py-10 text-center">
                  <RefreshCw className="animate-spin h-6 w-6 mx-auto text-primary mb-2" />
                  <p>Loading veterinarians...</p>
                </div>
              ) : filteredVets?.length === 0 ? (
                <div className="py-10 text-center">
                  <p className="text-neutral-500">No veterinarians found matching your search.</p>
                  <Button
                    variant="link"
                    className="text-primary mt-2"
                    onClick={() => setSearchQuery("")}
                  >
                    Clear search
                  </Button>
                </div>
              ) : (
                filteredVets?.map((vet) => (
                  <Card key={vet.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h4 className="font-heading font-medium text-lg">{vet.name}</h4>
                      {renderRating(vet.rating)}
                      <p className="text-sm text-neutral-600 mb-2 flex items-center">
                        <MapPin className="h-4 w-4 text-neutral-500 mr-1 shrink-0" />
                        <span className="line-clamp-1">{vet.address}</span>
                      </p>
                      <p className="text-sm text-neutral-600 mb-2 flex items-center">
                        <Phone className="h-4 w-4 text-neutral-500 mr-1 shrink-0" />
                        <a href={`tel:${vet.phone}`} className="hover:text-primary">
                          {vet.phone}
                        </a>
                      </p>
                      {vet.email && (
                        <p className="text-sm text-neutral-600 mb-2 flex items-center">
                          <Mail className="h-4 w-4 text-neutral-500 mr-1 shrink-0" />
                          <a href={`mailto:${vet.email}`} className="hover:text-primary truncate">
                            {vet.email}
                          </a>
                        </p>
                      )}
                      <div className="flex justify-between items-center mt-3">
                        {vet.isOpen ? (
                          <Badge variant="outline" className="text-xs text-green-600 bg-green-100 hover:bg-green-100">
                            Open Now
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-red-600 bg-red-100 hover:bg-red-100">
                            Closed
                          </Badge>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-primary text-sm font-medium"
                          onClick={() => getDirections(vet)}
                        >
                          <Navigation className="h-3 w-3 mr-1" />
                          Directions
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="map" className="lg:col-span-3 order-1 lg:order-2">
          <div className="bg-neutral-100 rounded-lg overflow-hidden h-[600px] shadow-md">
            {/* Google Maps API would be implemented here */}
            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
              <div className="text-center">
                <MapIcon className="h-16 w-16 text-neutral-400 mb-4" />
                <p className="text-neutral-500 mb-2">Map showing nearby veterinarians</p>
                <p className="text-neutral-400 text-sm max-w-md mx-auto">
                  In a production environment, this would integrate with Google Maps API to show
                  veterinary clinics near the user's location.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="list" className="lg:col-span-2 order-1 lg:order-2">
          <div className="bg-neutral-100 rounded-lg overflow-hidden h-[600px] shadow-md">
            {/* Google Maps API would be implemented here */}
            <div className="w-full h-full flex items-center justify-center bg-neutral-100">
              <div className="text-center">
                <MapIcon className="h-16 w-16 text-neutral-400 mb-4" />
                <p className="text-neutral-500 mb-2">Map showing nearby veterinarians</p>
                <p className="text-neutral-400 text-sm max-w-md mx-auto">
                  In a production environment, this would integrate with Google Maps API to show
                  veterinary clinics near the user's location.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>
      </div>

      <div className="mt-12 text-center">
        <h3 className="text-2xl font-heading font-semibold mb-4">Are you a veterinarian?</h3>
        <p className="text-neutral-600 mb-6 max-w-lg mx-auto">
          Register your clinic on AnimalSOS to help animals in need and connect with pet owners in your area.
        </p>
        <Button className="bg-primary hover:bg-primary-dark">Register Your Clinic</Button>
      </div>
    </div>
  );
};

export default FindVets;
