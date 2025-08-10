import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { verificationSchema, type VerificationData } from "@shared/schema";
import { Mail, ArrowLeft } from "lucide-react";

export default function Verify() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const emailParam = params.get("email");
    if (emailParam) {
      setEmail(decodeURIComponent(emailParam));
    } else {
      setLocation("/register");
    }
  }, [setLocation]);

  const form = useForm<VerificationData>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      email: email,
      code: "",
    },
  });

  useEffect(() => {
    form.setValue("email", email);
  }, [email, form]);

  const verifyMutation = useMutation({
    mutationFn: async (data: VerificationData) => {
      const response = await apiRequest("POST", "/api/auth/verify", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Email verified successfully!",
        description: "Welcome to OLOF Alumni! Please complete your profile.",
      });
      setLocation("/profile-setup");
    },
    onError: (error: any) => {
      toast({
        title: "Verification failed",
        description: error.message || "Invalid verification code",
        variant: "destructive",
      });
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", "/api/auth/resend-code", { email });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Code sent!",
        description: "A new verification code has been sent to your email.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Failed to resend code",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VerificationData) => {
    verifyMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Button
            variant="ghost"
            onClick={() => setLocation("/register")}
            className="mb-4 text-gray-400 hover:text-white"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Register
          </Button>
          
          <div className="w-16 h-16 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Verify Your Email</h1>
          <p className="text-gray-400 mb-2">We've sent a verification code to:</p>
          <p className="text-primary-blue font-semibold">{email}</p>
        </div>

        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white text-center">Enter Verification Code</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="code"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Verification Code</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="000000"
                          maxLength={6}
                          className="bg-dark-bg border-dark-border text-white text-center text-2xl tracking-widest"
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
                  disabled={verifyMutation.isPending}
                >
                  {verifyMutation.isPending ? "Verifying..." : "Verify Email"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white"
                  disabled={resendCodeMutation.isPending}
                  onClick={() => resendCodeMutation.mutate()}
                >
                  {resendCodeMutation.isPending ? "Sending..." : "Resend Code"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-400">
                Didn't receive the code? Make sure you entered a valid email address.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
