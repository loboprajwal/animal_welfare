import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { ProtectedRoute } from "./lib/protected-route";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ReportPage from "@/pages/report-page";
import VetFinderPage from "@/pages/vet-finder-page";
import AdoptionPage from "@/pages/adoption-page";
import DonationPage from "@/pages/donation-page";
import CommunityPage from "@/pages/community-page";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/report" component={ReportPage} />
      <Route path="/veterinarians" component={VetFinderPage} />
      <Route path="/adoption" component={AdoptionPage} />
      <Route path="/donate" component={DonationPage} />
      <Route path="/community" component={CommunityPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
