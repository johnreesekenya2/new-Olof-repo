import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Settings, User, Bell, Shield, Palette, Database } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6 space-y-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-4">Settings</h1>
          <p className="text-gray-300 text-xl">Manage your account preferences and privacy settings</p>
        </div>

        {/* Profile Settings */}
        <Card className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent flex items-center">
              <User className="w-6 h-6 mr-3 text-blue-400" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="displayName" className="text-gray-300">Display Name</Label>
                <Input
                  id="displayName"
                  placeholder="Your display name"
                  className="bg-gray-900/50 border-blue-500/30 text-white placeholder-gray-400 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
              <div>
                <Label htmlFor="email" className="text-gray-300">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  className="bg-gray-900/50 border-blue-500/30 text-white placeholder-gray-400 rounded-lg focus:border-blue-400 focus:ring-2 focus:ring-blue-400/20"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Privacy Settings */}
        <Card className="bg-black/40 backdrop-blur-lg border-2 border-green-500/20 shadow-2xl shadow-green-500/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center">
              <Shield className="w-6 h-6 mr-3 text-green-400" />
              Privacy Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300 text-lg">Hide Email</Label>
                <p className="text-gray-400 text-sm">Hide your email from other users</p>
              </div>
              <Switch />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300 text-lg">Profile Visibility</Label>
                <p className="text-gray-400 text-sm">Make your profile visible to alumni only</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Notification Settings */}
        <Card className="bg-black/40 backdrop-blur-lg border-2 border-purple-500/20 shadow-2xl shadow-purple-500/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center">
              <Bell className="w-6 h-6 mr-3 text-purple-400" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300 text-lg">Email Notifications</Label>
                <p className="text-gray-400 text-sm">Receive updates via email</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-gray-300 text-lg">Message Notifications</Label>
                <p className="text-gray-400 text-sm">Get notified of new messages</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-center">
          <Button className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-4 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-105">
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}