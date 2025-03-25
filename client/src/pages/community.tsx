import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Post, User } from "@shared/schema";
import { apiRequest, queryClient, getQueryFn } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  RefreshCw,
  MessageSquare,
  Heart,
  Share2,
  ThumbsUp,
  Upload,
  Users,
  Lightbulb,
  HelpCircle,
  CheckCircle,
  AlertCircle,
  PlusCircle,
} from "lucide-react";

// Post form schema
const postFormSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  imageUrl: z.string().optional(),
});

type PostFormValues = z.infer<typeof postFormSchema>;

const CommunityPage = () => {
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();
  
  // Get the current user directly instead of using useAuth
  const { data: user } = useQuery<User | null>({
    queryKey: ["/api/user"],
    queryFn: getQueryFn({ on401: "returnNull" }),
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);

  useEffect(() => {
    document.title = "Community Forum - AnimalSOS";
  }, []);

  // Get all posts
  const { data: posts, isLoading } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Get all users for author info
  const { data: users } = useQuery<User[]>({
    queryKey: ["/api/users"],
    enabled: !!posts && posts.length > 0,
  });

  // Filter posts when search query or active tab changes
  useEffect(() => {
    if (!posts) return;

    let filtered = [...posts];

    // Filter by tab
    if (activeTab === "my-posts" && user) {
      filtered = filtered.filter((post) => post.userId === user.id);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (post) =>
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query)
      );
    }

    // Sort by newest first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    setFilteredPosts(filtered);
  }, [searchQuery, activeTab, posts, user]);

  // Post form
  const form = useForm<PostFormValues>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      title: "",
      content: "",
      imageUrl: "",
    },
  });

  // Create post mutation
  const createPostMutation = useMutation({
    mutationFn: async (data: PostFormValues & { userId: number }) => {
      const res = await apiRequest("POST", "/api/posts", data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: "Post created",
        description: "Your post has been published to the community.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/posts"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: PostFormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create a post.",
        variant: "destructive",
      });
      return;
    }

    createPostMutation.mutate({
      ...data,
      userId: user.id,
    });
  };

  // Find user by ID
  const findUserById = (userId: number) => {
    return users?.find((u) => u.id === userId);
  };

  // Format date
  const formatDate = (dateString: Date | null) => {
    if (!dateString) return "Unknown date";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-heading font-bold mb-2">Community Forum</h1>
        <p className="text-neutral-600 max-w-2xl mx-auto">
          Connect with fellow animal lovers, share stories, ask questions, and spread awareness about animal welfare.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 order-2 lg:order-1">
          {/* Create Post Card */}
          <Card className="mb-6 shadow-md">
            <CardHeader className="bg-primary bg-opacity-5 border-b">
              <h3 className="font-heading font-semibold text-lg flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                Create a Post
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              {user ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter a title for your post" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="content"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Content</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Share your thoughts, stories, or questions..."
                              className="min-h-[120px]"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center gap-2">
                            <Input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              id="post-image-upload"
                              onChange={(e) => {
                                if (e.target.files?.[0]) {
                                  // In real app, upload to server and get URL
                                  field.onChange(`image_${Date.now()}.jpg`);
                                }
                              }}
                            />
                            <label
                              htmlFor="post-image-upload"
                              className="cursor-pointer flex items-center text-sm text-neutral-600 hover:text-primary"
                            >
                              <Upload className="h-4 w-4 mr-1" />
                              Add Image
                            </label>
                            {field.value && (
                              <span className="text-sm text-green-600">
                                Image ready to upload
                              </span>
                            )}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full bg-primary hover:bg-primary-dark"
                      disabled={createPostMutation.isPending}
                    >
                      {createPostMutation.isPending ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Posting...
                        </>
                      ) : (
                        "Publish Post"
                      )}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="text-center py-4">
                  <p className="text-neutral-600 mb-3">
                    Sign in to share your stories and join the discussion.
                  </p>
                  <Button
                    className="bg-primary hover:bg-primary-dark"
                    onClick={() => window.location.href = "/auth"}
                  >
                    Sign In to Post
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Community Guidelines */}
          <Card className="shadow-sm">
            <CardHeader className="bg-neutral-50 border-b">
              <h3 className="font-heading font-semibold text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-neutral-500" />
                Community Guidelines
              </h3>
            </CardHeader>
            <CardContent className="p-4">
              <ul className="space-y-3">
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                  <span className="text-sm">Be respectful and kind to all community members</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                  <span className="text-sm">Share accurate information about animal welfare</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 mr-2 shrink-0" />
                  <span className="text-sm">Use appropriate and non-graphic imagery</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 shrink-0" />
                  <span className="text-sm">Don't spam or post promotional content</span>
                </li>
                <li className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2 shrink-0" />
                  <span className="text-sm">No harassment, hate speech, or bullying</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 order-1 lg:order-2">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="all">All Posts</TabsTrigger>
                {user && <TabsTrigger value="my-posts">My Posts</TabsTrigger>}
              </TabsList>
            </Tabs>

            <div className="relative w-full md:w-64">
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-8"
              />
              <svg
                className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-neutral-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* Posts */}
          {isLoading ? (
            <div className="py-12 text-center">
              <RefreshCw className="animate-spin h-8 w-8 mx-auto text-primary mb-4" />
              <p>Loading posts...</p>
            </div>
          ) : filteredPosts.length === 0 ? (
            <div className="py-12 text-center bg-neutral-50 rounded-lg">
              <MessageSquare className="h-12 w-12 mx-auto text-neutral-300 mb-4" />
              <h3 className="text-xl font-heading font-semibold mb-2">No posts found</h3>
              <p className="text-neutral-500 mb-4">
                {activeTab === "my-posts"
                  ? "You haven't created any posts yet."
                  : searchQuery
                  ? "No posts match your search query."
                  : "Be the first to post in this community!"}
              </p>
              {user && (
                <Button
                  className="bg-primary hover:bg-primary-dark"
                  onClick={() => form.setFocus("title")}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create a Post
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredPosts.map((post) => {
                const author = findUserById(post.userId);
                return (
                  <Card key={post.id} className="shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3 flex flex-row items-start">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src="" alt={author?.name} />
                        <AvatarFallback>
                          {author ? getInitials(author.name) : "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-heading font-semibold text-lg">{post.title}</h3>
                            <p className="text-sm text-neutral-500 flex items-center">
                              <span>{author?.name || "Unknown User"}</span>
                              <span className="mx-1">•</span>
                              <span>{formatDate(post.createdAt)}</span>
                            </p>
                          </div>
                          {user?.id === post.userId && (
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              {/* Edit icon would go here */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="M12 20h9"></path>
                                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                              </svg>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-neutral-700 whitespace-pre-line mb-4">{post.content}</p>
                      {post.imageUrl && (
                        <div className="mt-2 rounded-md overflow-hidden">
                          <img
                            src={
                              post.imageUrl.startsWith("http")
                                ? post.imageUrl
                                : "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                            }
                            alt="Post attachment"
                            className="max-h-[300px] w-full object-contain bg-neutral-50"
                          />
                        </div>
                      )}
                    </CardContent>
                    <Separator />
                    <CardFooter className="py-3">
                      <div className="flex w-full justify-between">
                        <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-primary">
                          <ThumbsUp className="h-4 w-4 mr-1" />
                          <span>Like</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-primary">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          <span>Comment</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-neutral-600 hover:text-primary">
                          <Share2 className="h-4 w-4 mr-1" />
                          <span>Share</span>
                        </Button>
                      </div>
                    </CardFooter>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
