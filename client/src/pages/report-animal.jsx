import { useState, useEffect } from "react";
import { useLocation } from "wouter";

const ReportAnimal = ({ user }) => {
  const [, navigate] = useLocation();
  const [formData, setFormData] = useState({
    animalType: "",
    description: "",
    location: "",
    urgency: "normal",
    imageUrl: "",
    userId: user?.id || 1,
    latitude: "",
    longitude: "",
    status: "pending",
  });
  
  // Theme colors
  const colors = {
    primary: "#4CAF50",
    primaryDark: "#388E3C",
    primaryLight: "#81C784",
    background: "#E8F5E9"
  };
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    document.title = "Report an Animal - AnimalSOS";
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewImage(objectUrl);
      setFormData(prev => ({
        ...prev,
        imageUrl: `image_${Date.now()}.jpg`
      }));
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData(prev => ({
            ...prev,
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          }));
          alert("Location detected! Your current location has been added to the report.");
        },
        (error) => {
          alert("Could not detect your location. Please enter it manually.");
        }
      );
    } else {
      alert("Your browser doesn't support geolocation. Please enter location manually.");
    }
  };

  const validateForm = () => {
    if (!formData.animalType) {
      setErrorMessage("Please select an animal type");
      return false;
    }
    if (formData.description.length < 10) {
      setErrorMessage("Description must be at least 10 characters");
      return false;
    }
    if (formData.location.length < 5) {
      setErrorMessage("Please provide a specific location");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage("");
    
    try {
      const response = await fetch("/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error("Failed to submit report");
      }
      
      alert("Thank you for helping animals in need. We will process your report soon.");
      navigate("/");
    } catch (error) {
      setErrorMessage(error.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{
      maxWidth: "800px",
      margin: "0 auto",
      padding: "48px 16px"
    }}>
      <div style={{
        marginBottom: "32px",
        textAlign: "center"
      }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "8px",
          color: "#333"
        }}>Report an Animal in Need</h1>
        <p style={{
          color: "#666"
        }}>
          Help us locate and rescue animals by providing detailed information below
        </p>
      </div>

      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          backgroundColor: "rgba(76, 175, 80, 0.1)",
          borderBottom: "1px solid #e5e7eb",
          padding: "20px"
        }}>
          <h2 style={{
            display: "flex",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333"
          }}>
            Animal Report Form
          </h2>
          <p style={{
            color: "#666",
            fontSize: "14px"
          }}>
            This information will help animal rescuers locate and help the animal quickly
          </p>
        </div>

        <div style={{
          padding: "24px"
        }}>
          <div style={{
            marginBottom: "24px",
            padding: "12px",
            backgroundColor: colors.background,
            color: colors.primaryDark,
            borderRadius: "4px",
            border: `1px solid ${colors.primaryLight}`
          }}>
            <h3 style={{
              fontWeight: "bold",
              fontSize: "16px"
            }}>Important</h3>
            <p style={{
              fontSize: "14px"
            }}>
              If the animal is severely injured or in immediate danger, please also call our
              emergency hotline at <span style={{fontWeight: "bold"}}>+91 9876543210</span>.
            </p>
          </div>

          {errorMessage && (
            <div style={{
              marginBottom: "16px",
              padding: "12px",
              backgroundColor: "#FEF2F2",
              color: "#B91C1C",
              borderRadius: "4px",
              border: "1px solid #FEE2E2"
            }}>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} style={{marginTop: "24px"}}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "24px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "medium",
                  color: "#333"
                }}>
                  Animal Type*
                </label>
                <select 
                  name="animalType"
                  value={formData.animalType}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white"
                  }}
                  required
                >
                  <option value="">Select animal type</option>
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "medium",
                  color: "#333"
                }}>
                  Urgency Level
                </label>
                <select 
                  name="urgency"
                  value={formData.urgency}
                  onChange={handleChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "4px",
                    border: "1px solid #d1d5db",
                    backgroundColor: "white"
                  }}
                >
                  <option value="normal">Normal</option>
                  <option value="urgent">Urgent (Injured/Critical)</option>
                </select>
                <p style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  marginTop: "4px"
                }}>
                  Select 'Urgent' if the animal requires immediate attention
                </p>
              </div>
            </div>

            <div style={{marginBottom: "24px"}}>
              <label style={{
                display: "block",
                marginBottom: "8px",
                fontWeight: "medium",
                color: "#333"
              }}>
                Description*
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the animal's condition, appearance, behavior, etc."
                style={{
                  width: "100%",
                  minHeight: "120px",
                  padding: "10px",
                  borderRadius: "4px",
                  border: "1px solid #d1d5db",
                  resize: "vertical"
                }}
                required
              ></textarea>
              <p style={{
                fontSize: "12px",
                color: "#6B7280",
                marginTop: "4px"
              }}>
                Please provide as much detail as possible including visible injuries, behavior,
                and distinguishing features
              </p>
            </div>

            <div style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "24px",
              marginBottom: "24px"
            }}>
              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "medium",
                  color: "#333"
                }}>
                  Location*
                </label>
                <div style={{
                  display: "flex",
                  gap: "8px"
                }}>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Street address or landmark"
                    style={{
                      flexGrow: 1,
                      padding: "10px",
                      borderRadius: "4px",
                      border: "1px solid #d1d5db"
                    }}
                    required
                  />
                  <button
                    type="button"
                    onClick={getCurrentLocation}
                    style={{
                      padding: "10px",
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                  >
                    📍
                  </button>
                </div>
                <p style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  marginTop: "4px"
                }}>
                  Enter a specific location or use the location button
                </p>
              </div>

              <div>
                <label style={{
                  display: "block",
                  marginBottom: "8px",
                  fontWeight: "medium",
                  color: "#333"
                }}>
                  Upload Image
                </label>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px"
                }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    style={{
                      display: "none"
                    }}
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    style={{
                      flex: 1,
                      padding: "10px",
                      backgroundColor: "white",
                      border: "1px solid #d1d5db",
                      borderRadius: "4px",
                      textAlign: "center",
                      cursor: "pointer"
                    }}
                  >
                    Choose File
                  </label>
                  {previewImage && (
                    <div style={{
                      height: "40px",
                      width: "40px",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <img
                        src={previewImage}
                        alt="Preview"
                        style={{
                          height: "100%",
                          width: "100%",
                          objectFit: "cover"
                        }}
                      />
                    </div>
                  )}
                </div>
                <p style={{
                  fontSize: "12px",
                  color: "#6B7280",
                  marginTop: "4px"
                }}>
                  Upload a clear photo of the animal to help with identification
                </p>
              </div>
            </div>

            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "8px",
              marginTop: "16px"
            }}>
              <button
                type="button"
                onClick={() => navigate("/")}
                style={{
                  padding: "10px 16px",
                  backgroundColor: "white",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  padding: "10px 16px",
                  backgroundColor: colors.primary,
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                  opacity: isSubmitting ? 0.7 : 1
                }}
              >
                {isSubmitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportAnimal;