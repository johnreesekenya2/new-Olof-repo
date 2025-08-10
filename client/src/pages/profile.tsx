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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="space-y-6">
          {/* Profile Header */}
          <Card className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl">
            <CardContent className="p-0">
              {/* Cover Photo */}
              <div className="relative h-60 bg-gradient-to-r from-blue-600 to-green-600 rounded-t-3xl overflow-hidden">
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
                className="absolute top-6 right-6 border-white/30 bg-black/20 backdrop-blur-sm text-white hover:bg-white/20 rounded-xl transition-all duration-300"
              >
                <Camera className="w-4 h-4 mr-2" />
                Edit Cover
              </Button>
            </div>

            {/* Profile Info */}
            <div className="px-8 pb-8">
              <div className="flex items-end justify-between -mt-20 mb-6">
                <div className="relative">
                  <div className="w-36 h-36 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-black/40 flex items-center justify-center overflow-hidden shadow-2xl shadow-blue-500/30">
                    {user?.profilePicture ? (
                      <img
                        src={user.profilePicture}
                        alt={user.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white font-bold text-3xl">
                        {getUserInitials(user?.name || '')}
                      </span>
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="absolute bottom-2 right-2 w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white p-0 shadow-lg shadow-blue-500/30 transition-all duration-300 hover:scale-105"
                  >
                    <Camera className="w-5 h-5" />
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
                    <span className="text-sm">👤</span>
                    <span className="text-sm capitalize">{user?.gender}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

          {/* Profile Stats */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-2">0</div>
                <p className="text-gray-300">Posts</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-lg border-2 border-green-500/20 shadow-2xl shadow-green-500/10 rounded-3xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">0</div>
                <p className="text-gray-300">Connections</p>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-lg border-2 border-purple-500/20 shadow-2xl shadow-purple-500/10 rounded-3xl">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">0</div>
                <p className="text-gray-300">Photos</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">Recent Activity</h3>
              <div className="text-center py-12">
                <p className="text-gray-300 text-lg">No recent activity to show.</p>
                <p className="text-gray-400 text-sm mt-3">
                  Start posting and connecting with fellow alumni to see your activity here.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
