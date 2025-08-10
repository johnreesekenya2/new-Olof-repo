
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { MessageCircle, Star, ThumbsUp, Calendar } from "lucide-react";

const feedbackSchema = z.object({
  rating: z.number().min(1, "Please select a rating").max(5, "Rating must be between 1 and 5"),
  message: z.string().min(10, "Feedback must be at least 10 characters"),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

interface Feedback {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  message: string;
  createdAt: string;
  likes: number;
}

export default function Feedback() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRating, setSelectedRating] = useState(0);

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      rating: 0,
      message: "",
    },
  });

  const { data: feedbacks = [] } = useQuery({
    queryKey: ["feedbacks"],
    queryFn: async () => {
      const response = await fetch("/api/feedback", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch feedback");
      return response.json();
    },
  });

  const feedbackMutation = useMutation({
    mutationFn: async (data: FeedbackForm) => {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit feedback");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! It's now public for others to see.",
      });
      form.reset();
      setSelectedRating(0);
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    },
  });

  const likeMutation = useMutation({
    mutationFn: async (feedbackId: string) => {
      const response = await fetch(`/api/feedback/${feedbackId}/like`, {
        method: "POST",
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to like feedback");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });

  const onSubmit = (data: FeedbackForm) => {
    feedbackMutation.mutate(data);
  };

  const renderStars = (rating: number, interactive = false) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-6 h-6 ${
              star <= rating 
                ? "fill-yellow-400 text-yellow-400" 
                : "text-gray-400"
            } ${interactive ? "cursor-pointer hover:text-yellow-300" : ""}`}
            onClick={interactive ? () => {
              setSelectedRating(star);
              form.setValue("rating", star);
            } : undefined}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Feedback Form */}
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <MessageCircle className="w-6 h-6 mr-3 text-primary-blue" />
              Share Your Feedback
            </CardTitle>
            <p className="text-gray-400">
              Your feedback will be posted publicly to help improve our community.
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="rating"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Rating</FormLabel>
                      <FormControl>
                        <div>
                          {renderStars(selectedRating, true)}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white">Your Feedback</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Share your thoughts about the platform, features, or community..."
                          className="bg-dark-bg text-white border-dark-border"
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-primary-blue hover:bg-primary-blue/80 text-white"
                  disabled={feedbackMutation.isPending}
                >
                  {feedbackMutation.isPending ? "Submitting..." : "Submit Feedback"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Public Feedback */}
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white">Community Feedback</CardTitle>
            <p className="text-gray-400">See what others are saying about our platform</p>
          </CardHeader>
          <CardContent>
            {feedbacks.length === 0 ? (
              <div className="text-center py-8">
                <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No feedback yet. Be the first to share!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {feedbacks.map((feedback: Feedback) => (
                  <div key={feedback.id} className="bg-dark-bg rounded-lg p-4 border border-dark-border">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-white font-medium">{feedback.userName}</h4>
                        <div className="flex items-center space-x-3 mt-1">
                          {renderStars(feedback.rating)}
                          <span className="text-gray-400 text-sm flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(feedback.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{feedback.message}</p>
                    <div className="flex items-center justify-between">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white"
                        onClick={() => likeMutation.mutate(feedback.id)}
                      >
                        <ThumbsUp className="w-4 h-4 mr-1" />
                        {feedback.likes}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
