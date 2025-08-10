import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { getAuthHeaders } from "@/lib/auth";
import { useState } from "react";
import { Users, Search, GraduationCap, Calendar, MapPin, Mail, Phone } from "lucide-react";

interface User {
  id: string;
  name: string;
  email: string;
  profilePicture?: string;
  yearOfCompletion: number;
  streamClan: string;
  location?: string;
  bio?: string;
}

export default function Database() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [filterStream, setFilterStream] = useState("");

  const { data: users = [], isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await fetch("/api/users", {
        headers: getAuthHeaders(),
      });
      if (!response.ok) throw new Error("Failed to fetch users");
      return response.json();
    },
  });

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesYear = !filterYear || user.yearOfCompletion?.toString() === filterYear;
    const matchesStream = !filterStream || user.streamClan?.toLowerCase().includes(filterStream.toLowerCase());

    return matchesSearch && matchesYear && matchesStream;
  });

  const getUserInitials = (name: string) => {
    if (!name) return "??";
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "from-blue-500 to-purple-500",
      "from-green-500 to-teal-500",
      "from-pink-500 to-red-500",
      "from-yellow-500 to-orange-500",
      "from-indigo-500 to-blue-500",
      "from-purple-500 to-pink-500",
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-300 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-6">
        <Card className="bg-dark-card border-dark-border">
          <CardContent className="p-6 text-center">
            <p className="text-red-400">Error loading database. Please try again.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <Card className="bg-dark-card border-dark-border mb-6">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="w-6 h-6 mr-3" />
            Alumni Database
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-dark-bg text-white border-dark-border pl-10"
              />
            </div>
            <Input
              type="text"
              placeholder="Filter by year..."
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="bg-dark-bg text-white border-dark-border md:w-40"
            />
            <Input
              type="text"
              placeholder="Filter by stream..."
              value={filterStream}
              onChange={(e) => setFilterStream(e.target.value)}
              className="bg-dark-bg text-white border-dark-border md:w-40"
            />
          </div>

          <div className="text-sm text-gray-400 mb-4">
            {filteredUsers.length} alumni found
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredUsers.map((user: User, index: number) => (
              <Card key={user.id} className="bg-dark-bg border-dark-border hover:border-primary-blue transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className={`w-16 h-16 bg-gradient-to-r ${getGradientClass(index)} rounded-full flex items-center justify-center overflow-hidden`}>
                      {user.profilePicture ? (
                        <img
                          src={user.profilePicture}
                          alt={user.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-white font-bold text-lg">
                          {getUserInitials(user.name)}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{user.name || "Unknown"}</h3>
                      <p className="text-gray-400 text-sm flex items-center">
                        <Mail className="w-4 h-4 mr-1" />
                        {user.email || "No email"}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center text-gray-300">
                      <GraduationCap className="w-4 h-4 mr-2" />
                      <span className="text-sm">{user.streamClan || "Unknown Stream"}</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span className="text-sm">Class of {user.yearOfCompletion || "Unknown"}</span>
                    </div>
                    {user.location && (
                      <div className="flex items-center text-gray-300">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{user.location}</span>
                      </div>
                    )}
                  </div>

                  {user.bio && (
                    <div className="mt-4 p-3 bg-dark-card rounded-lg">
                      <p className="text-gray-300 text-sm">{user.bio}</p>
                    </div>
                  )}

                  <Button
                    className="w-full mt-4 bg-primary-blue hover:bg-primary-blue/80 text-white"
                    onClick={() => window.location.href = `/inbox?user=${user.id}`}
                  >
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No alumni found</h3>
              <p className="text-gray-400">Try adjusting your search filters.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}