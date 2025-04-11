import { useEffect } from "react";
import { Link } from "wouter";

const Adoption = () => {
  useEffect(() => {
    document.title = "Animal Adoption - AnimalSOS";
  }, []);

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
        }}>Animal Adoption</h1>
        <p style={{
          color: "#666"
        }}>Find your perfect companion and give them a loving home</p>
      </div>

      <div style={{
        backgroundColor: "#FFFBEB",
        padding: "24px",
        borderRadius: "8px",
        marginBottom: "32px",
        textAlign: "center",
        border: "1px solid #FEF3C7"
      }}>
        <h2 style={{
          fontSize: "20px",
          fontWeight: "bold",
          color: "#92400E",
          marginBottom: "8px"
        }}>
          Adopt, Don't Shop
        </h2>
        <p style={{
          color: "#B45309",
          marginBottom: "16px"
        }}>
          By adopting, you're giving an animal a second chance at a happy life
        </p>
        <Link href="/">
          <button style={{
            backgroundColor: "#F59E0B",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "4px",
            fontWeight: "500",
            cursor: "pointer"
          }}>
            Back to Home
          </button>
        </Link>
      </div>

      <div style={{
        textAlign: "center",
        color: "#666",
        padding: "64px 0"
      }}>
        <p>Adoption listings will be displayed here</p>
      </div>
    </div>
  );
};

export default Adoption;