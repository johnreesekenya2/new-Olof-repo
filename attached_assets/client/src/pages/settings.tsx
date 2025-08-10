
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { getAuthHeaders } from "@/lib/auth";
import { Camera, Upload, User, Shield, Edit, Save } from "lucide-react";
import { z } from "zod";

const settingsSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  bio: z.string().optional(),
  yearOfCompletion: z.number().min(2000).max(2030),
  streamClan: z.string().min(1, "Stream/Clan is required"),
  gender: z.enum(["male", "female", "other"]),
  hideEmail: z.boolean(),
  hidePhone: z.boolean(),
});

type SettingsForm = z.infer<typeof settingsSchema>;

export default function Settings() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  const [profilePicture, setProfilePicture] = useState<File | null>(null);
  const [coverPhoto, setCoverPhoto] = useState<File | null>(null);

  const form = useForm<SettingsForm>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      bio: user?.bio || "",
      yearOfCompletion: user?.yearOfCompletion || 2023,
      streamClan: user?.streamClan || "",
      gender: user?.gender || "male",
      hideEmail: false,
      hidePhone: false,
    },
  });

  const { data: userSettings } = useQuery({
    queryKey: ["user-settings"],
    queryFn: async () => {
      const response = await fetch("/api/user/settings", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch settings");
      return response.json();
    },
  });

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: SettingsForm) => {
      const formData = new FormData();
      
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value.toString());
      });

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      if (coverPhoto) {
        formData.append("coverPhoto", coverPhoto);
      }

      const response = await fetch("/api/user/settings", {
        method: "PUT",
        headers: getAuthHeaders(),
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
        title: "Settings Updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SettingsForm) => {
    updateSettingsMutation.mutate(data);
  };

  const handleFileSelect = (type: "profile" | "cover", file: File | null) => {
    if (type === "profile") {
      setProfilePicture(file);
    } else {
      setCoverPhoto(file);
    }
  };

  const getUserInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center">
            <Edit className="text-white" size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-gray-400">Manage your account and privacy settings</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Profile Pictures */}
            <Card className="bg-dark-card border-dark-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Camera className="w-5 h-5 mr-2" />
                  Profile Pictures
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Cover Photo */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Cover Photo</label>
                  <div className="relative h-32 bg-gradient-to-r from-primary-blue to-success-green rounded-lg overflow-hidden">
                    {coverPhoto ? (
                      <img
                        src={URL.createObjectURL(coverPhoto)}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : user?.coverPhoto ? (
                      <img
                        src={user.coverPhoto}
                        alt="Cover"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary-blue to-success-green"></div>
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
                      className="absolute top-2 right-2 bg-black/50 text-white px-3 py-1 rounded-lg cursor-pointer hover:bg-black/70 flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>Change Cover</span>
                    </label>
                  </div>
                </div>

                {/* Profile Picture */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">Profile Picture</label>
                  <div className="flex items-center space-x-4">
                    <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center overflow-hidden">
                      {profilePicture ? (
                        <img
                          src={URL.createObjectURL(profilePicture)}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : user?.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-xl">
                          {getUserInitials(user?.name || '')}
                        </span>
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
                        Change Picture
                      </label>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Personal Information */}
            <Card className="bg-dark-card border-dark-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Full Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="bg-dark-bg border-dark-border text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            className="bg-dark-bg border-dark-border text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-300">Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          className="bg-dark-bg border-dark-border text-white"
                          placeholder="Tell us about yourself..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="yearOfCompletion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Year of Completion</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="bg-dark-bg border-dark-border text-white"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="streamClan"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Stream/Clan</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-dark-bg border-dark-border text-white">
                              <SelectValue placeholder="Select stream" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="A-CLAN">A-CLAN</SelectItem>
                            <SelectItem value="B-CLAN">B-CLAN</SelectItem>
                            <SelectItem value="C-CLAN">C-CLAN</SelectItem>
                            <SelectItem value="D-CLAN">D-CLAN</SelectItem>
                            <SelectItem value="E-CLAN">E-CLAN</SelectItem>
                            <SelectItem value="F-CLAN">F-CLAN</SelectItem>
                            <SelectItem value="G-CLAN">G-CLAN</SelectItem>
                            <SelectItem value="H-CLAN">H-CLAN</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-300">Gender</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-dark-bg border-dark-border text-white">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">Male</SelectItem>
                            <SelectItem value="female">Female</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card className="bg-dark-card border-dark-border">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Privacy Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="hideEmail"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                      <div>
                        <FormLabel className="text-gray-300 font-medium">Hide Email</FormLabel>
                        <p className="text-gray-400 text-sm">Don't show your email to other users</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hidePhone"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between p-4 bg-dark-bg rounded-lg">
                      <div>
                        <FormLabel className="text-gray-300 font-medium">Hide Phone Number</FormLabel>
                        <p className="text-gray-400 text-sm">Don't show your phone number to other users</p>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Save Button */}
            <Button
              type="submit"
              className="w-full bg-success-green hover:bg-success-green/80 text-white"
              disabled={updateSettingsMutation.isPending}
            >
              <Save className="w-4 h-4 mr-2" />
              {updateSettingsMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
