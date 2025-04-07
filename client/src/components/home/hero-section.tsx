import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="bg-primary py-12 md:py-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl lg:text-5xl text-white leading-tight mb-4">
            Rescue, Protect, Care
          </h1>
          <p className="text-lg text-white text-opacity-90 mb-8 max-w-2xl">
            Report injured animals, find veterinarians, and give pets a loving home - all in one platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/report-animal">
              <Button
                className="px-6 py-6 bg-white text-primary font-medium rounded-lg hover:bg-gray-100 transition-colors shadow-md"
              >
                Report an Animal
              </Button>
            </Link>
            <Link href="/find-vets">
              <Button
                className="px-6 py-6 bg-secondary text-white font-medium rounded-lg hover:bg-secondary-dark transition-colors shadow-md"
              >
                Find a Vet
              </Button>
            </Link>
            <Link href="/auth">
              <Button
                variant="outline"
                className="px-6 py-6 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white hover:bg-opacity-10 transition-colors"
              >
                Sign In / Register
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
