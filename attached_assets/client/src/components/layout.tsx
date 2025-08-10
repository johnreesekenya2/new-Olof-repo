import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { SocketProvider } from "@/hooks/use-socket";
import { useLocation } from "wouter";
import { 
  Home, 
  Database, 
  Mail, 
  Bell, 
  Image, 
  User, 
  LogOut,
  GraduationCap,
  Menu,
  X,
  Flag,
  MessageCircle,
  Info,
  Award,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { logout } = useAuth();
  const [location, setLocation] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { path: "/home", icon: Home, title: "Home" },
    { path: "/database", icon: Database, title: "Database" },
    { path: "/inbox", icon: Mail, title: "Inbox" },
    { path: "/notifications", icon: Bell, title: "Notifications" },
    { path: "/gallery", icon: Image, title: "Gallery" },
    { path: "/profile", icon: User, title: "My Profile" },
  ];

  const menuItems = [
    { path: "/report", icon: Flag, title: "Report User" },
    { path: "/feedback", icon: MessageCircle, title: "Feedback" },
    { path: "/about", icon: Info, title: "About" },
    { path: "/credits", icon: Award, title: "Credits" },
  ];

  return (
    <SocketProvider>
      <div className="min-h-screen bg-dark-bg">
        {/* Header Section */}
        <header className="bg-dark-card border-b border-dark-border fixed top-0 left-0 right-0 z-40">
          {/* Top Header with Title */}
          <div className="bg-gradient-to-r from-primary-blue to-success-green py-3">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-center">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <GraduationCap className="text-white" size={18} />
                </div>
                <h1 className="text-xl font-bold text-white tracking-wide">OLOF ALUMNI</h1>
              </div>
            </div>
          </div>
          
          {/* Navigation Bar */}
          <div className="bg-dark-card py-3">
            <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
              {/* Navigation Icons */}
              <div className="flex items-center space-x-8 flex-1 justify-center">
                {navItems.map(({ path, icon: Icon, title }) => (
                  <button
                    key={path}
                    onClick={() => setLocation(path)}
                    className={`flex flex-col items-center space-y-1 transition-colors p-2 rounded-lg ${
                      location === path 
                        ? "text-primary-blue bg-primary-blue/10" 
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                    title={title}
                  >
                    <Icon size={22} />
                    <span className="text-xs font-medium">{title}</span>
                  </button>
                ))}
              </div>
              
              {/* Right Side Menu */}
              <div className="flex items-center space-x-2">
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-gray-400 hover:text-white hover:bg-gray-700/50 p-2 border border-gray-600"
                    >
                      <Menu size={20} />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80 bg-dark-card border-dark-border text-white">
                    <SheetHeader className="border-b border-dark-border pb-4">
                      <SheetTitle className="text-white flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary-blue to-success-green rounded-full flex items-center justify-center">
                          <GraduationCap className="text-white" size={20} />
                        </div>
                        <div>
                          <div className="text-lg font-bold">OLOF Menu</div>
                          <div className="text-sm text-gray-400 font-normal">Settings & More</div>
                        </div>
                      </SheetTitle>
                    </SheetHeader>
                    
                    <div className="mt-6 space-y-3">
                      <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-3">
                        Quick Actions
                      </div>
                      
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-white hover:bg-gray-700/50 p-3 h-auto mb-3"
                        onClick={() => {
                          setLocation('/profile');
                          setSidebarOpen(false);
                        }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary-blue rounded-lg flex items-center justify-center">
                            <User size={16} />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">My Profile</div>
                            <div className="text-xs text-gray-400">View and edit your profile</div>
                          </div>
                        </div>
                      </Button>
                      
                      {menuItems.map(({ path, icon: Icon, title }) => (
                        <Button
                          key={path}
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-gray-700/50 p-3 h-auto"
                          onClick={() => {
                            setLocation(path);
                            setSidebarOpen(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                              <Icon size={16} />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">{title}</div>
                              <div className="text-xs text-gray-400">
                                {title === "Report User" && "Report inappropriate behavior"}
                                {title === "Feedback" && "Share your thoughts with us"}
                                {title === "About" && "Learn more about OLOF"}
                                {title === "Credits" && "Meet the development team"}
                              </div>
                            </div>
                          </div>
                        </Button>
                      ))}
                      
                      <div className="border-t border-dark-border pt-4 mt-6">
                        <div className="text-sm text-gray-400 uppercase tracking-wider font-semibold mb-3">
                          Account
                        </div>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-white hover:bg-gray-700/50 p-3 h-auto mb-2"
                          onClick={() => {
                            setLocation('/settings');
                            setSidebarOpen(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                              <Settings size={16} />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">Settings</div>
                              <div className="text-xs text-gray-400">Manage your account</div>
                            </div>
                          </div>
                        </Button>
                        
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-red-400 hover:text-red-300 hover:bg-red-500/10 p-3 h-auto"
                          onClick={() => {
                            logout();
                            setSidebarOpen(false);
                          }}
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                              <LogOut size={16} />
                            </div>
                            <div className="text-left">
                              <div className="font-medium">Logout</div>
                              <div className="text-xs text-red-300/70">Sign out of your account</div>
                            </div>
                          </div>
                        </Button>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="pt-32 min-h-screen">
          {children}
        </div>

        {/* Footer */}
        <footer className="bg-dark-card border-t border-dark-border py-6">
          <div className="max-w-6xl mx-auto px-4 text-center">
            <p className="text-gray-400 text-sm">
              POWERED BY PASCAL ERICK (2023 G-CLAN) | Hosted at johnreeselegacies.tech:3000
            </p>
          </div>
        </footer>
      </div>
    </SocketProvider>
  );
}
