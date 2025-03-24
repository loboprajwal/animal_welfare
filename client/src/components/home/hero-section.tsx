import React from 'react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="bg-primary-light bg-opacity-10 py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:flex lg:items-center lg:justify-between">
          <div className="lg:w-1/2">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-dark sm:text-5xl">
              <span className="block">Help animals in need</span>
              <span className="block text-primary">Report. Rescue. Rehome.</span>
            </h1>
            <p className="mt-4 text-xl text-neutral-medium">
              AnimalSOS connects injured, lost, or stray animals with rescuers, vets, and loving forever homes.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link href="/report">
                <Button size="lg" className="text-white bg-primary hover:bg-primary-dark shadow-sm">
                  Report an Animal
                </Button>
              </Link>
              <Link href="/adoption">
                <Button size="lg" variant="outline" className="text-primary bg-white hover:bg-gray-50 shadow-sm">
                  Find a Pet
                </Button>
              </Link>
            </div>
          </div>
          <div className="mt-10 lg:mt-0 lg:w-1/2">
            <img 
              className="h-96 w-full object-cover rounded-lg shadow-xl" 
              src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" 
              alt="Dog being rescued" 
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
