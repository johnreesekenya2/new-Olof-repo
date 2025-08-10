import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Camera, Edit, Settings, MapPin, Calendar, Users } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();

  const getUserInitials = (name: string) => {
    return name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Profile Header */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-0">
            {/* Cover Photo */}
            <div className="relative h-48 bg-gradient-to-r from-primary-blue to-success-green rounded-t-lg overflow-hidden">
              {user?.coverPhoto ? (
                <img
                  src={user.coverPhoto}
                  alt="Cover"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-primary-blue to-success-green"></div>
              )}
              <Button
                size="sm"
                variant="outline"
                className="absolute top-4 right-4 border-white/20 text-white hover:bg-white/20"
              >
                <Camera className="w-4 h-4 mr-2" />
                Edit Cover
              </Button>
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6">
              <div className="flex items-end justify-between -mt-16 mb-4">
                <div className="relative">
                  <div className="w-32 h-32 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-dark-card flex items-center justify-center overflow-hidden">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-2xl">
                        {getUserInitials(user?.name || '')}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 w-8 h-8 rounded-full bg-primary-blue hover:bg-primary-blue/80 text-white p-0"
                  >
                    <Camera className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                  <Button
                    variant="outline"
                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                  >
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h1 className="text-3xl font-bold text-white">{user?.name}</h1>
                  <p className="text-gray-400 text-lg">{user?.email}</p>
                </div>

                {user?.bio && (
                  <p className="text-gray-300 leading-relaxed">{user.bio}</p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">Class of {user?.yearOfCompletion}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4" />
                    <span className="text-sm">{user?.streamClan}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span className="text-sm">OLOF Alumni</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="text-sm capitalize">{user?.gender}</span>
                  </div>
                  {!user?.hideEmail && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm">📧 {user?.email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white mb-2">0</div>
              <p className="text-gray-400">Posts</p>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white mb-2">0</div>
              <p className="text-gray-400">Connections</p>
            </CardContent>
          </Card>
          
          <Card className="bg-dark-card border-dark-border">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-white mb-2">0</div>
              <p className="text-gray-400">Photos</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
            <div className="text-center py-8">
              <p className="text-gray-400">No recent activity to show.</p>
              <p className="text-gray-500 text-sm mt-2">
                Start posting and connecting with fellow alumni to see your activity here.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
