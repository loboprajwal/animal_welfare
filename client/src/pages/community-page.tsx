import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import CommunitySection from '@/components/community/community-section';

const CommunityPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-dark">Community Forum</h2>
            <p className="mt-4 max-w-2xl text-xl text-neutral-medium mx-auto">
              Connect with fellow animal lovers, share stories, and ask questions.
            </p>
          </div>
          <CommunitySection />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default CommunityPage;
