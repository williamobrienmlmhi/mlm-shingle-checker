{isAuthenticated && (
  <button
    onClick={logout}
    style={{
      float: "right",
      background: "#e74c3c",
      color: "white",
      border: "none",
      padding: "8px 12px",
      borderRadius: 4,
      cursor: "pointer"
    }}
  >
    Logout
  </button>
)}

import { useEffect } from "react";
import { useState } from "react";

function App() {
    const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
  setIsAuthenticated(false);
};
    const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token"));
  
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
const login = async () => {
  setError(null);

  try {
    const res = await fetch("https://mlm-shingle-backend.onrender.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");

    localStorage.setItem("token", data.token);
    setToken(data.token);
  } catch (err) {
    setError(err.message);
  }
};
  const checkShingles = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

     if (!photo) {
    setError("Please upload a roof image");
    setLoading(false);
    return;
  }

    try {
      const formData = new FormData();
formData.append("photo", photo);
      const res = await fetch("https://shingle-backend.onrender.com/check", {
  method: "POST",
  body: formData,
});
        

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
if (!token) {
  return (
    <div style={{ padding: "40px", maxWidth: "400px", margin: "auto" }}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", marginBottom: "10px" }}
      />

      <button onClick={login} style={{ width: "100%" }}>
        Login
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}
  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>MLM Shingle Checker</h1>


<input
  type="file"
  accept="image/*"
  onChange={(e) => setPhoto(e.target.files[0])}
/>
<br /><br />


      <button onClick={checkShingles} disabled={loading}>
        {loading ? "Checking..." : "Check Shingles"}
      </button>

      <br /><br />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {result && (
        <div>
          <h3>Result</h3>
          <p><strong>Risk Level:</strong> {result.riskLevel}</p>
          <p><strong>Recommendation:</strong> {result.recommendation}</p>
          <p><strong>Confidence Score:</strong> {result.confidenceScore}</p>
        </div>
      )}
    </div>
  );
}

export default App;
