import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { profileSetupSchema, type ProfileSetup } from "@shared/schema";
import { Camera, Upload } from "lucide-react";

export default function ProfileSetup() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { updateUser, user } = useAuth();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

  const form = useForm<ProfileSetup>({
    resolver: zodResolver(profileSetupSchema),
    defaultValues: {
      bio: "",
    },
  });

  const setupMutation = useMutation({
    mutationFn: async (data: ProfileSetup) => {
      const formData = new FormData();
      formData.append("bio", data.bio);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      if (coverPhoto) {
        formData.append("coverPhoto", coverPhoto);
      }

      const token = localStorage.getItem('auth_token');
      const response = await fetch("/api/auth/profile-setup", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      return response.json();
    },
    onSuccess: (data) => {
      updateUser(data.user);
      toast({
        title: "Profile setup completed!",
        description: "Welcome to OLOF Alumni community.",
      });
      setLocation("/home");
    },
    onError: (error: any) => {
      toast({
        title: "Profile setup failed",
        description: error.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ProfileSetup) => {
    setupMutation.mutate(data);
  };

  const handleFileSelect = (type: "profile" | "cover", file: File | null) => {
    if (type === "profile") {
      setProfilePicture(file);
    } else {
      setCoverPhoto(file);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="text-white" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Complete Your Profile</h1>
          <p className="text-gray-400">Add a profile picture and bio to get started</p>
        </div>

        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white text-center">Profile Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Profile Picture */}
                <div className="text-center">
                  <div className="w-24 h-24 bg-gray-600 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                    {profilePicture ? (
                      <img
                        src={URL.createObjectURL(profilePicture)}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Camera className="text-gray-400" size={32} />
                    )}
                  </div>
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      id="profile-picture"
                      className="hidden"
                      onChange={(e) => handleFileSelect("profile", e.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor="profile-picture"
                      className="inline-flex items-center px-4 py-2 bg-primary-blue text-white rounded-lg hover:bg-primary-blue/80 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Profile Picture
                    </label>
                  </div>
                </div>

                {/* Cover Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Cover Photo</label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center relative">
                    {coverPhoto ? (
                      <div>
                        <img
                          src={URL.createObjectURL(coverPhoto)}
                          alt="Cover"
                          className="w-full h-32 object-cover rounded-lg mb-2"
                        />
                        <p className="text-gray-400">{coverPhoto.name}</p>
                      </div>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-500 mx-auto mb-2" />
                        <p className="text-gray-400">Click to upload cover photo</p>
                      </>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      id="cover-photo"
                      className="hidden"
                      onChange={(e) => handleFileSelect("cover", e.target.files?.[0] || null)}
                    />
                    <label
                      htmlFor="cover-photo"
                      className="absolute inset-0 w-full h-full cursor-pointer"
                    />
                  </div>
                </div>

                {/* Bio */}
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Bio (minimum 5 words)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us about yourself..."
                          className="bg-dark-bg border-dark-border text-white"
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
                  className="w-full bg-success-green hover:bg-success-green/80 text-white"
                  disabled={setupMutation.isPending}
                >
                  {setupMutation.isPending ? "Completing Profile..." : "Complete Profile"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}