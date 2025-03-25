import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-primary bg-opacity-10 py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-neutral-800 leading-tight mb-4">
              <span className="text-primary">Rescue, Protect, Care</span>
            </h1>
            <p className="text-lg text-neutral-600 mb-8">
              Report injured animals, find veterinarians, donate to welfare causes, and give pets a loving home - all in one platform.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/report-animal">
                <Button
                  className="px-6 py-6 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors shadow-md"
                >
                  Report an Animal
                </Button>
              </Link>
              <Link href="/adopt">
                <Button
                  variant="outline"
                  className="px-6 py-6 bg-white text-primary font-medium rounded-lg border border-primary hover:bg-neutral-50 transition-colors"
                >
                  Adopt a Pet
                </Button>
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <img
              src="https://images.unsplash.com/photo-1541687664581-9380748af0f3?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Injured dog in need of help"
              className="rounded-lg shadow-lg object-cover w-full h-[400px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
