import { Link } from "wouter";

const HeroSection = () => {
  return (
    <section style={{
      backgroundColor: "#4CAF50", // Light green theme
      padding: "48px 0",
      textAlign: "center"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px"
      }}>
        <h1 style={{
          fontWeight: "bold",
          fontSize: "40px",
          color: "white",
          marginBottom: "16px",
          lineHeight: "1.2"
        }}>
          Rescue, Protect, Care
        </h1>
        <p style={{
          fontSize: "18px",
          color: "rgba(255, 255, 255, 0.9)",
          marginBottom: "32px",
          maxWidth: "700px",
          margin: "0 auto 32px"
        }}>
          Report injured animals, find veterinarians, and give pets a loving home - all in one platform.
        </p>
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          alignItems: "center",
          justifyContent: "center"
        }}>
          <Link href="/auth">
            <button style={{
              backgroundColor: "white",
              color: "#4CAF50",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: "500",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "250px"
            }}>
              Sign In / Register
            </button>
          </Link>
          <Link href="/auth">
            <button style={{
              backgroundColor: "#388E3C",
              color: "white",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: "500",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "250px"
            }}>
              Report an Animal
            </button>
          </Link>
          <Link href="/auth">
            <button style={{
              backgroundColor: "#81C784",
              color: "white",
              padding: "16px 24px",
              fontSize: "16px",
              fontWeight: "500",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
              width: "250px"
            }}>
              Find a Vet
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;