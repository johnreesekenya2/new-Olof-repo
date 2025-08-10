
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Award, Mail, Phone, Github, Code, Heart, Star } from "lucide-react";

export default function Credits() {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(true), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-dark-bg via-gray-900 to-black overflow-hidden">
      <div className="max-w-4xl mx-auto px-4 py-12">
        
        {/* Main Title */}
        <div className="text-center mb-16">
          <div className="w-24 h-24 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="text-white" size={48} />
          </div>
          <h1 className="text-5xl font-bold text-white mb-4 bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
            CREDITS
          </h1>
          <p className="text-xl text-gray-400">OLOF Alumni Network Platform</p>
        </div>

        {/* Animated Credits */}
        <div className={`space-y-12 transition-all duration-1000 ${isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          
          {/* Created By */}
          <Card className="bg-gradient-to-r from-primary-blue/20 to-success-green/20 border-primary-blue/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="text-2xl font-bold text-white mb-2">CREATED BY</div>
                <div className="w-24 h-1 bg-gradient-to-r from-primary-blue to-success-green mx-auto rounded-full"></div>
              </div>
              <div className="space-y-4">
                <h2 className="text-4xl font-bold text-white bg-gradient-to-r from-primary-blue to-success-green bg-clip-text text-transparent">
                  PASCAL ERICK
                </h2>
                <p className="text-xl text-gray-300">Alias: John Reese</p>
                <div className="flex justify-center items-center space-x-2 text-success-green">
                  <Star className="w-5 h-5 fill-current" />
                  <span className="text-lg font-semibold">2023 G-CLAN Graduate</span>
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-purple-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-2xl font-bold text-white mb-2">CONTACT INFORMATION</div>
                <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-4 bg-dark-card/50 rounded-lg p-4">
                  <Mail className="w-6 h-6 text-purple-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Email</p>
                    <p className="text-white font-medium">fsocietycipherrevolt@gmail.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 bg-dark-card/50 rounded-lg p-4">
                  <Phone className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-gray-400 text-sm">Phone</p>
                    <p className="text-white font-medium">+264745282166</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Technical Specifications */}
          <Card className="bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 border-indigo-500/30 backdrop-blur-sm">
            <CardContent className="p-8">
              <div className="text-center mb-8">
                <div className="text-2xl font-bold text-white mb-2">TECHNICAL DIRECTION</div>
                <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-cyan-500 mx-auto rounded-full"></div>
              </div>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center bg-dark-card/50 rounded-lg p-6">
                  <Code className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Frontend</h3>
                  <p className="text-gray-400 text-sm">React, TypeScript, Tailwind CSS</p>
                </div>
                <div className="text-center bg-dark-card/50 rounded-lg p-6">
                  <Github className="w-8 h-8 text-green-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Backend</h3>
                  <p className="text-gray-400 text-sm">Node.js, Express, PostgreSQL</p>
                </div>
                <div className="text-center bg-dark-card/50 rounded-lg p-6">
                  <Heart className="w-8 h-8 text-red-400 mx-auto mb-3" />
                  <h3 className="text-white font-semibold mb-2">Deployment</h3>
                  <p className="text-gray-400 text-sm">Replit Platform</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Special Thanks */}
          <Card className="bg-gradient-to-r from-yellow-500/20 to-red-500/20 border-yellow-500/30 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="mb-6">
                <div className="text-2xl font-bold text-white mb-2">SPECIAL THANKS</div>
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-500 to-red-500 mx-auto rounded-full"></div>
              </div>
              <div className="space-y-4">
                <p className="text-xl text-white">Our Lady of Fatima Secondary School</p>
                <p className="text-lg text-gray-300">For nurturing excellence and fostering lifelong connections</p>
                <p className="text-lg text-gray-300">To all alumni who make this community vibrant and meaningful</p>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center py-12">
            <div className="text-6xl mb-6">🎬</div>
            <p className="text-2xl font-bold text-white mb-4">
              Thank you for being part of the OLOF Alumni Family
            </p>
            <p className="text-gray-400">
              Hosted at johnreeselegacies.tech:3000
            </p>
            <div className="mt-8 flex justify-center items-center space-x-2">
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
              <span className="text-white">Made with love for the alumni community</span>
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
