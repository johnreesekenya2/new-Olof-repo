import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MessageCircle, Send, Star, Bug, Lightbulb, Heart } from "lucide-react";
import { z } from "zod";

const feedbackSchema = z.object({
  type: z.string().min(1, "Please select a feedback type"),
  subject: z.string().min(1, "Subject is required"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  rating: z.string().optional(),
});

type FeedbackForm = z.infer<typeof feedbackSchema>;

export default function Feedback() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FeedbackForm>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      type: "",
      subject: "",
      message: "",
      rating: "",
    },
  });

  const onSubmit = (data: FeedbackForm) => {
    console.log("Feedback submitted:", data);
    setIsSubmitted(true);
    toast({
      title: "Feedback Submitted!",
      description: "Thank you for your valuable feedback. We'll review it and get back to you soon.",
    });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center px-4">
        <Card className="bg-black/40 backdrop-blur-lg border-2 border-green-500/20 shadow-2xl shadow-green-500/20 rounded-3xl max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-4">
              Thank You!
            </h2>
            <p className="text-xl text-gray-300 mb-6">
              Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
            </p>
            <Button
              onClick={() => setIsSubmitted(false)}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105"
            >
              Submit More Feedback
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">We Value Your Feedback</h1>
          <p className="text-xl text-gray-300">Help us improve the OLOF Alumni platform</p>
        </div>

        <Card className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent flex items-center">
              <MessageCircle className="w-8 h-8 mr-4 text-blue-400" />
              Share Your Thoughts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-lg">Feedback Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-900/50 border-blue-500/30 text-white rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20">
                              <SelectValue placeholder="Select feedback type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-900 border-blue-500/20">
                            <SelectItem value="suggestion" className="text-white">
                              <div className="flex items-center">
                                <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
                                Suggestion
                              </div>
                            </SelectItem>
                            <SelectItem value="bug" className="text-white">
                              <div className="flex items-center">
                                <Bug className="w-4 h-4 mr-2 text-red-400" />
                                Bug Report
                              </div>
                            </SelectItem>
                            <SelectItem value="compliment" className="text-white">
                              <div className="flex items-center">
                                <Star className="w-4 h-4 mr-2 text-green-400" />
                                Compliment
                              </div>
                            </SelectItem>
                            <SelectItem value="other" className="text-white">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="rating"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300 text-lg">Overall Rating (Optional)</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-gray-900/50 border-blue-500/30 text-white rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20">
                              <SelectValue placeholder="Rate your experience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-gray-900 border-blue-500/20">
                            <SelectItem value="5" className="text-white">⭐⭐⭐⭐⭐ Excellent</SelectItem>
                            <SelectItem value="4" className="text-white">⭐⭐⭐⭐ Good</SelectItem>
                            <SelectItem value="3" className="text-white">⭐⭐⭐ Average</SelectItem>
                            <SelectItem value="2" className="text-white">⭐⭐ Poor</SelectItem>
                            <SelectItem value="1" className="text-white">⭐ Very Poor</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300 text-lg">Subject</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Brief summary of your feedback"
                          className="bg-gray-900/50 border-blue-500/30 text-white placeholder-gray-400 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 py-3"
                          {...field}
                        />
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
                      <FormLabel className="text-gray-300 text-lg">Your Message</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide detailed feedback. Your input helps us improve the platform for all alumni."
                          className="bg-gray-900/50 border-blue-500/30 text-white placeholder-gray-400 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20 min-h-32 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-center pt-4">
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Feedback
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}