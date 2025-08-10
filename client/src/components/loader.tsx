import { useEffect, useState } from "react";

interface LoaderProps {
  onComplete: () => void;
}

const loaderTexts = [
  "Initializing connection...",
  "Connecting to OLOF servers...",
  "Loading alumni database...",
  "Preparing your experience...",
  "Almost ready..."
];

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [textIndex, setTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + (100/7); // 7 seconds total
        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 500);
          return 100;
        }
        return newProgress;
      });
      
      setTextIndex(prev => (prev + 1) % loaderTexts.length);
    }, 1000);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-dark-bg via-gray-900 to-dark-bg z-50 flex items-center justify-center">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-primary-blue/10 rounded-full animate-float blur-3xl"></div>
        <div className="absolute top-20 -right-10 w-96 h-96 bg-success-green/10 rounded-full animate-float blur-3xl" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-10 left-1/2 w-80 h-80 bg-purple-500/10 rounded-full animate-float blur-3xl" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative text-center z-10">
        {/* Animated Logo */}
        <div className="relative mb-8">
          <div className="w-32 h-32 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center mx-auto animate-glow-pulse">
            <div className="w-24 h-24 bg-dark-bg rounded-full flex items-center justify-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-primary-blue to-success-green bg-clip-text text-transparent">
                O
              </div>
            </div>
          </div>
          <div className="absolute inset-0 w-32 h-32 border-4 border-transparent border-t-primary-blue border-r-success-green rounded-full animate-spin-slow mx-auto"></div>
        </div>
        
        <div className="space-y-6">
          <div className="animate-float">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent mb-2">
              OLOF ALUMNI
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-primary-blue to-success-green mx-auto rounded-full animate-shimmer"></div>
          </div>
          
          <div className="text-gray-300 text-xl font-medium h-8 animate-slide-up">
            {loaderTexts[textIndex]}
          </div>
          
          {/* Enhanced Progress Bar */}
          <div className="w-80 bg-gray-800/50 rounded-full h-3 mx-auto border border-gray-700/50 backdrop-blur-sm">
            <div 
              className="bg-gradient-to-r from-primary-blue via-purple-500 to-success-green h-3 rounded-full transition-all duration-500 relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>
            </div>
          </div>
          
          {/* Progress Percentage */}
          <div className="text-primary-blue text-lg font-bold">
            {Math.round(progress)}%
          </div>
          
          {/* Animated Dots */}
          <div className="flex justify-center space-x-3 mt-6">
            <div className="w-4 h-4 bg-primary-blue rounded-full animate-pulse shadow-lg shadow-primary-blue/50"></div>
            <div className="w-4 h-4 bg-success-green rounded-full animate-pulse shadow-lg shadow-success-green/50" style={{ animationDelay: '0.3s' }}></div>
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse shadow-lg shadow-purple-500/50" style={{ animationDelay: '0.6s' }}></div>
            <div className="w-4 h-4 bg-yellow-500 rounded-full animate-pulse shadow-lg shadow-yellow-500/50" style={{ animationDelay: '0.9s' }}></div>
          </div>

          {/* Loading Text */}
          <div className="text-gray-500 text-sm animate-pulse mt-4">
            Connecting you to the future of education...
          </div>
        </div>
      </div>
    </div>
  );
}
