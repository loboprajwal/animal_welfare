import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Donation } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import {
  RefreshCw,
  DollarSign,
  CreditCard,
  Heart,
  Calendar,
  Lock,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

// Donation form schema
const donationFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Please enter a valid amount greater than 0",
  }),
  paymentMethod: z.enum(["card", "upi", "netbanking"], {
    required_error: "Please select a payment method",
  }),
  cardNumber: z.string().optional(),
  cardExpiry: z.string().optional(),
  cardCvv: z.string().optional(),
  name: z.string().min(1, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  message: z.string().optional(),
});

type DonationFormValues = z.infer<typeof donationFormSchema>;

const DonatePage = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<Donation | null>(null);
  const [donationSuccess, setDonationSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    document.title = "Donate - AnimalSOS";
  }, []);

  // Get donations data
  const { data: donations, isLoading } = useQuery<Donation[]>({
    queryKey: ["/api/donations"],
  });

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationFormSchema),
    defaultValues: {
      amount: "500",
      paymentMethod: "card",
      cardNumber: "",
      cardExpiry: "",
      cardCvv: "",
      name: "",
      email: "",
      message: "",
    },
  });

  // Calculate progress percentage for a donation campaign
  const calculateProgress = (raised: number, goal: number) => {
    return Math.min(Math.round((raised / goal) * 100), 100);
  };

  // Sample donation images (in real app we'd use actual imageUrl from the database)
  const getDonationImage = (id: number) => {
    const images = [
      "https://images.unsplash.com/photo-1604848698030-c434ba08ece1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1600443588173-5f984fca0d7a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      "https://images.unsplash.com/photo-1602491453631-e2a5ad90a131?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
    ];
    
    return images[id % images.length];
  };

  const handleDonate = (campaign: Donation) => {
    setSelectedCampaign(campaign);
    setIsDialogOpen(true);
    setDonationSuccess(false);
  };

  const onSubmit = async (data: DonationFormValues) => {
    if (!selectedCampaign) return;

    try {
      // Mock API call - in a real app, this would connect to a payment gateway
      const amount = parseInt(data.amount);
      await apiRequest("POST", `/api/donations/${selectedCampaign.id}/contribute`, { amount });
      
      setDonationSuccess(true);
      toast({
        title: "Donation successful",
        description: `Thank you for your generous donation of ₹${amount} to ${selectedCampaign.title}.`,
      });
    } catch (error) {
      toast({
        title: "Donation failed",
        description: "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
    }
  };

  const suggestedAmounts = [100, 500, 1000, 2000, 5000];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Support Animal Welfare</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Your donations help provide food, shelter, medical care, and rescue operations for animals in need.
          Choose a cause to support below.
        </p>
      </div>

      {/* Donation Campaigns */}
      {isLoading ? (
        <div className="py-12 text-center">
          <RefreshCw className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
          <p>Loading donation campaigns...</p>
        </div>
      ) : donations?.length === 0 ? (
        <div className="py-12 text-center bg-neutral-50 rounded-lg">
          <Heart className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
          <h3 className="text-xl font-heading font-semibold mb-2">No active campaigns</h3>
          <p className="text-neutral-500 mb-4">
            There are no active donation campaigns at the moment. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {donations?.map((donation) => {
            const progressPercentage = calculateProgress(donation.raisedAmount, donation.goalAmount);
            
            return (
              <Card key={donation.id} className="bg-neutral-50 overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                <img
                  src={donation.imageUrl || getDonationImage(donation.id)}
                  alt={donation.title}
                  className="w-full h-48 object-cover"
                />
                <CardContent className="p-5">
                  <h3 className="font-heading font-semibold text-lg mb-2">{donation.title}</h3>
                  <p className="text-neutral-600 text-sm mb-4 line-clamp-3">{donation.description}</p>
                  <div className="mb-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium">₹{donation.raisedAmount.toLocaleString()}</span>
                      <span className="text-neutral-500">of ₹{donation.goalAmount.toLocaleString()} goal</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2 bg-neutral-200" />
                  </div>
                  <Button 
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    onClick={() => handleDonate(donation)}
                  >
                    Donate Now
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* How Your Donation Helps Section */}
      <div className="bg-primary bg-opacity-5 p-8 rounded-lg mb-16">
        <h2 className="text-2xl font-heading font-semibold text-center mb-8">
          How Your Donation Helps
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-20 text-primary flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-8 w-8" />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Medical Care</h3>
            <p className="text-neutral-600">
              Fund emergency treatment, surgeries, and regular medical checkups for injured and sick animals.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-20 text-primary flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Food & Shelter</h3>
            <p className="text-neutral-600">
              Provide nutritious food, warm beds, and safe shelter for rescued animals until they find forever homes.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-20 text-primary flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <path d="m4.9 4.9 14.2 14.2" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Sterilization</h3>
            <p className="text-neutral-600">
              Support spay/neuter programs to control stray animal populations and prevent animal suffering.
            </p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 rounded-full bg-primary bg-opacity-20 text-primary flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
              </svg>
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">Rescue Operations</h3>
            <p className="text-neutral-600">
              Fund rescue teams, equipment, and transportation for emergency animal rescue operations.
            </p>
          </div>
        </div>
      </div>

      {/* Tax Benefits Section */}
      <div className="bg-white p-6 border rounded-lg shadow-sm mb-16">
        <h2 className="text-xl font-heading font-semibold mb-4">Tax Benefits</h2>
        <p className="text-neutral-600 mb-4">
          All donations to AnimalSOS are eligible for tax deduction under Section 80G of the Income Tax Act. You will receive a tax receipt by email after your donation.
        </p>
        <div className="flex items-center">
          <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
          <span>Tax-deductible donation</span>
        </div>
      </div>

      {/* Donation Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {donationSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-100 text-green-600 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <DialogTitle className="text-2xl mb-3">Thank You!</DialogTitle>
              <DialogDescription className="mb-6">
                Your donation of ₹{form.getValues().amount} to {selectedCampaign?.title} has been processed successfully. You'll receive a confirmation email shortly.
              </DialogDescription>
              <Button onClick={() => setIsDialogOpen(false)} className="bg-primary hover:bg-primary-dark">
                Close
              </Button>
            </div>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle>Donate to {selectedCampaign?.title}</DialogTitle>
                <DialogDescription>
                  Your contribution helps animals in need get the care they deserve.
                </DialogDescription>
              </DialogHeader>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Donation Amount</FormLabel>
                        <div className="mb-2">
                          <div className="flex gap-2 mb-3 flex-wrap">
                            {suggestedAmounts.map((amount) => (
                              <Button
                                key={amount}
                                type="button"
                                variant={field.value === amount.toString() ? "default" : "outline"}
                                className={field.value === amount.toString() ? "bg-primary text-white" : ""}
                                onClick={() => form.setValue("amount", amount.toString())}
                              >
                                ₹{amount}
                              </Button>
                            ))}
                          </div>
                          <div className="relative">
                            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                            <FormControl>
                              <Input className="pl-9" placeholder="Other amount" {...field} />
                            </FormControl>
                          </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Tabs defaultValue="card" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="card" className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        Card
                      </TabsTrigger>
                      <TabsTrigger value="upi" className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M12 22V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          <path d="M22 7L12 12L2 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        UPI
                      </TabsTrigger>
                      <TabsTrigger value="netbanking" className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="2"/>
                          <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M7 15H7.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                          <path d="M11 15H13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                        </svg>
                        NetBanking
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="card" className="pt-4">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                className="flex"
                              >
                                <div>
                                  <RadioGroupItem value="card" id="card" className="hidden" />
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <div className="space-y-4">
                        <div>
                          <FormLabel>Card Number</FormLabel>
                          <div className="relative">
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                            <Input 
                              placeholder="1234 5678 9012 3456"
                              className="pl-9"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <FormLabel>Expiry Date</FormLabel>
                            <div className="relative">
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                              <Input 
                                placeholder="MM/YY"
                                className="pl-9"
                              />
                            </div>
                          </div>
                          <div>
                            <FormLabel>CVV</FormLabel>
                            <div className="relative">
                              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
                              <Input 
                                placeholder="123"
                                className="pl-9"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </TabsContent>

                    <TabsContent value="upi" className="pt-4">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                className="flex"
                              >
                                <div>
                                  <RadioGroupItem value="upi" id="upi" className="hidden" />
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <p className="text-center my-4">
                        Enter your UPI ID to make a payment
                      </p>
                      <Input placeholder="yourname@upi" />
                    </TabsContent>

                    <TabsContent value="netbanking" className="pt-4">
                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem className="hidden">
                            <FormControl>
                              <RadioGroup 
                                onValueChange={field.onChange} 
                                defaultValue={field.value}
                                className="flex"
                              >
                                <div>
                                  <RadioGroupItem value="netbanking" id="netbanking" className="hidden" />
                                </div>
                              </RadioGroup>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <p className="text-center my-4">
                        Select your bank to continue to net banking
                      </p>
                      <div className="grid grid-cols-2 gap-2">
                        <Button variant="outline">HDFC Bank</Button>
                        <Button variant="outline">ICICI Bank</Button>
                        <Button variant="outline">SBI</Button>
                        <Button variant="outline">Axis Bank</Button>
                      </div>
                    </TabsContent>
                  </Tabs>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="Your email" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message (Optional)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Your message of support"
                            className="min-h-[80px]"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Leave a message to show your support
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button 
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      className="bg-primary hover:bg-primary-dark"
                    >
                      Complete Donation
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DonatePage;
