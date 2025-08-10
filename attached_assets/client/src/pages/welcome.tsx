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
  const [showLoader, setShowLoader] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [, setLocation] = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      setLocation("/home");
    }
  }, [isAuthenticated, setLocation]);

  useEffect(() => {
    if (!showLoader) {
      const interval = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [showLoader]);

  if (showLoader) {
    return <Loader onComplete={() => setShowLoader(false)} />;
  }

  return (
    <div className="min-h-screen bg-dark-bg animate-fade-in">
      {/* Header */}
      <header className="bg-dark-card border-b border-dark-border p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center">
              <GraduationCap className="text-white" size={20} />
            </div>
            <h1 className="text-2xl font-bold text-white">OLOF ALUMNI</h1>
          </div>
          <div className="hidden md:flex space-x-4">
            <Button 
              onClick={() => setLocation("/login")}
              variant="outline"
              className="border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
            >
              Login
            </Button>
            <Button 
              onClick={() => setLocation("/register")}
              className="bg-success-green hover:bg-success-green/80 text-white"
            >
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Welcome Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-up">
            Welcome to the Our Lady of Fatima Secondary School Alumni Community!
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed animate-slide-up">
            We're thrilled to have you join us! This platform is designed to connect you with fellow alumni, 
            stay updated on school news, and get involved in various activities that support our alma mater and community.
          </p>
        </div>

        {/* Image Carousel */}
        <div className="relative mb-12 max-w-4xl mx-auto">
          <div className="relative h-96 bg-dark-card rounded-xl overflow-hidden shadow-2xl">
            {images.map((src, index) => (
              <img
                key={index}
                src={src}
                alt={`OLOF Alumni ${index + 1}`}
                className={`w-full h-full object-cover absolute transition-opacity duration-1000 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
          </div>
          
          {/* Carousel Indicators */}
          <div className="flex justify-center mt-4 space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentImageIndex 
                    ? "bg-primary-blue opacity-100" 
                    : "bg-gray-500 opacity-50"
                }`}
                onClick={() => setCurrentImageIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Get Started Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-dark-card p-8 rounded-xl border border-dark-border animate-slide-up">
            <h3 className="text-2xl font-bold text-white mb-4">Get started today:</h3>
            <ul className="space-y-3 text-gray-300 mb-6">
              <li className="flex items-start space-x-3">
                <span className="text-primary-blue">•</span>
                <span>Register or login to access exclusive content and features</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-success-green">•</span>
                <span>Update your profile and connect with fellow alumni</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-yellow-500">•</span>
                <span>Join our social media groups to stay up-to-date on the latest news and events</span>
              </li>
            </ul>
            <div className="space-y-3">
              <Button 
                onClick={() => setLocation("/register")}
                className="w-full bg-success-green hover:bg-success-green/80 text-white"
              >
                Register Now
              </Button>
              <Button 
                onClick={() => setLocation("/login")}
                variant="outline"
                className="w-full border-primary-blue text-primary-blue hover:bg-primary-blue hover:text-white"
              >
                Login
              </Button>
            </div>
          </div>

          <div className="bg-dark-card p-8 rounded-xl border border-dark-border animate-slide-up">
            <h3 className="text-2xl font-bold text-white mb-4">Here, you can:</h3>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start space-x-3">
                <span className="text-primary-blue">•</span>
                <span>Reconnect with old friends and classmates</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-success-green">•</span>
                <span>Stay informed about school news, events, and achievements</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-yellow-500">•</span>
                <span>Join discussions and share your experiences</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-red-500">•</span>
                <span>Get involved in mentorship programs and volunteer opportunities</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-purple-500">•</span>
                <span>Showcase your achievements and share your success stories</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Final Welcome Message */}
        <div className="text-center bg-gradient-to-r from-primary-blue to-success-green p-8 rounded-xl text-white animate-slide-up">
          <h3 className="text-3xl font-bold mb-4">We're glad you're here!</h3>
          <p className="text-xl leading-relaxed mb-4">
            Whether you're looking to network, give back, or simply stay connected, we invite you to explore our site, 
            join our community, and be a part of the Our Lady of Fatima Secondary School family.
          </p>
          <p className="text-lg font-semibold">
            We look forward to hearing from you and seeing you at our events!
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-dark-card border-t border-dark-border mt-16 py-6">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            POWERED BY PASCAL ERICK (2023 G-CLAN) | Hosted at johnreeselegacies.tech:3000
          </p>
        </div>
      </footer>
    </div>
  );
}
