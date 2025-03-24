import React, { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getQueryFn, apiRequest, queryClient } from '@/lib/queryClient';
import { ForumPost, insertForumPostSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageSquare, ArrowRight, Plus } from 'lucide-react';

const forumPostSchema = insertForumPostSchema.extend({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }),
  content: z.string().min(10, { message: 'Content must be at least 10 characters' }),
  category: z.enum(['Discussion', 'Question', 'Success Story']),
});

type ForumPostFormValues = z.infer<typeof forumPostSchema>;

const CommunitySection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false);

  const form = useForm<ForumPostFormValues>({
    resolver: zodResolver(forumPostSchema),
    defaultValues: {
      userId: user?.id,
      title: '',
      content: '',
      category: 'Discussion',
    },
  });

  const { data: posts, isLoading, error } = useQuery<ForumPost[]>({
    queryKey: ['/api/forum/posts'],
    enabled: true,
  });

  const createPostMutation = useMutation({
    mutationFn: async (data: ForumPostFormValues) => {
      const res = await apiRequest('POST', '/api/forum/posts', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Post created',
        description: 'Your post has been published successfully.',
      });
      form.reset();
      setNewPostDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/forum/posts'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Post creation failed',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (data: ForumPostFormValues) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please log in to create a post',
        variant: 'destructive',
      });
      return;
    }
    
    createPostMutation.mutate({
      ...data,
      userId: user.id,
    });
  };

  // Mock data for display
  const mockPosts: ForumPost[] = [
    {
      id: 1,
      userId: 1,
      title: 'Tips for socializing a rescued dog?',
      content: 'I recently adopted a 2-year-old Labrador who seems fearful around other dogs. He was found as a stray. Any advice on how to help him become more comfortable around other pets? I\'ve tried short walks in the park...',
      category: 'Discussion',
      likes: 24,
      commentCount: 15,
      createdAt: new Date('2023-01-15').toISOString(),
    },
    {
      id: 2,
      userId: 2,
      title: 'Success story: Rehabilitating a street cat',
      content: 'I wanted to share how I helped a feral cat recover from an injury and eventually become a loving pet. Six months ago, I found a skinny tabby with a limp in my neighborhood. After taking her to the vet...',
      category: 'Success Story',
      likes: 78,
      commentCount: 32,
      createdAt: new Date('2023-01-10').toISOString(),
    },
    {
      id: 3,
      userId: 3,
      title: 'Recommendations for special needs pet adoption?',
      content: 'I\'m considering adopting a dog with special needs (blind in one eye). Does anyone have experience with this? What additional care might be needed? I want to make sure I\'m prepared to provide the right environment...',
      category: 'Question',
      likes: 12,
      commentCount: 8,
      createdAt: new Date('2023-01-05').toISOString(),
    },
  ];

  const displayPosts = posts || mockPosts;
  
  // Mock user data for display
  const mockUsers = [
    { id: 1, fullName: 'Michael Williams', avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 2, fullName: 'Sarah Johnson', avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
    { id: 3, fullName: 'David Chen', avatarUrl: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80' },
  ];

  const getUserById = (userId: number) => {
    return mockUsers.find(user => user.id === userId) || { id: userId, fullName: 'Unknown User', avatarUrl: '' };
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'Discussion':
        return 'bg-primary bg-opacity-10 text-primary';
      case 'Success Story':
        return 'bg-green-100 text-green-800';
      case 'Question':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="max-w-5xl mx-auto">
      <Card className="bg-white shadow rounded-lg mb-8">
        <CardContent className="px-4 py-5 sm:p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium text-neutral-dark">Join the Conversation</h3>
            <p className="text-sm text-neutral-medium mt-1">Share experiences and get advice from our community.</p>
          </div>
          <div>
            <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary hover:bg-primary-dark">
                  <Plus className="mr-2 h-4 w-4" /> New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                  <DialogTitle>Create a New Post</DialogTitle>
                  <DialogDescription>
                    Share your experiences, questions, or success stories with the community
                  </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              placeholder="Enter a descriptive title"
                              disabled={createPostMutation.isPending}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            disabled={createPostMutation.isPending}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Discussion">Discussion</SelectItem>
                              <SelectItem value="Question">Question</SelectItem>
                              <SelectItem value="Success Story">Success Story</SelectItem>
                            </SelectContent>
                          </Select>
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
                              {...field} 
                              placeholder="Write your post here..."
                              disabled={createPostMutation.isPending}
                              rows={6}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end pt-2">
                      <Button 
                        type="submit"
                        disabled={createPostMutation.isPending}
                      >
                        {createPostMutation.isPending ? "Posting..." : "Submit Post"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6">
        {isLoading ? (
          <p className="text-center py-10">Loading posts...</p>
        ) : error ? (
          <p className="text-center py-10 text-red-500">Error loading posts. Please try again.</p>
        ) : (
          displayPosts.map((post) => {
            const postUser = getUserById(post.userId);
            return (
              <Card key={post.id} className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-medium text-neutral-dark">{post.title}</CardTitle>
                    <Badge className={getCategoryBadgeStyle(post.category)}>
                      {post.category}
                    </Badge>
                  </div>
                  <div className="mt-2 flex items-center">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={postUser.avatarUrl} alt={postUser.fullName} />
                      <AvatarFallback>{getInitials(postUser.fullName)}</AvatarFallback>
                    </Avatar>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-neutral-dark">{postUser.fullName}</p>
                      <div className="flex space-x-1 text-sm text-neutral-medium">
                        <time dateTime={post.createdAt}>{formatDate(post.createdAt)}</time>
                        <span aria-hidden="true">&middot;</span>
                        <span>{post.commentCount} comments</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="px-4 py-5 sm:p-6">
                  <p className="text-sm text-neutral-medium">
                    {post.content}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex space-x-4">
                      <Button variant="ghost" size="sm" className="text-neutral-medium hover:text-neutral-dark">
                        <Heart className="mr-1.5 h-4 w-4" /> {post.likes}
                      </Button>
                      <Button variant="ghost" size="sm" className="text-neutral-medium hover:text-neutral-dark">
                        <MessageSquare className="mr-1.5 h-4 w-4" /> {post.commentCount}
                      </Button>
                    </div>
                    <Button variant="link" className="text-primary hover:text-primary-dark p-0">
                      Read More <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" className="text-gray-700 bg-white hover:bg-gray-50">
          View All Posts <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CommunitySection;
