import { Link } from "wouter";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">Ready to Make a Difference?</h2>
        <p className="text-white text-opacity-90 max-w-2xl mx-auto mb-8">
          Join thousands of animal lovers who are helping rescue, heal, and find homes for animals in need.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/report-animal">
            <Button
              className="px-6 py-3 bg-white text-primary font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Report an Animal
            </Button>
          </Link>
          <Button
            variant="outline"
            className="px-6 py-3 bg-transparent text-white font-medium rounded-lg border border-white hover:bg-white hover:bg-opacity-10 transition-colors"
          >
            Join as Volunteer
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
