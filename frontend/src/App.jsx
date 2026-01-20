import { useState } from "react";
import ShingleChecker from "./ShingleChecker";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const login = async () => {
    setError("");

    try {
      const res = await fetch(
        "https://mlm-shingle-backend.onrender.com/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      setIsAuthenticated(true);
    } catch (err) {
      setError("Network error");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsAuthenticated(false);
  };

  // 🔐 LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div
        style={{
          padding: 40,
          maxWidth: 400,
          margin: "0 auto",
          marginTop: 80,
        }}
      >
        <h2>MLM Shingle Tracker Login</h2>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "100%", marginBottom: 10, padding: 8 }}
        />

        <button
          onClick={login}
          style={{
            width: "100%",
            padding: 10,
            cursor: "pointer",
          }}
        >
          Login
        </button>

        {error && (
          <p style={{ color: "red", marginTop: 10 }}>{error}</p>
        )}
      </div>
    );
  }

  // ✅ LOGGED-IN DASHBOARD
  return (
    <div style={{ padding: 40 }}>
      <button
        onClick={logout}
        style={{
          float: "right",
          background: "#e74c3c",
          color: "white",
          border: "none

          }

export default App;
