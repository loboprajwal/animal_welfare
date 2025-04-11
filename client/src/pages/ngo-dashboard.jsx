import { useState, useEffect } from "react";
import { Link } from "wouter";

const NGODashboard = ({ user }) => {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    document.title = "NGO Dashboard - AnimalSOS";
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await fetch("/api/reports");
      if (!response.ok) {
        throw new Error("Failed to fetch reports");
      }
      const data = await response.json();
      setReports(data);
    } catch (error) {
      setError(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRespond = async (reportId) => {
    try {
      const response = await fetch(`/api/reports/${reportId}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          ngoId: user.id,
          status: "in-progress" 
        })
      });
      
      if (!response.ok) {
        throw new Error("Failed to respond to report");
      }
      
      // Update the local state to reflect the change
      setReports(reports.map(report => 
        report.id === reportId 
          ? { ...report, status: "in-progress", respondedBy: user.id } 
          : report
      ));
      
      alert("You have successfully responded to this report. Please coordinate rescue efforts.");
    } catch (error) {
      alert("Error: " + (error.message || "Failed to respond to report"));
    }
  };

  return (
    <div style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "48px 16px"
    }}>
      <div style={{
        marginBottom: "32px"
      }}>
        <h1 style={{
          fontSize: "28px",
          fontWeight: "bold",
          color: "#333",
          marginBottom: "8px"
        }}>
          NGO Dashboard - Animal Reports
        </h1>
        <p style={{
          color: "#666"
        }}>
          View and respond to animal reports in your area
        </p>
      </div>

      {isLoading ? (
        <div style={{
          textAlign: "center",
          padding: "32px"
        }}>
          <p>Loading reports...</p>
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
      ) : reports.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "32px",
          backgroundColor: "#F3F4F6",
          borderRadius: "8px"
        }}>
          <p>No animal reports found.</p>
        </div>
      ) : (
        <div style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          overflow: "hidden"
        }}>
          <div style={{
            padding: "16px",
            borderBottom: "1px solid #e5e7eb",
            backgroundColor: "#f9fafb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <h2 style={{
              fontSize: "18px",
              fontWeight: "bold",
              color: "#333"
            }}>
              Animal Reports
            </h2>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}>
              <span style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#EF4444"
              }}></span>
              <span style={{ fontSize: "14px", color: "#666" }}>Urgent</span>
              
              <span style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#F59E0B",
                marginLeft: "16px"
              }}></span>
              <span style={{ fontSize: "14px", color: "#666" }}>Pending</span>
              
              <span style={{
                display: "inline-block",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#10B981",
                marginLeft: "16px"
              }}></span>
              <span style={{ fontSize: "14px", color: "#666" }}>In Progress</span>
            </div>
          </div>
          
          <table style={{
            width: "100%",
            borderCollapse: "collapse"
          }}>
            <thead>
              <tr style={{
                borderBottom: "1px solid #e5e7eb",
                backgroundColor: "#f9fafb"
              }}>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Animal</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Location</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Description</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Status</th>
                <th style={{ padding: "12px 16px", textAlign: "left" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {reports.map((report) => (
                <tr 
                  key={report.id}
                  style={{
                    borderBottom: "1px solid #e5e7eb",
                    backgroundColor: report.urgency === "urgent" ? "#FEF2F2" : "white"
                  }}
                >
                  <td style={{ padding: "16px" }}>
                    <div style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px"
                    }}>
                      <span style={{
                        fontSize: "24px"
                      }}>
                        {report.animalType === "dog" ? "🐕" : 
                         report.animalType === "cat" ? "🐈" : 
                         report.animalType === "bird" ? "🐦" : "🐾"}
                      </span>
                      <div>
                        <div style={{ fontWeight: "medium" }}>
                          {report.animalType.charAt(0).toUpperCase() + report.animalType.slice(1)}
                        </div>
                        <div style={{ 
                          fontSize: "12px", 
                          color: "#666",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px"
                        }}>
                          {report.urgency === "urgent" && (
                            <span style={{
                              backgroundColor: "#FEE2E2",
                              color: "#B91C1C",
                              padding: "2px 6px",
                              borderRadius: "4px",
                              fontSize: "10px",
                              fontWeight: "bold"
                            }}>URGENT</span>
                          )}
                          <span>Reported {new Date(report.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <div style={{ marginBottom: "4px" }}>{report.location}</div>
                    {(report.latitude && report.longitude) && (
                      <div style={{ 
                        fontSize: "12px", 
                        color: "#666" 
                      }}>
                        GPS: {report.latitude.substring(0, 8)}, {report.longitude.substring(0, 8)}
                      </div>
                    )}
                  </td>
                  <td style={{ 
                    padding: "16px",
                    maxWidth: "300px" 
                  }}>
                    <div style={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical"
                    }}>
                      {report.description}
                    </div>
                  </td>
                  <td style={{ padding: "16px" }}>
                    <span style={{
                      display: "inline-block",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: "medium",
                      backgroundColor: 
                        report.status === "resolved" ? "#D1FAE5" :
                        report.status === "in-progress" ? "#FEF3C7" :
                        "#F3F4F6",
                      color: 
                        report.status === "resolved" ? "#065F46" :
                        report.status === "in-progress" ? "#92400E" :
                        "#4B5563"
                    }}>
                      {report.status === "pending" ? "Pending" :
                       report.status === "in-progress" ? "In Progress" :
                       report.status === "resolved" ? "Resolved" :
                       report.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px" }}>
                    {report.status === "pending" ? (
                      <button
                        onClick={() => handleRespond(report.id)}
                        style={{
                          backgroundColor: "#4CAF50",
                          color: "white",
                          border: "none",
                          borderRadius: "4px",
                          padding: "8px 12px",
                          fontSize: "14px",
                          cursor: "pointer"
                        }}
                      >
                        Respond
                      </button>
                    ) : (
                      <button
                        disabled
                        style={{
                          backgroundColor: "#E5E7EB",
                          color: "#9CA3AF",
                          border: "none",
                          borderRadius: "4px",
                          padding: "8px 12px",
                          fontSize: "14px",
                          cursor: "not-allowed"
                        }}
                      >
                        {report.status === "in-progress" ? "In Progress" : "Resolved"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NGODashboard;