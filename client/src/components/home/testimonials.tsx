import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star } from "lucide-react";

// Sample testimonials data
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Mumbai",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    content: "I found an injured puppy near my house and didn't know what to do. I reported it on AnimalSOS and within 30 minutes, a volunteer arrived to help. They took care of all medical expenses and now the puppy has found a loving home!",
    rating: 5
  },
  {
    id: 2,
    name: "Rahul Patel",
    location: "Delhi",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    content: "I adopted my cat Whiskers through AnimalSOS last year. The process was smooth, and they provided all necessary information about her health and habits. She's now the joy of our home. Couldn't be happier!",
    rating: 4.5
  },
  {
    id: 3,
    name: "Meera Reddy",
    location: "Bangalore",
    avatar: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=80",
    content: "Our animal shelter has received incredible support through AnimalSOS. The donations have helped us improve our facilities and provide better care for over 50 animals. The platform connects us directly with animal lovers who want to help.",
    rating: 5
  }
];

const Testimonials = () => {
  // Render star ratings
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return (
      <div className="flex text-yellow-400">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400" />
        ))}
        {hasHalfStar && (
          <Star key="half" className="h-4 w-4" />
        )}
        {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4" />
        ))}
      </div>
    );
  };

  return (
    <section className="py-12 bg-primary bg-opacity-5">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-bold text-2xl md:text-3xl text-center mb-10">Success Stories</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="bg-white shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Avatar className="h-12 w-12 border-2 border-primary">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                    <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-3">
                    <h4 className="font-heading font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-neutral-500">{testimonial.location}</p>
                  </div>
                </div>
                <p className="text-neutral-600 mb-4">{`"${testimonial.content}"`}</p>
                {renderStars(testimonial.rating)}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
