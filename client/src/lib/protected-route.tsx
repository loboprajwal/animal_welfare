import { Loader2 } from "lucide-react";
import { Route, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useEffect } from "react";

export function ProtectedRoute({
  path,
  component: Component,
  roleRequired,
}: {
  path: string;
  component: () => React.JSX.Element | null;
  roleRequired?: 'user' | 'ngo' | 'admin';
}) {
  // Use the auth context directly
  const auth = useAuth();
  const { user, isLoading } = auth;
  const [, setLocation] = useLocation();

  useEffect(() => {
    // If finished loading and no user, redirect to auth page
    if (!isLoading && !user) {
      setLocation('/auth');
      return;
    }

    // If a specific role is required and user doesn't have it, redirect
    if (!isLoading && user && roleRequired && user.role !== roleRequired) {
      // Redirect based on role
      if (user.role === 'admin') {
        setLocation('/admin');
      } else if (user.role === 'ngo') {
        setLocation('/');
      } else {
        setLocation('/');
      }
    }
  }, [user, isLoading, roleRequired, setLocation]);

  // Render a loading state while checking authentication
  if (isLoading) {
    return (
      <div className="h-screen w-full flex justify-center items-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If user is authenticated and has the required role (if specified), render the component
  if (user && (!roleRequired || user.role === roleRequired)) {
    return <Route path={path} component={Component} />;
  }

  // This placeholder ensures the Route is always rendered with a component
  // The actual redirection is handled in the useEffect
  return <Route path={path} component={() => <div></div>} />;
}
