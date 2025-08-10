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
    <div className="fixed inset-0 bg-dark-bg z-50 flex items-center justify-center">
      <div className="text-center">
        <div className="relative mb-8">
          <div className="w-24 h-24 border-4 border-gray-600 border-t-primary-blue rounded-full animate-spin-slow mx-auto"></div>
          <div className="w-16 h-16 border-4 border-gray-700 border-r-success-green rounded-full animate-spin absolute top-4 left-1/2 transform -translate-x-1/2"></div>
        </div>
        
        <div className="space-y-3">
          <h2 className="text-2xl font-bold text-white">OLOF ALUMNI</h2>
          <div className="text-gray-300 text-lg font-medium h-6">
            {loaderTexts[textIndex]}
          </div>
          
          <div className="w-64 bg-gray-700 rounded-full h-2 mx-auto">
            <div 
              className="bg-gradient-to-r from-primary-blue to-success-green h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="flex justify-center space-x-2 mt-4">
            <div className="w-3 h-3 bg-primary-blue rounded-full animate-pulse"></div>
            <div className="w-3 h-3 bg-success-green rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
