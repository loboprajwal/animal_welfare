import { Switch, Route } from "wouter";
import HomePage from "./pages/home-page";
import AuthPage from "./pages/auth-page";
import ReportAnimal from "./pages/report-animal";
import Adoption from "./pages/adoption";
import VetFinder from "./pages/find-vets";
import AdminDashboard from "./pages/admin-dashboard";
import NotFound from "./pages/not-found";

function App() {
  return (
    <div style={{
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh"
    }}>
      <main style={{flex: 1, backgroundColor: "#f9fafb"}}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth" component={AuthPage} />
          <Route path="/report-animal" component={ReportAnimal} />
          <Route path="/adopt" component={Adoption} />
          <Route path="/find-vets" component={VetFinder} />
          <Route path="/admin" component={AdminDashboard} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default App;