import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const images = [
  "https://files.catbox.moe/ycaqbp.jpg",
  "https://files.catbox.moe/gbp5y0.jpg", 
  "https://files.catbox.moe/j9s1t1.jpg",
  "https://files.catbox.moe/q9ewvt.jpg",
];

export default function Welcome() {
  const [showLoader, setShowLoader] = useState(false); // Skip loader for demo
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Don't redirect immediately for demo purposes
    // if (isAuthenticated) {
    //   setLocation("/home");
    // }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  if (showLoader) {
    return <Loader onComplete={() => setShowLoader(false)} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 via-purple-600/10 to-green-600/10"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Enhanced Header */}
      <header className="relative z-10 bg-black/20 backdrop-blur-lg border-b border-blue-500/20 p-6 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-blue-500/30 animate-bounce">
              <GraduationCap className="text-white" size={28} />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">OLOF ALUMNI</h1>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button 
              onClick={() => setLocation("/login")}
              className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white transition-all duration-300 px-8 py-3 rounded-xl font-semibold"
            >
              Login
            </Button>
            <Button 
              onClick={() => setLocation("/register")}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-8 py-3 rounded-xl font-semibold shadow-xl shadow-blue-500/30 transition-all duration-300 hover:scale-105"
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Centered Welcome Content */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-200px)] px-4 py-16">
        {/* Hero Section - Centered */}
        <div className="text-center mb-16 max-w-5xl mx-auto">
          <h2 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-green-400 bg-clip-text text-transparent mb-8 leading-tight animate-bounce">
            Welcome to Our Lady of Fatima
          </h2>
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Alumni Community Portal
          </h3>
          <div className="w-40 h-2 bg-gradient-to-r from-blue-500 to-green-500 mx-auto rounded-full shadow-lg shadow-blue-500/50 mb-8"></div>
          <p className="text-2xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light">
            Connect, Share, and Grow with fellow alumni in our vibrant digital community
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mt-12">
            <Button 
              onClick={() => setLocation("/register")}
              className="bg-gradient-to-r from-blue-600 to-green-600 hover:from-blue-700 hover:to-green-700 text-white px-12 py-4 rounded-2xl font-bold text-xl shadow-2xl shadow-blue-500/30 transition-all duration-300 hover:scale-110 transform"
            >
              Join Community
            </Button>
            <Button 
              onClick={() => setLocation("/login")}
              className="bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white px-12 py-4 rounded-2xl font-bold text-xl transition-all duration-300 hover:scale-110 transform"
            >
              Sign In
            </Button>
          </div>
        </div>

        {/* Enhanced Image Carousel */}
        <div className="relative mb-16 w-full px-4">
          <div className="relative w-full h-[350px] md:h-[450px] rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/20 border-2 border-blue-500/20">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`OLOF Alumni ${index + 1}`}
                className={`w-full h-full object-cover absolute transition-all duration-1000 ${
                  index === currentImageIndex ? "opacity-100 scale-100" : "opacity-0 scale-105"
                }`}
                style={{ objectPosition: 'center' }}
              />
            ))}
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none"></div>
          </div>
          
          {/* Enhanced Carousel Indicators */}
          <div className="flex justify-center mt-6 space-x-3">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  index === currentImageIndex 
                    ? "bg-blue-500 opacity-100 scale-125 shadow-lg shadow-blue-500/50" 
                    : "bg-gray-400 opacity-60 hover:opacity-80"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <div className="grid md:grid-cols-2 gap-10 mb-16 max-w-6xl mx-auto">
          <div className="bg-black/40 backdrop-blur-lg p-10 rounded-3xl border-2 border-blue-500/20 shadow-2xl shadow-blue-500/10 hover:shadow-blue-500/20 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">Get Started Today</h3>
            <ul className="space-y-4 text-gray-200 mb-8">
              <li className="flex items-start space-x-4">
                <span className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-blue-500/50"></span>
                <span className="text-lg">Register or login to access exclusive content and features</span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-green-500/50"></span>
                <span className="text-lg">Update your profile and connect with fellow alumni</span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-purple-500/50"></span>
                <span className="text-lg">Join social groups and stay updated on news and events</span>
              </li>
            </ul>
            <div className="space-y-4">
              <Button 
                onClick={() => setLocation("/register")}
                className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-500/30 transition-all duration-300 hover:scale-105"
              >
                Register Now
              </Button>
              <Button 
                onClick={() => setLocation("/login")}
                className="w-full bg-transparent border-2 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105"
              >
                Sign In
              </Button>
            </div>
          </div>

          <div className="bg-black/40 backdrop-blur-lg p-10 rounded-3xl border-2 border-green-500/20 shadow-2xl shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.02]">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-6">Connect & Engage</h3>
            <ul className="space-y-4 text-gray-200">
              <li className="flex items-start space-x-4">
                <span className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-blue-500/50"></span>
                <span className="text-lg">Reconnect with old friends and classmates</span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="w-3 h-3 bg-green-500 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-green-500/50"></span>
                <span className="text-lg">Stay informed about school news and achievements</span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="w-3 h-3 bg-yellow-500 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-yellow-500/50"></span>
                <span className="text-lg">Join discussions and share experiences</span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="w-3 h-3 bg-red-500 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-red-500/50"></span>
                <span className="text-lg">Participate in mentorship programs</span>
              </li>
              <li className="flex items-start space-x-4">
                <span className="w-3 h-3 bg-purple-500 rounded-full mt-2 flex-shrink-0 shadow-lg shadow-purple-500/50"></span>
                <span className="text-lg">Showcase achievements and success stories</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Enhanced Final Message */}
        <div className="text-center bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-green-600/20 backdrop-blur-lg p-12 rounded-3xl border-2 border-blue-500/20 shadow-2xl shadow-blue-500/20 max-w-5xl mx-auto">
          <h3 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent mb-6">We're Glad You're Here!</h3>
          <p className="text-2xl text-gray-200 leading-relaxed mb-6">
            Join our vibrant community of alumni and be part of something amazing
          </p>
          <p className="text-xl text-gray-300 font-light">
            Network • Connect • Grow • Succeed
          </p>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="relative z-10 bg-black/30 backdrop-blur-lg border-t border-blue-500/20 mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-300 text-lg font-light">
            POWERED BY PASCAL ERICK (2023 G-CLAN) | Hosted at johnreeselegacies.tech:3000
          </p>
        </div>
      </footer>
    </div>
  );
}
