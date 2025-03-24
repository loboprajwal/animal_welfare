import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import DonationSection from '@/components/donation/donation-section';

const DonationPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-primary bg-opacity-5">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-dark">Support Our Mission</h2>
            <p className="mt-4 max-w-2xl text-xl text-neutral-medium mx-auto">
              Your donations help us rescue, treat, and rehome animals in need.
            </p>
          </div>
          <DonationSection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DonationPage;
