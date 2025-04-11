import { Link } from "wouter";

export default function NotFound() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      textAlign: "center",
      padding: "0 20px"
    }}>
      <h1 style={{
        fontSize: "72px",
        fontWeight: "bold",
        color: "#4A90E2",
        marginBottom: "0"
      }}>
        404
      </h1>
      <h2 style={{
        fontSize: "24px",
        fontWeight: "bold",
        color: "#333",
        marginBottom: "16px"
      }}>
        Page Not Found
      </h2>
      <p style={{
        color: "#666",
        maxWidth: "500px",
        marginBottom: "24px"
      }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link href="/">
        <button style={{
          backgroundColor: "#4A90E2",
          color: "white",
          border: "none",
          padding: "12px 24px",
          borderRadius: "4px",
          fontWeight: "medium",
          cursor: "pointer"
        }}>
          Go back to home
        </button>
      </Link>
    </div>
  );
}