import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useMutation } from '@tanstack/react-query';
import { insertAnimalReportSchema } from '@shared/schema';
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
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { MapPin, Upload, Image } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const reportSchema = insertAnimalReportSchema.extend({
  animalType: z.enum(['Dog', 'Cat', 'Bird', 'Wildlife', 'Other']),
  emergencyLevel: z.enum(['Critical', 'Urgent', 'Moderate', 'Low']),
  contactNumber: z.string().min(1, { message: 'Contact number is required' }),
  // For file uploads we'll use a different approach
  // images: z.instanceof(FileList).optional(),
});

type ReportFormValues = z.infer<typeof reportSchema>;

const ReportForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      userId: user?.id,
      animalType: 'Dog',
      emergencyLevel: 'Moderate',
      description: '',
      location: '',
      latitude: '',
      longitude: '',
      contactNumber: user?.phoneNumber || '',
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (data: ReportFormValues) => {
      // In a real implementation, we would upload the images first and get URLs
      // For now, we'll just add a placeholder for image URLs
      const imageUrls = selectedFiles.length ? ['https://placeholder-image-url.jpg'] : [];
      
      const reportData = {
        ...data,
        imageUrls,
      };
      
      const res = await apiRequest('POST', '/api/reports', reportData);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Report submitted',
        description: 'Thank you for reporting. We will respond as soon as possible.',
      });
      form.reset();
      setSelectedFiles([]);
      queryClient.invalidateQueries({ queryKey: ['/api/reports'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Submission failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to submit a report',
        variant: 'destructive',
      });
      return;
    }
    
    reportMutation.mutate(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      setSelectedFiles(filesArray);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue('latitude', position.coords.latitude.toString());
          form.setValue('longitude', position.coords.longitude.toString());
          // In a real implementation, we would reverse geocode to get the address
          form.setValue('location', 'Current location detected');
        },
        (error) => {
          toast({
            title: 'Location error',
            description: 'Unable to get your current location. Please enter it manually.',
            variant: 'destructive',
          });
        }
      );
    } else {
      toast({
        title: 'Geolocation not supported',
        description: 'Your browser does not support geolocation. Please enter your location manually.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="max-w-3xl mx-auto bg-white shadow sm:rounded-lg overflow-hidden">
      <CardContent className="px-4 py-5 sm:p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <FormField
                control={form.control}
                name="animalType"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Animal Type</FormLabel>
                    <Select
                      disabled={reportMutation.isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select animal type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Dog">Dog</SelectItem>
                        <SelectItem value="Cat">Cat</SelectItem>
                        <SelectItem value="Bird">Bird</SelectItem>
                        <SelectItem value="Wildlife">Wildlife</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="emergencyLevel"
                render={({ field }) => (
                  <FormItem className="sm:col-span-3">
                    <FormLabel>Emergency Level</FormLabel>
                    <Select
                      disabled={reportMutation.isPending}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select emergency level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Critical">Critical - Immediate help needed</SelectItem>
                        <SelectItem value="Urgent">Urgent - Needs attention soon</SelectItem>
                        <SelectItem value="Moderate">Moderate - Stable but needs help</SelectItem>
                        <SelectItem value="Low">Low - Not in immediate danger</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="sm:col-span-6">
                    <FormLabel>Situation Description</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Describe the animal's condition, behavior, and surroundings..."
                        disabled={reportMutation.isPending}
                        rows={4}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="sm:col-span-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <div className="flex rounded-md shadow-sm">
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter address or use current location"
                            disabled={reportMutation.isPending}
                            className="rounded-r-none"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="secondary"
                          className="rounded-l-none"
                          onClick={getCurrentLocation}
                          disabled={reportMutation.isPending}
                        >
                          <MapPin className="mr-2 h-4 w-4" />
                          Current Location
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="mt-2 h-60 bg-gray-100 rounded-md relative">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                    <div className="text-center">
                      <MapPin className="mx-auto h-10 w-10" />
                      <p className="mt-2">Map Loading...</p>
                      <p className="text-xs">Google Maps will be integrated here</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="sm:col-span-6">
                <FormLabel className="block text-sm font-medium text-gray-700">Photos</FormLabel>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Image className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none">
                        <span>Upload files</span>
                        <input
                          id="file-upload"
                          name="file-upload"
                          type="file"
                          className="sr-only"
                          multiple
                          onChange={handleFileChange}
                          disabled={reportMutation.isPending}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                    {selectedFiles.length > 0 && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-700">{selectedFiles.length} file(s) selected</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <FormField
                control={form.control}
                name="contactNumber"
                render={({ field }) => (
                  <FormItem className="sm:col-span-6">
                    <FormLabel>Your Contact Number</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        {...field}
                        placeholder="+1 (555) 123-4567"
                        disabled={reportMutation.isPending}
                      />
                    </FormControl>
                    <p className="mt-2 text-sm text-gray-500">We'll only use this to contact you about this report</p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={reportMutation.isPending}
              >
                {reportMutation.isPending ? 'Submitting...' : 'Submit Report'}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ReportForm;
