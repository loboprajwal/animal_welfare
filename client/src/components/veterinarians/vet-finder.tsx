import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getQueryFn } from '@/lib/queryClient';
import { Veterinarian } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const VetFinder = () => {
  const { toast } = useToast();
  const [location, setLocation] = useState('');
  const [searchInitiated, setSearchInitiated] = useState(false);

  const {
    data: vets,
    isLoading,
    error,
    refetch,
  } = useQuery<Veterinarian[]>({
    queryKey: ['/api/veterinarians'],
    enabled: searchInitiated,
  });

  const handleSearch = () => {
    if (!location.trim()) {
      toast({
        title: 'Location required',
        description: 'Please enter a location or use current location',
        variant: 'destructive',
      });
      return;
    }
    
    setSearchInitiated(true);
    refetch();
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          // In a real implementation, we would reverse geocode to get the address
          setLocation('Current location detected');
          setSearchInitiated(true);
          refetch();
        },
        (error) => {
          toast({
            title: 'Location error',
            description: 'Unable to get your current location. Please enter it manually.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation. Please enter your location manually.',
        variant: 'destructive',
      });
    }
  };

  // Mock data for display
  const mockVets: Veterinarian[] = [
    {
      id: 1,
      name: 'City Pet Hospital',
      address: '123 Main St',
      phoneNumber: '(555) 123-4567',
      latitude: '37.7749',
      longitude: '-122.4194',
      openingHours: 'Open 24/7',
      services: ['Emergency', 'Surgery'],
      isEmergency: true,
      distance: '1.2 miles away',
    },
    {
      id: 2,
      name: 'Animal Care Clinic',
      address: '456 Oak Ave',
      phoneNumber: '(555) 987-6543',
      latitude: '37.7749',
      longitude: '-122.4194',
      openingHours: 'Closes at 8PM',
      services: ['X-Ray', 'Vaccination'],
      isEmergency: false,
      distance: '2.5 miles away',
    },
    {
      id: 3,
      name: 'Paws & Claws Veterinary',
      address: '789 Pine St',
      phoneNumber: '(555) 567-8901',
      latitude: '37.7749',
      longitude: '-122.4194',
      openingHours: 'Open until 10PM',
      services: ['Surgery', 'Dental'],
      isEmergency: false,
      distance: '3.8 miles away',
    },
  ];

  const displayVets = vets || (searchInitiated ? mockVets : []);

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="mb-8">
        <CardContent className="px-4 py-5 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3">
              <label htmlFor="vet-location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <Input
                  type="text"
                  name="vet-location"
                  id="vet-location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter address or use current location"
                  className="rounded-r-none"
                />
                <Button
                  type="button"
                  variant="secondary"
                  className="rounded-l-none"
                  onClick={getCurrentLocation}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  Current Location
                </Button>
              </div>
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button
                type="button"
                className="w-full bg-secondary hover:bg-secondary-dark"
                onClick={handleSearch}
              >
                Find Vets
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {searchInitiated && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 bg-gray-100 rounded-lg h-96 relative">
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MapPin className="mx-auto h-12 w-12" />
                <p className="mt-2">Map View</p>
                <p className="text-xs">Veterinarians will be displayed as markers here</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-1">
            <Card>
              <CardHeader className="px-4 py-5 sm:px-6 bg-gray-50">
                <CardTitle className="text-lg font-medium text-gray-900">
                  Nearby Veterinarians
                </CardTitle>
              </CardHeader>
              
              {isLoading ? (
                <CardContent className="p-4">
                  <p className="text-center py-4">Loading veterinarians...</p>
                </CardContent>
              ) : error ? (
                <CardContent className="p-4">
                  <p className="text-center py-4 text-red-500">
                    Error loading veterinarians. Please try again.
                  </p>
                </CardContent>
              ) : (
                <div>
                  {displayVets.map((vet) => (
                    <div
                      key={vet.id}
                      className="border-t border-gray-200 px-4 py-5 sm:p-4 hover:bg-gray-50 cursor-pointer"
                    >
                      <h4 className="text-md font-semibold text-neutral-dark">{vet.name}</h4>
                      <p className="text-sm text-neutral-medium mt-1">
                        <MapPin className="inline-block mr-1 h-4 w-4 text-secondary" />
                        {vet.distance} · {vet.address}
                      </p>
                      <p className="text-sm text-neutral-medium mt-1">
                        <Phone className="inline-block mr-1 h-4 w-4 text-secondary" />
                        {vet.phoneNumber}
                      </p>
                      <div className="flex items-center mt-2">
                        {vet.openingHours && (
                          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100 mr-2">
                            <Clock className="mr-1 h-3 w-3" />
                            {vet.openingHours}
                          </Badge>
                        )}
                        {vet.services && vet.services.map((service, index) => (
                          <Badge key={index} variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-100 mr-2">
                            {service}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default VetFinder;
