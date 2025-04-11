import { useEffect } from "react";
import { Link } from "wouter";

const AdminDashboard = () => {
  useEffect(() => {
    document.title = "Admin Dashboard - AnimalSOS";
  }, []);

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
          Admin Dashboard
        </h1>
        <p style={{
          color: "#666"
        }}>
          Manage animal reports, veterinarians, and user accounts
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
        gap: "24px",
        marginBottom: "32px"
      }}>
        <div style={{
          backgroundColor: "#EFF6FF",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #BFDBFE"
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#1E40AF",
            marginBottom: "8px"
          }}>
            Animal Reports
          </h2>
          <p style={{
            color: "#3B82F6",
            marginBottom: "16px"
          }}>
            View and manage incoming animal reports
          </p>
          <Link href="/admin/reports">
            <button style={{
              backgroundColor: "#3B82F6",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}>
              Manage Reports
            </button>
          </Link>
        </div>

        <div style={{
          backgroundColor: "#ECFDF5",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #A7F3D0"
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#065F46",
            marginBottom: "8px"
          }}>
            Veterinarians
          </h2>
          <p style={{
            color: "#10B981",
            marginBottom: "16px"
          }}>
            Add or manage veterinarian listings
          </p>
          <Link href="/admin/vets">
            <button style={{
              backgroundColor: "#10B981",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}>
              Manage Vets
            </button>
          </Link>
        </div>

        <div style={{
          backgroundColor: "#FEF3F2",
          borderRadius: "8px",
          padding: "24px",
          border: "1px solid #FECACA"
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#991B1B",
            marginBottom: "8px"
          }}>
            User Accounts
          </h2>
          <p style={{
            color: "#EF4444",
            marginBottom: "16px"
          }}>
            Manage user accounts and permissions
          </p>
          <Link href="/admin/users">
            <button style={{
              backgroundColor: "#EF4444",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer"
            }}>
              Manage Users
            </button>
          </Link>
        </div>
      </div>

      <div style={{
        backgroundColor: "white",
        borderRadius: "8px",
        boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
        overflow: "hidden"
      }}>
        <div style={{
          padding: "16px",
          borderBottom: "1px solid #e5e7eb",
          backgroundColor: "#f9fafb"
        }}>
          <h2 style={{
            fontSize: "18px",
            fontWeight: "bold",
            color: "#333"
          }}>
            Recent Activities
          </h2>
        </div>
        <div style={{
          padding: "16px"
        }}>
          <p style={{
            color: "#666",
            textAlign: "center",
            padding: "32px"
          }}>
            Activity logs will be displayed here
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;