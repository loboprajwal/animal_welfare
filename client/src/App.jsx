import { Switch, Route, useLocation } from "wouter";
import { useState, useEffect } from "react";
import HomePage from "./pages/home-page";
import AuthPage from "./pages/auth-page";
import ReportAnimal from "./pages/report-animal";
import Adoption from "./pages/adoption";
import VetFinder from "./pages/find-vets";
import AdminDashboard from "./pages/admin-dashboard";
import NGODashboard from "./pages/ngo-dashboard";
import NotFound from "./pages/not-found";

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [location, setLocation] = useLocation();

  // Check if user is logged in
  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await fetch('/api/user');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    checkAuth();
  }, []);

  // Redirect to login if not authenticated
  useEffect(() => {
    const protectedRoutes = ['/report-animal', '/find-vets', '/adopt', '/admin', '/ngo-dashboard'];
    
    if (!isLoading && !user && protectedRoutes.includes(location)) {
      setLocation('/auth');
    }
    
    // Redirect users based on role after login
    if (!isLoading && user && location === '/') {
      if (user.role === 'admin') {
        setLocation('/admin');
      } else if (user.role === 'ngo') {
        setLocation('/ngo-dashboard');
      }
    }
  }, [user, isLoading, location, setLocation]);

  return (
    <div style={{
      display: "flex", 
      flexDirection: "column", 
      minHeight: "100vh",
      backgroundColor: "#E8F5E9" // Light green background
    }}>
      {user && (
        <header style={{
          backgroundColor: "#4CAF50",
          padding: "10px 20px",
          color: "white"
        }}>
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "1200px",
            margin: "0 auto"
          }}>
            <div style={{
              display: "flex",
              alignItems: "center"
            }}>
              <span style={{ fontSize: "24px", marginRight: "10px" }}>🐕</span>
              <h1 style={{ fontSize: "20px", fontWeight: "bold" }}>
                Animal<span style={{ color: "#81C784" }}>SOS</span>
              </h1>
            </div>
            <div style={{
              display: "flex",
              gap: "15px"
            }}>
              {user.role === 'user' && (
                <>
                  <a href="/" style={{ color: "white", textDecoration: "none" }}>Home</a>
                  <a href="/report-animal" style={{ color: "white", textDecoration: "none" }}>Report Animal</a>
                  <a href="/find-vets" style={{ color: "white", textDecoration: "none" }}>Find Vet</a>
                </>
              )}
              
              {user.role === 'ngo' && (
                <>
                  <a href="/ngo-dashboard" style={{ color: "white", textDecoration: "none" }}>Dashboard</a>
                  <a href="/find-vets" style={{ color: "white", textDecoration: "none" }}>Find Vet</a>
                </>
              )}
              
              {user.role === 'admin' && (
                <a href="/admin" style={{ color: "white", textDecoration: "none" }}>Admin Dashboard</a>
              )}
              
              <button 
                onClick={async () => {
                  await fetch('/api/logout', {method: 'POST'});
                  setUser(null);
                  setLocation('/auth');
                }}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  textDecoration: "underline"
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </header>
      )}
      <main style={{flex: 1}}>
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/auth">
            {() => user ? (
              user.role === 'admin' ? 
                <AdminDashboard user={user} /> : 
                user.role === 'ngo' ? 
                  <NGODashboard user={user} /> : 
                  <HomePage />
            ) : <AuthPage />}
          </Route>
          <Route path="/report-animal">
            {() => user ? <ReportAnimal user={user} /> : <AuthPage />}
          </Route>
          <Route path="/adopt">
            {() => user ? <Adoption user={user} /> : <AuthPage />}
          </Route>
          <Route path="/find-vets">
            {() => user ? <VetFinder user={user} /> : <AuthPage />}
          </Route>
          <Route path="/ngo-dashboard">
            {() => (user && user.role === 'ngo') ? <NGODashboard user={user} /> : <AuthPage />}
          </Route>
          <Route path="/admin">
            {() => (user && user.role === 'admin') ? <AdminDashboard user={user} /> : <AuthPage />}
          </Route>
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

export default App;