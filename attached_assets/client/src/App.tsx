import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/use-auth";
import { SocketProvider } from "@/hooks/use-socket";
import { useState, useEffect, lazy } from "react";

import Welcome from "@/pages/welcome";
import Login from "@/pages/login";
import Register from "@/pages/register";
import Verify from "@/pages/verify";
import ProfileSetup from "@/pages/profile-setup";
import Home from "@/pages/home";
import Database from "@/pages/database";
import Inbox from "@/pages/inbox";
import Notifications from "@/pages/notifications";
import Gallery from "@/pages/gallery";
import Chat from "@/pages/chat";
import Profile from "@/pages/profile";
import Report from "@/pages/report";
import Feedback from "@/pages/feedback";
import About from "@/pages/about";
import Credits from "@/pages/credits";
import NotFound from "@/pages/not-found";

import Layout from "@/components/layout";
import Loader from "@/components/loader";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Welcome} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/verify" component={Verify} />
      <Route path="/profile-setup" component={ProfileSetup} />

      {/* Protected routes with layout */}
      <Route path="/home">
        <Layout>
          <Home />
        </Layout>
      </Route>
      <Route path="/database">
        <Layout>
          <Database />
        </Layout>
      </Route>
      <Route path="/inbox">
        <Layout>
          <Inbox />
        </Layout>
      </Route>
      <Route path="/notifications">
        <Layout>
          <Notifications />
        </Layout>
      </Route>
      <Route path="/gallery">
        <Layout>
          <Gallery />
        </Layout>
      </Route>
      <Route path="/chat/:id">
        <Layout>
          <Chat />
        </Layout>
      </Route>
      <Route path="/profile">
        <Layout>
          <Profile />
        </Layout>
      </Route>
      <Route path="/report">
        <Layout>
          <Report />
        </Layout>
      </Route>
      <Route path="/feedback">
        <Layout>
          <Feedback />
        </Layout>
      </Route>
      <Route path="/about">
        <Layout>
          <About />
        </Layout>
      </Route>
      <Route path="/credits" component={Credits} />
      <Route path="/settings" component={lazy(() => import("@/pages/settings"))} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial load time
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loader onComplete={() => setIsLoading(false)} />;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen bg-dark-bg text-foreground">
            <Router />
            <Toaster />
          </div>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;