
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";
import { Flag, AlertTriangle, User } from "lucide-react";

const reportSchema = z.object({
  reportedUserId: z.string().min(1, "Please select a user to report"),
  reason: z.string().min(1, "Please select a reason"),
  description: z.string().min(10, "Please provide more details (minimum 10 characters)"),
});

type ReportForm = z.infer<typeof reportSchema>;

interface User {
  id: string;
  name: string;
  email: string;
  yearOfCompletion: number;
  streamClan: string;
}

const reportReasons = [
  "Inappropriate content",
  "Harassment or bullying",
  "Spam or fake account",
  "Hate speech",
  "Impersonation",
  "Other"
];

export default function Report() {
  const { toast } = useToast();

  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reportedUserId: "",
      reason: "",
      description: "",
    },
  });

  const { data: users = [] } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (data: ReportForm) => {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          ...getAuthHeaders(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to submit report");
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for your report. We'll review it shortly.",
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportForm) => {
    reportMutation.mutate(data);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <Card className="bg-dark-card border-dark-border">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Flag className="w-6 h-6 mr-3 text-red-500" />
            Report a User
          </CardTitle>
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mt-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <p className="text-yellow-200 text-sm">
                  Please use this feature responsibly. False reports may result in action against your account.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="reportedUserId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">User to Report</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-dark-bg text-white border-dark-border">
                          <SelectValue placeholder="Select a user" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark-card border-dark-border">
                        {users.map((user: User) => (
                          <SelectItem key={user.id} value={user.id} className="text-white">
                            <div className="flex items-center space-x-2">
                              <User size={16} />
                              <span>{user.name} ({user.yearOfCompletion} {user.streamClan})</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Reason for Report</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-dark-bg text-white border-dark-border">
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="bg-dark-card border-dark-border">
                        {reportReasons.map((reason) => (
                          <SelectItem key={reason} value={reason} className="text-white">
                            {reason}
                          </SelectItem>
                        ))}
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
                  <FormItem>
                    <FormLabel className="text-white">Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Please provide details about the issue..."
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
                className="w-full bg-red-600 hover:bg-red-700 text-white"
                disabled={reportMutation.isPending}
              >
                {reportMutation.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
