import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import VetFinder from '@/components/veterinarians/vet-finder';

const VetFinderPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-dark">Find Nearby Veterinarians</h2>
            <p className="mt-4 max-w-2xl text-xl text-neutral-medium mx-auto">
              Locate emergency veterinary care for animals in distress.
            </p>
          </div>
          <VetFinder />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default VetFinderPage;
