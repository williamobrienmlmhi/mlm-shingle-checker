import { useEffect, useState } from "react";

function App() {
  const [status, setStatus] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("https://shingle-backend.onrender.com/")
      .then((res) => res.json())
      .then((data) => {
        setStatus(data.status);
      })
      .catch((err) => {
        setError("Could not connect to backend");
        console.error(err);
      });
  }, []);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>MLM Shingle Checker</h1>

      {error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <p><strong>Backend status:</strong> {status}</p>
      )}
    </div>
  );
}
export default App;
