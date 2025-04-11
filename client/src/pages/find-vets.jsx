import { useState, useEffect } from "react";

const FindVets = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [vets, setVets] = useState([]);
  const [filteredVets, setFilteredVets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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
      setFilteredVets(data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredVets(vets);
    } else {
      const filtered = vets.filter(
        (vet) =>
          vet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          vet.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (vet.specializations &&
            vet.specializations.some((spec) =>
              spec.toLowerCase().includes(searchQuery.toLowerCase())
            ))
      );
      setFilteredVets(filtered);
    }
  }, [searchQuery, vets]);

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

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
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
        <div style={{
          display: "flex",
          gap: "16px",
          marginBottom: "24px"
        }}>
          <input
            type="text"
            placeholder="Search by name, location or specialization..."
            value={searchQuery}
            onChange={handleSearch}
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "4px",
              border: "1px solid #d1d5db",
              fontSize: "16px"
            }}
          />
          <button style={{
            backgroundColor: "#4A90E2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            padding: "0 20px",
            cursor: "pointer"
          }}>
            Search
          </button>
        </div>
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
                      backgroundColor: "#4A90E2",
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