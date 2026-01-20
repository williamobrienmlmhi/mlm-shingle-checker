import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "MLM Shingle Checker API running" });
});

// Main check endpoint
app.post("/check", (req, res) => {
  const { address } = req.body;

  if (!address) {
    return res.status(400).json({ error: "Address is required" });
  }

  res.json({
    address,
    riskLevel: "Moderate",
    recommendation: "Schedule inspection within 6 months",
    confidenceScore: 0.78,
  });
});

// Start server (ONLY ONCE)
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
