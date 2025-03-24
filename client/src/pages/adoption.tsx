import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Adoption } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  Filter,
  Dog as Paw,
  Heart,
  RefreshCw,
  DogIcon,
  CatIcon,
  BirdIcon,
  MouseIcon,
} from "lucide-react";

const AdoptionPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [animalType, setAnimalType] = useState("all");
  const [filteredPets, setFilteredPets] = useState<Adoption[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Adopt a Pet - AnimalSOS";
  }, []);

  // Get adoption data
  const { data: adoptions, isLoading } = useQuery<Adoption[]>({
    queryKey: ["/api/adoptions"],
  });

  // Filter pets when search query or animal type changes
  useEffect(() => {
    if (!adoptions) return;

    let filtered = [...adoptions];

    // Filter by type
    if (animalType !== "all") {
      filtered = filtered.filter(
        (pet) => pet.type.toLowerCase() === animalType.toLowerCase()
      );
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(query) ||
          pet.breed?.toLowerCase().includes(query) ||
          pet.description.toLowerCase().includes(query)
      );
    }

    setFilteredPets(filtered);
  }, [searchQuery, animalType, adoptions]);

  // Sample pet images by type (in real app we'd use actual imageUrl from database)
  const getPetImage = (pet: Adoption) => {
    if (pet.imageUrl) return pet.imageUrl;

    const type = pet.type.toLowerCase();
    if (type === "dog") {
      return `https://images.unsplash.com/photo-1601979031925-424e53b6caaa?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`;
    } else if (type === "cat") {
      return `https://images.unsplash.com/photo-1592194996308-7b43878e84a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`;
    } else if (type === "bird") {
      return `https://images.unsplash.com/photo-1548767797-d8c844163c4c?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`;
    } else {
      return `https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80`;
    }
  };

  const handleAdopt = (pet: Adoption) => {
    toast({
      title: "Adoption Request Sent",
      description: `Thank you for your interest in adopting ${pet.name}. We'll contact you soon for next steps.`,
    });
  };

  const getAnimalIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "dog":
        return <DogIcon className="h-4 w-4" />;
      case "cat":
        return <CatIcon className="h-4 w-4" />;
      case "bird":
        return <BirdIcon className="h-4 w-4" />;
      default:
        return <MouseIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Adopt a Pet</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Give a loving home to animals in need. Browse available pets and find your perfect companion.
        </p>
      </div>

      {/* Search and Filter Section */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
          <Input
            type="text"
            placeholder="Search by name, breed or description"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex-shrink-0 w-full md:w-64">
          <Select value={animalType} onValueChange={setAnimalType}>
            <SelectTrigger className="w-full">
              <div className="flex items-center">
                <Filter className="mr-2 h-4 w-4 text-neutral-500" />
                {animalType === "all" ? (
                  <span>All Animals</span>
                ) : (
                  <span className="flex items-center gap-2">
                    {getAnimalIcon(animalType)}
                    {animalType.charAt(0).toUpperCase() + animalType.slice(1)}
                  </span>
                )}
              </div>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                <div className="flex items-center">
                  <Paw className="mr-2 h-4 w-4 text-neutral-500" />
                  All Animals
                </div>
              </SelectItem>
              <SelectItem value="dog">
                <div className="flex items-center">
                  <DogIcon className="mr-2 h-4 w-4 text-neutral-500" />
                  Dogs
                </div>
              </SelectItem>
              <SelectItem value="cat">
                <div className="flex items-center">
                  <CatIcon className="mr-2 h-4 w-4 text-neutral-500" />
                  Cats
                </div>
              </SelectItem>
              <SelectItem value="bird">
                <div className="flex items-center">
                  <BirdIcon className="mr-2 h-4 w-4 text-neutral-500" />
                  Birds
                </div>
              </SelectItem>
              <SelectItem value="other">
                <div className="flex items-center">
                  <MouseIcon className="mr-2 h-4 w-4 text-neutral-500" />
                  Other
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Stats */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-heading font-semibold text-lg">
          {isLoading ? "Loading..." : `${filteredPets.length} pets available for adoption`}
        </h2>
        {(searchQuery || animalType !== "all") && (
          <Button
            variant="ghost"
            size="sm"
            className="text-neutral-500"
            onClick={() => {
              setSearchQuery("");
              setAnimalType("all");
            }}
          >
            <RefreshCw className="h-3 w-3 mr-1" /> Reset Filters
          </Button>
        )}
      </div>

      {/* Pets Grid */}
      {isLoading ? (
        <div className="py-12 text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
          <p>Loading available pets...</p>
        </div>
      ) : filteredPets.length === 0 ? (
        <div className="py-12 text-center bg-neutral-50 rounded-lg">
          <Paw className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
          <h3 className="text-xl font-heading font-semibold mb-2">No pets found</h3>
          <p className="text-neutral-500 mb-4">
            No pets match your current filter criteria. Try adjusting your filters or check back later.
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setAnimalType("all");
            }}
          >
            View All Pets
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden shadow-md hover:shadow-lg transition-shadow border border-neutral-200">
              <div className="relative">
                <img
                  src={getPetImage(pet)}
                  alt={`${pet.name} - ${pet.breed || pet.type}`}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 right-3">
                  <Badge className="bg-secondary text-white hover:bg-secondary">{pet.type}</Badge>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-3 left-3 bg-white bg-opacity-60 hover:bg-white hover:bg-opacity-80 rounded-full h-7 w-7"
                  onClick={() => {
                    toast({
                      title: "Added to Favorites",
                      description: `${pet.name} has been added to your favorites.`,
                    });
                  }}
                >
                  <Heart className="h-4 w-4 text-accent" />
                </Button>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-heading font-semibold text-lg">{pet.name}</h3>
                  <span className="text-neutral-500 text-sm">{pet.age}</span>
                </div>
                <p className="text-neutral-600 text-sm mb-3">
                  {pet.breed || pet.type} • {pet.gender}
                </p>
                <p className="text-neutral-600 text-xs mb-3 line-clamp-2">{pet.description}</p>
                
                <div>
                  {pet.status === "available" ? (
                    <Button
                      className="w-full bg-primary text-white py-2 rounded hover:bg-primary-dark transition-colors"
                      onClick={() => handleAdopt(pet)}
                    >
                      Adopt Me
                    </Button>
                  ) : pet.status === "pending" ? (
                    <Button
                      className="w-full bg-yellow-500 text-white py-2 rounded hover:bg-yellow-600 transition-colors"
                      disabled
                    >
                      Adoption Pending
                    </Button>
                  ) : (
                    <Button
                      className="w-full bg-neutral-300 text-neutral-700 py-2 rounded transition-colors cursor-not-allowed"
                      disabled
                    >
                      Already Adopted
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Adoption Process */}
      <div className="mt-16 bg-primary bg-opacity-5 p-8 rounded-lg">
        <h2 className="text-2xl font-heading font-semibold text-center mb-8">Adoption Process</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-semibold">1</div>
            <h3 className="font-heading font-semibold text-lg mb-2">Browse & Apply</h3>
            <p className="text-neutral-600">
              Browse available pets and submit an adoption application for the one you connect with.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-semibold">2</div>
            <h3 className="font-heading font-semibold text-lg mb-2">Meet & Greet</h3>
            <p className="text-neutral-600">
              Schedule a meeting with your potential pet to ensure you're a good match for each other.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary text-white flex items-center justify-center mx-auto mb-4 text-xl font-semibold">3</div>
            <h3 className="font-heading font-semibold text-lg mb-2">Welcome Home</h3>
            <p className="text-neutral-600">
              Complete the adoption process and welcome your new family member to their forever home.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdoptionPage;
