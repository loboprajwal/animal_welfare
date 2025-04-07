import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { insertReportSchema } from "@shared/schema";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertCircle,
  MapPin,
  Upload,
  Sparkles,
  Dog,
  Cat,
  Bird,
  Info,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Extend the insert schema with additional validation
const reportFormSchema = insertReportSchema.extend({
  animalType: z.string().min(1, "Please select an animal type"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  location: z.string().min(5, "Please provide a specific location"),
  imageUrl: z.string().optional(),
  urgency: z.enum(["normal", "urgent"]).default("normal"),
});

type ReportFormValues = z.infer<typeof reportFormSchema>;

const ReportAnimal = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, navigate] = useLocation();
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    document.title = "Report an Animal - AnimalSOS";
  }, []);

  const form = useForm<ReportFormValues>({
    resolver: zodResolver(reportFormSchema),
    defaultValues: {
      animalType: "",
      description: "",
      location: "",
      urgency: "normal",
      imageUrl: "",
      userId: user?.id || 0,
      latitude: "",
      longitude: "",
      status: "pending",
    },
  });

  // Set userId when user data is available
  useEffect(() => {
    if (user) {
      form.setValue("userId", user.id);
    }
  }, [user, form]);

  // Mock image upload (in a real app, this would upload to a server or cloud storage)
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, upload the file to a server/cloud storage
      // For now, just create a local URL for preview
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      form.setValue("imageUrl", `image_${Date.now()}.jpg`); // In real app, this would be the URL from the server
    }
  };

  // Try to get current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          form.setValue("latitude", position.coords.latitude.toString());
          form.setValue("longitude", position.coords.longitude.toString());
          toast({
            title: "Location detected",
            description: "Your current location has been added to the report.",
          });
        },
        (error) => {
          toast({
            title: "Location error",
            description: "Could not detect your location. Please enter it manually.",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation. Please enter location manually.",
        variant: "destructive",
      });
    }
  };

  const reportMutation = useMutation({
    mutationFn: async (data: ReportFormValues) => {
      const res = await apiRequest("POST", "/api/reports", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Report submitted",
        description: "Thank you for helping animals in need. We will process your report soon.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/reports"] });
      navigate("/");
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to submit report",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportFormValues) => {
    reportMutation.mutate(data);
  };

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Report an Animal in Need</h1>
        <p className="text-neutral-600">
          Help us locate and rescue animals by providing detailed information below
        </p>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-primary bg-opacity-5 border-b">
          <CardTitle className="flex items-center">
            <Dog className="mr-2 h-5 w-5 text-primary" />
            Animal Report Form
          </CardTitle>
          <CardDescription>
            This information will help animal rescuers locate and help the animal quickly
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Alert className="mb-6 bg-blue-50 text-blue-800 border-blue-200">
            <Info className="h-4 w-4" />
            <AlertTitle>Important</AlertTitle>
            <AlertDescription>
              If the animal is severely injured or in immediate danger, please also call our
              emergency hotline at <span className="font-bold">+91 9876543210</span>.
            </AlertDescription>
          </Alert>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="animalType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Animal Type*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select animal type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="dog">
                            <div className="flex items-center">
                              <Dog className="mr-2 h-4 w-4 text-neutral-500" />
                              Dog
                            </div>
                          </SelectItem>
                          <SelectItem value="cat">
                            <div className="flex items-center">
                              <Cat className="mr-2 h-4 w-4 text-neutral-500" />
                              Cat
                            </div>
                          </SelectItem>
                          <SelectItem value="bird">
                            <div className="flex items-center">
                              <Bird className="mr-2 h-4 w-4 text-neutral-500" />
                              Bird
                            </div>
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Urgency Level</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency level" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="normal">
                            <div className="flex items-center">
                              <Info className="mr-2 h-4 w-4 text-blue-500" />
                              Normal
                            </div>
                          </SelectItem>
                          <SelectItem value="urgent">
                            <div className="flex items-center">
                              <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                              Urgent (Injured/Critical)
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select 'Urgent' if the animal requires immediate attention
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description*</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe the animal's condition, appearance, behavior, etc."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Please provide as much detail as possible including visible injuries, behavior,
                      and distinguishing features
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location*</FormLabel>
                      <div className="flex space-x-2">
                        <FormControl>
                          <Input
                            placeholder="Street address or landmark"
                            {...field}
                            className="flex-1"
                          />
                        </FormControl>
                        <Button
                          type="button"
                          variant="outline"
                          size="icon"
                          onClick={getCurrentLocation}
                          className="shrink-0"
                        >
                          <MapPin className="h-4 w-4" />
                        </Button>
                      </div>
                      <FormDescription>
                        Enter a specific location or use the location button
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Upload Image</FormLabel>
                      <div className="flex items-center gap-2">
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="cursor-pointer flex-1 py-2 px-3 rounded-md border border-input bg-transparent flex items-center justify-center gap-2 hover:bg-accent hover:text-accent-foreground"
                        >
                          <Upload className="h-4 w-4" />
                          <span>Choose File</span>
                        </label>
                        {previewImage && (
                          <div className="h-10 w-10 rounded-md overflow-hidden">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="h-full w-full object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <FormDescription>
                        Upload a clear photo of the animal to help with identification
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate("/")}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-primary hover:bg-primary-dark"
                  disabled={reportMutation.isPending}
                >
                  {reportMutation.isPending ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Report"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportAnimal;
