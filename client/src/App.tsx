import { Switch, Route, useLocation } from "wouter";
import Navbar from "@/components/layout/navbar";
import { useAuth } from "./hooks/use-auth";
import { createContext, useContext, useEffect } from "react";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ReportAnimal from "@/pages/report-animal";
import Adoption from "@/pages/adoption";
import VetFinder from "@/pages/find-vets";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";

// Create a context for authentication status
const AuthRouterContext = createContext<{user: any | null; isLoading: boolean}>({
  user: null,
  isLoading: false
});

// Use this context instead of direct useAuth to avoid circular dependency
export const useAuthRouter = () => useContext(AuthRouterContext);

function Router() {
  // Get auth state from parent component
  const { user, isLoading } = useAuthRouter();
  const [location, setLocation] = useLocation();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!isLoading && !user && location !== '/auth') {
      setLocation('/auth');
    }
  }, [user, isLoading, location, setLocation]);

  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/report-animal" component={ReportAnimal} />
      <ProtectedRoute path="/adopt" component={Adoption} />
      <ProtectedRoute path="/find-vets" component={VetFinder} />
      <ProtectedRoute path="/admin" component={AdminDashboard} roleRequired="admin" />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  let authState = { user: null, isLoading: true };
  
  try {
    // Try to get auth state, but don't throw if it fails
    const { user, isLoading } = useAuth();
    authState = { user, isLoading };
  } catch (error) {
    console.log("Auth context not available yet, using fallback");
  }

  return (
    <div className="flex flex-col min-h-screen">
      {authState.user && <Navbar />}
      <main className={`flex-1 ${!authState.user ? 'bg-gray-50' : ''}`}>
        <AuthRouterContext.Provider value={authState}>
          <Router />
        </AuthRouterContext.Provider>
      </main>
    </div>
  );
}

export default App;
