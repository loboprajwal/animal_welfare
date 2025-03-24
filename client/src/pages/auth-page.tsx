import React from 'react';
import { Redirect } from 'wouter';
import { useAuth } from '@/hooks/use-auth';
import AuthForm from '@/components/auth/auth-form';
import Header from '@/components/layout/header';
import Footer from '@/components/layout/footer';

const AuthPage: React.FC = () => {
  const { user, isLoading } = useAuth();

  // Redirect if user is already logged in
  if (user && !isLoading) {
    return <Redirect to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
            <div className="md:w-1/2 max-w-md">
              <AuthForm />
            </div>
            <div className="md:w-1/2 max-w-md">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold text-neutral-dark mb-4">Welcome to AnimalSOS</h2>
                <div className="mb-4">
                  <svg
                    className="w-16 h-16 text-primary mx-auto mb-4"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 512 512"
                    fill="currentColor"
                  >
                    <path d="M226.5 92.9c14.3 42.9-.3 86.2-32.6 96.8s-70.1-15.6-84.4-58.5s.3-86.2 32.6-96.8s70.1 15.6 84.4 58.5zM100.4 198.6c18.9 32.4 14.3 70.1-10.2 84.1s-59.7-.9-78.5-33.3S-2.7 179.3 21.8 165.3s59.7 .9 78.5 33.3zM69.2 401.2C121.6 259.9 214.7 224 256 224s134.4 35.9 186.8 177.2c3.6 9.7 5.2 20.1 5.2 30.5v1.6c0 25.8-20.9 46.7-46.7 46.7c-11.5 0-22.9-1.4-34-4.2l-88-22c-15.3-3.8-31.3-3.8-46.6 0l-88 22c-11.1 2.8-22.5 4.2-34 4.2C84.9 480 64 459.1 64 433.3v-1.6c0-10.4 1.6-20.8 5.2-30.5zM421.8 282.7c-24.5-14-29.1-51.7-10.2-84.1s54-47.3 78.5-33.3s29.1 51.7 10.2 84.1s-54 47.3-78.5 33.3zM310.1 189.7c-32.3-10.6-46.9-53.9-32.6-96.8s52.1-69.1 84.4-58.5s46.9 53.9 32.6 96.8s-52.1 69.1-84.4 58.5z" />
                  </svg>
                </div>
                <p className="text-neutral-medium mb-4">
                  Join our platform to help animals in need. Report injured animals, find veterinary care, make donations, and connect with a community that cares.
                </p>
                <ul className="space-y-2 mb-4">
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-primary mt-0.5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Report animals in distress
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-primary mt-0.5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Find veterinary help nearby
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-primary mt-0.5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Support animal welfare through donations
                  </li>
                  <li className="flex items-start">
                    <svg
                      className="h-5 w-5 text-primary mt-0.5 mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    Browse and apply for pet adoption
                  </li>
                </ul>
                <p className="text-sm text-neutral-medium">
                  By creating an account, you're joining our mission to rescue, rehabilitate, and rehome animals in need.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AuthPage;
