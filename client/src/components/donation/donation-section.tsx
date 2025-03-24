import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent } from '@/components/ui/card';

const donationSchema = z.object({
  amount: z.string().min(1, { message: 'Amount is required' }),
  isRecurring: z.boolean().default(true),
  donorName: z.string().min(1, { message: 'Name is required' }),
  donorEmail: z.string().email({ message: 'Valid email is required' }),
});

type DonationFormValues = z.infer<typeof donationSchema>;

const predefinedAmounts = ['10', '25', '50', '100'];

const DonationSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState('100');
  const [customAmount, setCustomAmount] = useState('');

  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      amount: '100',
      isRecurring: true,
      donorName: user?.fullName || '',
      donorEmail: user?.email || '',
    },
  });

  const donationMutation = useMutation({
    mutationFn: async (data: DonationFormValues & { userId?: number }) => {
      const res = await apiRequest('POST', '/api/donations', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Donation successful',
        description: 'Thank you for your generous contribution!',
      });
      form.reset({
        amount: '100',
        isRecurring: true,
        donorName: user?.fullName || '',
        donorEmail: user?.email || '',
      });
      setSelectedAmount('100');
      setCustomAmount('');
      queryClient.invalidateQueries({ queryKey: ['/api/donations'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Donation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: DonationFormValues) => {
    // Use custom amount if entered, otherwise use the selected predefined amount
    const amount = customAmount || selectedAmount;
    
    donationMutation.mutate({
      ...data,
      amount,
      userId: user?.id,
    });
  };

  const handleAmountSelect = (amount: string) => {
    setSelectedAmount(amount);
    setCustomAmount('');
    form.setValue('amount', amount);
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCustomAmount(value);
    setSelectedAmount('');
    form.setValue('amount', value);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="bg-white rounded-lg shadow overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="p-6 bg-secondary bg-opacity-5">
            <h3 className="text-xl font-bold text-neutral-dark mb-4">Where Your Money Goes</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-secondary mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-dark">Medical Treatment</p>
                  <p className="text-sm text-neutral-medium">
                    Emergency care, surgeries, and ongoing treatment for injured animals.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-secondary mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-dark">Shelter Operations</p>
                  <p className="text-sm text-neutral-medium">
                    Food, supplies, and housing for animals awaiting adoption.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-secondary mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-dark">Rescue Operations</p>
                  <p className="text-sm text-neutral-medium">
                    Equipment and transportation for our rescue teams.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-secondary mt-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-dark">Education Programs</p>
                  <p className="text-sm text-neutral-medium">
                    Teaching communities about animal welfare and responsible pet ownership.
                  </p>
                </div>
              </li>
            </ul>
            <div className="mt-6">
              <img
                src="https://images.unsplash.com/photo-1544568100-847a948585b9?ixlib=rb-1.2.1&auto=format&fit=crop&w=600&q=80"
                alt="Rescued dog"
                className="rounded-lg w-full object-cover h-48"
              />
            </div>
          </div>
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <h3 className="text-xl font-bold text-neutral-dark mb-4">Make a Donation</h3>
                <div className="mb-6">
                  <div className="flex space-x-2 mb-4">
                    {predefinedAmounts.map((amount) => (
                      <Button
                        key={amount}
                        type="button"
                        variant={selectedAmount === amount ? "default" : "outline"}
                        className={`flex-1 ${
                          selectedAmount === amount
                            ? "bg-primary text-white hover:bg-primary-dark"
                            : "border-gray-300 text-neutral-dark hover:bg-white"
                        }`}
                        onClick={() => handleAmountSelect(amount)}
                      >
                        ${amount}
                      </Button>
                    ))}
                  </div>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">$</span>
                    </div>
                    <Input
                      type="text"
                      name="custom-amount"
                      id="custom-amount"
                      value={customAmount}
                      onChange={handleCustomAmountChange}
                      className="pl-7"
                      placeholder="Other amount"
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="isRecurring"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === 'true')}
                          defaultValue={field.value ? 'true' : 'false'}
                          className="flex flex-col space-y-1"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="true" id="recurring" />
                            <FormLabel htmlFor="recurring">Monthly Donation</FormLabel>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="false" id="one-time" />
                            <FormLabel htmlFor="one-time">One-time Donation</FormLabel>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="donorName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input {...field} disabled={donationMutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="donorEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} type="email" disabled={donationMutation.isPending} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={donationMutation.isPending}
                >
                  {donationMutation.isPending ? 'Processing...' : 'Donate Now'}
                </Button>
                <p className="mt-2 text-xs text-center text-gray-500">
                  Secure payment processing by Stripe/Razorpay
                </p>
              </form>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default DonationSection;
