import { useState } from "react";

function ShingleChecker() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please select a shingle photo");
      return;
    }

    // Placeholder result for now
    setResult("Result: Unable to determine (AI coming soon)");
  };

  return (
    <div style={{ marginTop: 30 }}>
      <h2>Shingle Checker</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <br /><br />

        <button type="submit">Check Shingle</button>
      </form>

      {result && (
        <p style={{ marginTop: 20, fontWeight: "bold" }}>
          {result}
        </p>
      )}
    </div>
  );
}

export default ShingleChecker;
