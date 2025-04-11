import { useState, useEffect } from "react";

const FindVets = ({ user }) => {
  const [pincode, setPincode] = useState("");
  const [vets, setVets] = useState([]);
  const [filteredVets, setFilteredVets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [userLocation, setUserLocation] = useState({
    latitude: null,
    longitude: null
  });

  useEffect(() => {
    document.title = "Find Veterinarians - AnimalSOS";
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      const response = await fetch("/api/vets");
      if (!response.ok) {
        throw new Error("Failed to fetch veterinarians");
      }
      const data = await response.json();
      setVets(data);
      // Don't set filtered vets yet until search is performed
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          
          // Find nearby vets based on coordinates
          findNearbyVets(position.coords.latitude, position.coords.longitude);
          alert("Location detected! Showing veterinarians near your location.");
        },
        (error) => {
          alert("Could not detect your location. Please enter a pincode instead.");
        }
      );
    } else {
      alert("Your browser doesn't support geolocation. Please enter a pincode instead.");
    }
  };
  
  const findNearbyVets = (lat, lng) => {
    setSearchPerformed(true);
    
    // In a real-world application, we would use the coordinates to calculate actual distances
    // For this demo, we'll just assume all vets are nearby if we have coordinates
    setFilteredVets(vets);
  };

  const searchByPincode = () => {
    setSearchPerformed(true);
    
    if (!pincode || pincode.trim() === "") {
      setFilteredVets(vets);
      return;
    }
    
    // Filter vets by pincode 
    // In a real app, you might want to use a distance API here
    const filtered = vets.filter(vet => {
      // Check if address contains the pincode
      return vet.address.includes(pincode);
    });
    
    setFilteredVets(filtered);
  };

  const getDirections = (vet) => {
    if (vet.latitude && vet.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${vet.latitude},${vet.longitude}`,
        "_blank"
      );
    } else {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
          vet.address
        )}`,
        "_blank"
      );
    }
  };

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "48px 16px"
    }}>
      <div style={{
        textAlign: "center",
        marginBottom: "32px"
      }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "8px"
        }}>Find Veterinarians Near You</h1>
        <p style={{
          color: "#666"
        }}>Connect with qualified veterinarians for animal care</p>
      </div>

      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        padding: "24px",
        marginBottom: "32px"
      }}>
        <h3 style={{
          fontSize: "18px",
          fontWeight: "bold",
          marginBottom: "16px",
          color: "#4CAF50"
        }}>
          Search for Veterinarians by Pincode
        </h3>
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "16px"
        }}>
          <input
            type="text"
            placeholder="Enter your pincode..."
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "16px"
            }}
          />
          <button 
            onClick={searchByPincode}
            style={{
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0 20px",
              cursor: "pointer",
              fontWeight: "500"
            }}
          >
            Find Vets
          </button>
          <button
            onClick={getCurrentLocation}
            title="Use my current location"
            style={{
              backgroundColor: "#388E3C",
              color: "white",
              border: "none",
              borderRadius: "4px",
              padding: "0 12px",
              cursor: "pointer",
              fontWeight: "500",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            📍
          </button>
        </div>
        <p style={{ 
          color: "#666", 
          fontSize: "14px"
        }}>
          Enter your pincode or use the location button (📍) to find veterinary clinics near you
        </p>
      </div>

      {isLoading ? (
        <div style={{
          textAlign: "center",
          padding: "32px"
        }}>
          <p>Loading veterinarians...</p>
        </div>
      ) : error ? (
        <div style={{
          textAlign: "center",
          padding: "32px",
          backgroundColor: "#FEF2F2",
          color: "#B91C1C",
          borderRadius: "8px"
        }}>
          <p>{error}</p>
        </div>
      ) : !searchPerformed ? (
        <div style={{
          textAlign: "center",
          padding: "32px",
          backgroundColor: "#E8F5E9",
          borderRadius: "8px"
        }}>
          <p style={{ color: "#2E7D32" }}>Enter your pincode or use your current location to find veterinarians nearby</p>
        </div>
      ) : filteredVets.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "32px",
          backgroundColor: "#F3F4F6",
          borderRadius: "8px"
        }}>
          <p>No veterinarians found matching your search.</p>
        </div>
      ) : (
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px"
        }}>
          {filteredVets.map((vet) => (
            <div
              key={vet.id}
              style={{
                backgroundColor: "white",
                borderRadius: "8px",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                overflow: "hidden"
              }}
            >
              <div style={{
                padding: "16px",
                borderBottom: "1px solid #E5E7EB"
              }}>
                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "bold",
                  marginBottom: "8px"
                }}>{vet.name}</h3>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#4B5563",
                  marginBottom: "4px"
                }}>
                  <span style={{marginRight: "8px"}}>📍</span>
                  <span>{vet.address}</span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  color: "#4B5563",
                  marginBottom: "4px"
                }}>
                  <span style={{marginRight: "8px"}}>📞</span>
                  <span>{vet.phone}</span>
                </div>
                {vet.email && (
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    color: "#4B5563",
                    marginBottom: "4px"
                  }}>
                    <span style={{marginRight: "8px"}}>✉️</span>
                    <span>{vet.email}</span>
                  </div>
                )}
              </div>
              <div style={{
                padding: "16px"
              }}>
                {vet.specializations && vet.specializations.length > 0 && (
                  <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                    marginBottom: "16px"
                  }}>
                    {vet.specializations.map((spec, index) => (
                      <span
                        key={index}
                        style={{
                          backgroundColor: "#F3F4F6",
                          color: "#4B5563",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px"
                        }}
                      >
                        {spec}
                      </span>
                    ))}
                  </div>
                )}
                <div style={{
                  display: "flex",
                  gap: "8px"
                }}>
                  <button
                    onClick={() => getDirections(vet)}
                    style={{
                      flex: 1,
                      backgroundColor: "#4CAF50",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 0",
                      cursor: "pointer",
                      fontSize: "14px"
                    }}
                  >
                    Get Directions
                  </button>
                  <a
                    href={`tel:${vet.phone}`}
                    style={{
                      flex: 1,
                      backgroundColor: "#10B981",
                      color: "white",
                      border: "none",
                      borderRadius: "4px",
                      padding: "8px 0",
                      cursor: "pointer",
                      fontSize: "14px",
                      textDecoration: "none",
                      textAlign: "center"
                    }}
                  >
                    Call
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FindVets;