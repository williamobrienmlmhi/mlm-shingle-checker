import { useState } from "react";

function App() {
  const [photo, setPhoto] = useState(null);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

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
