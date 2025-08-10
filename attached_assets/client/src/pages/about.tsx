
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, Users, Database, MessageSquare, Image, Bell, GraduationCap } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: Database,
      title: "Alumni Database",
      description: "Connect with fellow graduates, search by year or clan, and expand your network."
    },
    {
      icon: MessageSquare,
      title: "Real-time Messaging",
      description: "Direct conversations with alumni through our instant messaging system."
    },
    {
      icon: Image,
      title: "Gallery",
      description: "Share and view memorable moments from your school days and beyond."
    },
    {
      icon: Bell,
      title: "Notifications",
      description: "Stay updated with real-time notifications for messages and activities."
    },
    {
      icon: Users,
      title: "Community Posts",
      description: "Share updates, achievements, and engage with the alumni community."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <div className="space-y-6">
        {/* Header */}
        <Card className="bg-dark-card border-dark-border">
          <CardHeader className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="text-white" size={40} />
            </div>
            <CardTitle className="text-white text-3xl mb-2">About OLOF Alumni Network</CardTitle>
            <p className="text-gray-400 text-lg">
              Connecting Our Lady of Fatima Secondary School graduates worldwide
            </p>
          </CardHeader>
        </Card>

        {/* Mission */}
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white flex items-center">
              <Info className="w-6 h-6 mr-3 text-primary-blue" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300 leading-relaxed">
              The OLOF Alumni Network is dedicated to fostering lifelong connections among graduates of 
              Our Lady of Fatima Secondary School. We provide a digital platform where alumni can 
              reconnect, share experiences, celebrate achievements, and support one another in their 
              personal and professional journeys.
            </p>
          </CardContent>
        </Card>

        {/* Features */}
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white">Platform Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary-blue to-success-green rounded-lg flex items-center justify-center flex-shrink-0">
                    <feature.icon className="text-white" size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* School Information */}
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white">About Our Lady of Fatima Secondary School</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300">
                Our Lady of Fatima Secondary School has been a pillar of educational excellence, 
                nurturing students across different clans and producing graduates who excel in 
                various fields around the world.
              </p>
              <div className="grid md:grid-cols-3 gap-4 mt-6">
                <div className="bg-dark-bg rounded-lg p-4 text-center">
                  <h4 className="text-success-green font-semibold mb-2">G-CLAN</h4>
                  <p className="text-gray-400 text-sm">Excellence in leadership and innovation</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-4 text-center">
                  <h4 className="text-primary-blue font-semibold mb-2">V-CLAN</h4>
                  <p className="text-gray-400 text-sm">Victory through perseverance</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-4 text-center">
                  <h4 className="text-purple-400 font-semibold mb-2">P-CLAN</h4>
                  <p className="text-gray-400 text-sm">Pursuit of knowledge and wisdom</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-4 text-center">
                  <h4 className="text-yellow-400 font-semibold mb-2">L-CLAN</h4>
                  <p className="text-gray-400 text-sm">Leadership and service</p>
                </div>
                <div className="bg-dark-bg rounded-lg p-4 text-center">
                  <h4 className="text-pink-400 font-semibold mb-2">W-CLAN</h4>
                  <p className="text-gray-400 text-sm">Wisdom and understanding</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Community Guidelines */}
        <Card className="bg-dark-card border-dark-border">
          <CardHeader>
            <CardTitle className="text-white">Community Guidelines</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <span className="text-success-green mr-2">•</span>
                Be respectful and supportive of fellow alumni
              </li>
              <li className="flex items-start">
                <span className="text-success-green mr-2">•</span>
                Share positive experiences and achievements
              </li>
              <li className="flex items-start">
                <span className="text-success-green mr-2">•</span>
                Help with mentoring and volunteering initiatives
              </li>
              <li className="flex items-start">
                <span className="text-success-green mr-2">•</span>
                Keep the OLOF spirit alive in all interactions
              </li>
              <li className="flex items-start">
                <span className="text-success-green mr-2">•</span>
                Report any inappropriate behavior to maintain a safe community
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
