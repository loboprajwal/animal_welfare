import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import AdoptionSection from '@/components/adoption/adoption-section';

const AdoptionPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-dark">Adopt a Forever Friend</h2>
            <p className="mt-4 max-w-2xl text-xl text-neutral-medium mx-auto">
              Browse animals ready for adoption and give them a loving home.
            </p>
          </div>
          <AdoptionSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdoptionPage;
