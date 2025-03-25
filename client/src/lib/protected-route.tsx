import { Loader2 } from "lucide-react";
import { Route } from "wouter";

// Temporarily using a simplified version of ProtectedRoute
// until authentication is fully implemented
export function ProtectedRoute({
  path,
  component: Component,
}: {
  path: string;
  component: () => React.JSX.Element;
}) {
  // For now, just render the component without protection
  return <Route path={path} component={Component} />;
}
