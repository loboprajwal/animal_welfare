import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Adoption } from '@shared/schema';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Ruler, ArrowRight, Heart } from 'lucide-react';
import { Link } from 'wouter';

const AdoptionSection = () => {
  const [filters, setFilters] = useState({
    type: 'All Animals',
    age: 'All Ages',
    size: 'All Sizes',
    location: '',
  });

  const handleFilterChange = (name: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const { data: adoptionData, isLoading, error } = useQuery<Adoption[]>({
    queryKey: ['/api/adoptions'],
  });

  // Mock data for display
  const mockAdoptions: Adoption[] = [
    {
      id: 1,
      name: 'Max',
      type: 'Dog',
      breed: 'Golden Retriever Mix',
      age: '3 years',
      size: 'Medium',
      gender: 'Male',
      description: 'Max is a friendly and energetic dog who loves to play fetch and go for long walks. He\'s great with children and other pets.',
      imageUrls: ['https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'],
      shelter: 'Paws Shelter',
      status: 'available',
      distance: '2.5 miles',
    },
    {
      id: 2,
      name: 'Luna',
      type: 'Cat',
      breed: 'Calico',
      age: '2 years',
      size: 'Small',
      gender: 'Female',
      description: 'Luna is a sweet and affectionate cat who enjoys cuddling on the couch. She\'s litter trained and good with calm households.',
      imageUrls: ['https://images.unsplash.com/photo-1543852786-1cf6624b9987?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'],
      shelter: 'Whiskers Rescue',
      status: 'available',
      distance: '4 miles',
    },
    {
      id: 3,
      name: 'Bailey',
      type: 'Dog',
      breed: 'Border Collie',
      age: '1 year',
      size: 'Medium',
      gender: 'Female',
      description: 'Bailey is an intelligent and active dog who loves learning new tricks. Perfect for active families who can give her plenty of exercise.',
      imageUrls: ['https://images.unsplash.com/photo-1450778869180-41d0601e046e?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80'],
      shelter: 'Happy Tails',
      status: 'available',
      distance: '1.7 miles',
    },
  ];

  const displayAdoptions = adoptionData || mockAdoptions;

  return (
    <div className="max-w-6xl mx-auto">
      <Card className="bg-white p-4 rounded-lg shadow mb-8">
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-1">
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange('type', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Animal Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Animals">All Animals</SelectItem>
                  <SelectItem value="Dog">Dogs</SelectItem>
                  <SelectItem value="Cat">Cats</SelectItem>
                  <SelectItem value="Bird">Birds</SelectItem>
                  <SelectItem value="Small Pets">Small Pets</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Select
                value={filters.age}
                onValueChange={(value) => handleFilterChange('age', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Age" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Ages">All Ages</SelectItem>
                  <SelectItem value="Baby">Baby</SelectItem>
                  <SelectItem value="Young">Young</SelectItem>
                  <SelectItem value="Adult">Adult</SelectItem>
                  <SelectItem value="Senior">Senior</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Select
                value={filters.size}
                onValueChange={(value) => handleFilterChange('size', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Sizes">All Sizes</SelectItem>
                  <SelectItem value="Small">Small</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-1">
              <Input
                type="text"
                placeholder="Search by location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <p className="col-span-full text-center py-10">Loading adoptable pets...</p>
        ) : error ? (
          <p className="col-span-full text-center py-10 text-red-500">
            Error loading adoptable pets. Please try again.
          </p>
        ) : (
          displayAdoptions.map((pet) => (
            <Card key={pet.id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-md transition-shadow">
              <div className="relative h-48 w-full overflow-hidden">
                <img
                  src={pet.imageUrls?.[0]}
                  alt={`${pet.name} - ${pet.breed}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-0 right-0 mt-2 mr-2">
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                    Available
                  </Badge>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold text-neutral-dark">{pet.name}</h3>
                  <span className="text-sm text-neutral-medium">{pet.breed}</span>
                </div>
                <div className="flex items-center mb-3 text-sm text-neutral-medium">
                  <span className="mr-3 flex items-center">
                    <Calendar className="mr-1 h-4 w-4" /> {pet.age}
                  </span>
                  <span className="mr-3 flex items-center">
                    <Ruler className="mr-1 h-4 w-4" /> {pet.size}
                  </span>
                  <span className="flex items-center">
                    {pet.gender === 'Male' ? (
                      <svg
                        className="mr-1 h-4 w-4 text-blue-500"
                        fill="currentColor"
                        viewBox="0 0 384 512"
                      >
                        <path d="M32 32c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V64C0 46.3 14.3 32 32 32zm96 32c0-17.7 14.3-32 32-32s32 14.3 32 32v106.7C218.1 143.4 256.3 128 296 128c28.4 0 54.5 9.5 75.5 25.5c11.1 8.5 13.2 24.5 4.8 35.6s-24.3 13.2-35.4 4.8C329.3 185 313.3 180 296 180c-53 0-96 43-96 96s43 96 96 96c17.3 0 33.3-5 45.9-13.9c11.1-8.5 27.1-6.5 35.5 4.7s6.5 27.1-4.6 35.5C351.7 414.4 325.2 424 296 424c-39.7 0-77.9-15.4-104-41.7V480c0 17.7-14.3 32-32 32s-32-14.3-32-32V350.2h0V320 64z" />
                      </svg>
                    ) : (
                      <svg
                        className="mr-1 h-4 w-4 text-pink-500"
                        fill="currentColor"
                        viewBox="0 0 384 512"
                      >
                        <path d="M304 176c0 61.9-50.1 112-112 112s-112-50.1-112-112S130.1 64 192 64s112 50.1 112 112zM224 349.1c81.9-15 144-86.8 144-173.1C368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144 173.1V384H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H224V349.1z" />
                      </svg>
                    )}
                    {pet.gender}
                  </span>
                </div>
                <p className="text-sm text-neutral-medium mb-4 line-clamp-3">
                  {pet.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-neutral-medium flex items-center">
                    <MapPin className="mr-1 h-4 w-4" />
                    {pet.shelter}, {pet.distance}
                  </span>
                  <Link href={`/adoption/${pet.id}`}>
                    <Button variant="link" className="text-primary hover:text-primary-dark p-0">
                      View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="mt-8 text-center">
        <Button
          variant="outline"
          className="text-gray-700 bg-white hover:bg-gray-50 focus:ring-primary"
        >
          View More Pets <Heart className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default AdoptionSection;
