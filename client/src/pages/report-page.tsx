import React from 'react';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';
import ReportForm from '@/components/report/report-form';

const ReportPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-neutral-dark">Report an Animal in Need</h2>
            <p className="mt-4 max-w-2xl text-xl text-neutral-medium mx-auto">
              Submit a detailed report to help us locate and rescue the animal quickly.
            </p>
          </div>
          <ReportForm />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReportPage;
