import { Switch, Route } from "wouter";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

import HomePage from "@/pages/home-page";
import AuthPage from "@/pages/auth-page";
import ReportAnimal from "@/pages/report-animal";
import Adoption from "@/pages/adoption";
import Community from "@/pages/community";
import AdminDashboard from "@/pages/admin-dashboard";
import NotFound from "@/pages/not-found";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/report-animal" component={ReportAnimal} />
      <Route path="/adopt" component={Adoption} />
      <ProtectedRoute path="/community" component={Community} />
      <ProtectedRoute path="/admin" component={AdminDashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <Router />
      </main>
      <Footer />
    </div>
  );
}

export default App;
