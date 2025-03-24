import { Link } from "wouter";
import { AlertTriangle, Heart, Home } from "lucide-react";

const QuickActions = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center mb-10">How You Can Help</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Action Card 1 */}
          <div className="bg-neutral-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 bg-secondary bg-opacity-20 flex items-center justify-center">
              <AlertTriangle className="h-16 w-16 text-secondary" />
            </div>
            <div className="p-6">
              <h3 className="font-heading font-semibold text-xl mb-2">Report an Animal</h3>
              <p className="text-neutral-600 mb-4">Found an injured or stray animal? Report it to get immediate help from nearby rescuers.</p>
              <Link href="/report-animal" className="text-primary font-medium hover:underline flex items-center">
                Report Now <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
          
          {/* Action Card 2 */}
          <div className="bg-neutral-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 bg-primary bg-opacity-20 flex items-center justify-center">
              <Heart className="h-16 w-16 text-primary" />
            </div>
            <div className="p-6">
              <h3 className="font-heading font-semibold text-xl mb-2">Donate to a Cause</h3>
              <p className="text-neutral-600 mb-4">Support animal welfare organizations with donations for food, medicine, and shelter.</p>
              <Link href="/donate" className="text-primary font-medium hover:underline flex items-center">
                Donate Now <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
          
          {/* Action Card 3 */}
          <div className="bg-neutral-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="h-48 bg-accent bg-opacity-20 flex items-center justify-center">
              <Home className="h-16 w-16 text-accent" />
            </div>
            <div className="p-6">
              <h3 className="font-heading font-semibold text-xl mb-2">Adopt a Pet</h3>
              <p className="text-neutral-600 mb-4">Give a loving home to animals in need. Browse available pets ready for adoption.</p>
              <Link href="/adopt" className="text-primary font-medium hover:underline flex items-center">
                Find Pets <span className="ml-1">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuickActions;
