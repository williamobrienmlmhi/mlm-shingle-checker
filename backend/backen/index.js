const express = require("express");
const cors = require("cors");
const multer = require("multer");

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => {
  res.json({ status: "MLM Shingle Checker API running" });
});

app.post("/api/check-shingle", upload.single("photo"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No photo uploaded" });
  }

  // Placeholder logic (AI will be added later)
  const results = ["Discontinued", "Available", "Unknown"];
  const result = results[Math.floor(Math.random() * results.length)];

  res.json({
    result,
    confidence: Math.floor(Math.random() * 30) + 70
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
