import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, Target, Award, Heart, School } from "lucide-react";

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">About OLOF Alumni</h1>
          <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Connecting generations of Our Lady of Fatima Secondary School graduates in a vibrant digital community
          </p>
        </div>

        {/* Mission Card */}
        <Card className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent flex items-center">
              <Target className="w-8 h-8 mr-4 text-blue-400" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl text-gray-300 leading-relaxed">
              To foster lifelong connections among OLOF alumni, support professional development, 
              and strengthen our school community through meaningful collaboration and shared experiences. 
              We believe in the power of our network to inspire, mentor, and uplift each other.
            </p>
          </CardContent>
        </Card>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-black/40 backdrop-blur-lg border-2 border-green-500/20 shadow-2xl shadow-green-500/10 rounded-3xl hover:scale-[1.02] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent flex items-center">
                <Users className="w-6 h-6 mr-3 text-green-400" />
                Community Connection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-300">
                Connect with classmates, share memories, and build lasting professional relationships 
                within our close-knit alumni community.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-2 border-purple-500/20 shadow-2xl shadow-purple-500/10 rounded-3xl hover:scale-[1.02] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent flex items-center">
                <Award className="w-6 h-6 mr-3 text-purple-400" />
                Professional Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-300">
                Access mentorship opportunities, career resources, and professional networking 
                to advance your career and personal development.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-2 border-yellow-500/20 shadow-2xl shadow-yellow-500/10 rounded-3xl hover:scale-[1.02] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent flex items-center">
                <School className="w-6 h-6 mr-3 text-yellow-400" />
                School Legacy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-300">
                Give back to our alma mater through volunteer opportunities, fundraising initiatives, 
                and supporting current students in their academic journey.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-black/40 backdrop-blur-lg border-2 border-red-500/20 shadow-2xl shadow-red-500/10 rounded-3xl hover:scale-[1.02] transition-all duration-300">
            <CardHeader>
              <CardTitle className="text-2xl font-bold bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent flex items-center">
                <Heart className="w-6 h-6 mr-3 text-red-400" />
                Lifelong Bonds
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-gray-300">
                Celebrate achievements, share life milestones, and maintain the friendships 
                that began during our formative years at OLOF.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Contact Info */}
        <Card className="bg-black/40 backdrop-blur-lg border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 rounded-3xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent flex items-center">
              <Info className="w-8 h-8 mr-4 text-blue-400" />
              Get In Touch
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-xl text-gray-300 mb-4">
                Have questions or suggestions? We'd love to hear from you!
              </p>
              <p className="text-lg text-gray-400">
                Contact us through the feedback section or reach out to our alumni coordinators.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}