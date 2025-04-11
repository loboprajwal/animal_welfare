import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const AuthPage = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: ""
  });
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    email: "",
    name: "",
    phone: "",
    role: "user",
    address: ""
  });
  const [, navigate] = useLocation();

  useEffect(() => {
    document.title = "Sign In / Register - AnimalSOS";
  }, []);

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateLoginForm = () => {
    setErrorMessage("");
    if (loginForm.username.length < 3) {
      setErrorMessage("Username must be at least 3 characters");
      return false;
    }
    if (loginForm.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const validateRegisterForm = () => {
    setErrorMessage("");
    if (registerForm.username.length < 3) {
      setErrorMessage("Username must be at least 3 characters");
      return false;
    }
    if (registerForm.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      return false;
    }
    if (!registerForm.email.includes("@")) {
      setErrorMessage("Please enter a valid email");
      return false;
    }
    if (registerForm.name.length < 2) {
      setErrorMessage("Name must be at least 2 characters");
      return false;
    }
    if (registerForm.role === "ngo" && (!registerForm.address || registerForm.address.trim() === "")) {
      setErrorMessage("Address is required for NGO/Rescue Organization accounts");
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    if (!validateLoginForm()) return;
    
    try {
      setIsLoggingIn(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(loginForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Invalid username or password");
      }
      
      const user = await response.json();
      setSuccessMessage(`Welcome back, ${user.name}!`);
      
      // Redirect based on role
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message || "Login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (!validateRegisterForm()) return;
    
    try {
      setIsRegistering(true);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(registerForm)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      
      const user = await response.json();
      
      let welcomeMessage = "Welcome to AnimalSOS";
      if (registerForm.role === "user") {
        welcomeMessage = `Welcome to AnimalSOS, ${user.name}! You can now report animals in need and find veterinary help.`;
      } else if (registerForm.role === "ngo") {
        welcomeMessage = `Welcome to AnimalSOS, ${user.name}! Your organization can now respond to animal rescue requests.`;
      } else if (registerForm.role === "admin") {
        welcomeMessage = `Welcome to AnimalSOS, ${user.name}! You have full administrative access.`;
      }
      
      setSuccessMessage(welcomeMessage);
      
      // Redirect based on user role
      if (user.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setErrorMessage(error.message || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f9fafb",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "48px 24px"
    }}>
      <div style={{
        maxWidth: "400px",
        marginLeft: "auto",
        marginRight: "auto",
        marginBottom: "20px",
        textAlign: "center"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <span style={{
            fontSize: "40px",
            marginRight: "8px"
          }}>🐕</span>
          <h1 style={{
            fontWeight: "bold",
            fontSize: "24px",
            color: "#1f2937"
          }}>
            Animal<span style={{ color: "#4A90E2" }}>SOS</span>
          </h1>
        </div>
        <h2 style={{
          marginTop: "8px",
          textAlign: "center",
          fontSize: "24px",
          fontWeight: "bold",
          color: "#1f2937"
        }}>
          {activeTab === "login" ? "Sign in to your account" : "Create a new account"}
        </h2>
      </div>

      <div style={{
        maxWidth: "400px",
        marginLeft: "auto",
        marginRight: "auto"
      }}>
        {/* Auth Form */}
        <div style={{
          backgroundColor: "white",
          padding: "32px 24px",
          boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
          borderRadius: "8px"
        }}>
          {/* Tabs */}
          <div style={{
            display: "flex",
            marginBottom: "24px",
            borderBottom: "1px solid #e5e7eb"
          }}>
            <button
              onClick={() => setActiveTab("login")}
              style={{
                flex: 1,
                padding: "12px",
                textAlign: "center",
                fontWeight: activeTab === "login" ? "bold" : "normal",
                borderBottom: activeTab === "login" ? "2px solid #4A90E2" : "none",
                color: activeTab === "login" ? "#4A90E2" : "#6b7280",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer"
              }}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              style={{
                flex: 1,
                padding: "12px",
                textAlign: "center",
                fontWeight: activeTab === "register" ? "bold" : "normal",
                borderBottom: activeTab === "register" ? "2px solid #4A90E2" : "none",
                color: activeTab === "register" ? "#4A90E2" : "#6b7280",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer"
              }}
            >
              Register
            </button>
          </div>

          {errorMessage && (
            <div style={{
              padding: "12px",
              backgroundColor: "#FEF2F2",
              color: "#B91C1C",
              borderRadius: "4px",
              marginBottom: "16px"
            }}>
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div style={{
              padding: "12px",
              backgroundColor: "#ECFDF5",
              color: "#047857",
              borderRadius: "4px",
              marginBottom: "16px"
            }}>
              {successMessage}
            </div>
          )}

          {/* Login Form */}
          {activeTab === "login" && (
            <form onSubmit={handleLoginSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#374151"
                }}>
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af"
                  }}>
                    👤
                  </span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Enter your username"
                    value={loginForm.username}
                    onChange={handleLoginChange}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 36px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#374151"
                }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af"
                  }}>
                    🔒
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Enter your password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 36px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "16px"
              }}>
                <div style={{
                  display: "flex",
                  alignItems: "center"
                }}>
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    style={{
                      height: "16px",
                      width: "16px",
                      color: "#4A90E2",
                      borderColor: "#d1d5db",
                      borderRadius: "4px"
                    }}
                  />
                  <label htmlFor="remember-me" style={{
                    marginLeft: "8px",
                    fontSize: "14px",
                    color: "#4b5563"
                  }}>
                    Remember me
                  </label>
                </div>

                <a href="#" style={{
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#4A90E2",
                  textDecoration: "none"
                }}>
                  Forgot password?
                </a>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#4A90E2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "medium",
                  cursor: isLoggingIn ? "not-allowed" : "pointer",
                  opacity: isLoggingIn ? 0.7 : 1
                }}
              >
                {isLoggingIn ? "Signing in..." : "Sign in"}
              </button>
            </form>
          )}

          {/* Register Form */}
          {activeTab === "register" && (
            <form onSubmit={handleRegisterSubmit}>
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#374151"
                }}>
                  Full Name
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af"
                  }}>
                    👤
                  </span>
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 36px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#374151"
                }}>
                  Email Address
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af"
                  }}>
                    ✉️
                  </span>
                  <input
                    type="email"
                    name="email"
                    placeholder="Enter your email"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 36px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#374151"
                }}>
                  Username
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af"
                  }}>
                    👤
                  </span>
                  <input
                    type="text"
                    name="username"
                    placeholder="Choose a username"
                    value={registerForm.username}
                    onChange={handleRegisterChange}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 36px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#374151"
                }}>
                  Password
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af"
                  }}>
                    🔒
                  </span>
                  <input
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 36px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#374151"
                }}>
                  Phone Number (Optional)
                </label>
                <div style={{ position: "relative" }}>
                  <span style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9ca3af"
                  }}>
                    📞
                  </span>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    style={{
                      width: "100%",
                      padding: "10px 10px 10px 36px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                  />
                </div>
              </div>
              
              <div style={{ marginBottom: "16px" }}>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontSize: "14px",
                  fontWeight: "medium",
                  color: "#374151"
                }}>
                  Account Type
                </label>
                <select
                  name="role"
                  value={registerForm.role}
                  onChange={handleRegisterChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white"
                  }}
                >
                  <option value="user">Individual User</option>
                  <option value="ngo">NGO/Rescue Organization</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              {registerForm.role === "ngo" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{
                    display: "block",
                    marginBottom: "8px",
                    fontSize: "14px",
                    fontWeight: "medium",
                    color: "#374151"
                  }}>
                    Organization Address*
                  </label>
                  <div style={{ position: "relative" }}>
                    <span style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#9ca3af"
                    }}>
                      📍
                    </span>
                    <input
                      type="text"
                      name="address"
                      placeholder="Enter organization address"
                      value={registerForm.address}
                      onChange={handleRegisterChange}
                      style={{
                        width: "100%",
                        padding: "10px 10px 10px 36px",
                        borderRadius: "4px",
                        border: "1px solid #d1d5db"
                      }}
                      required={registerForm.role === "ngo"}
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={isRegistering}
                style={{
                  width: "100%",
                  padding: "10px",
                  backgroundColor: "#4A90E2",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "medium",
                  cursor: isRegistering ? "not-allowed" : "pointer",
                  opacity: isRegistering ? 0.7 : 1
                }}
              >
                {isRegistering ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;