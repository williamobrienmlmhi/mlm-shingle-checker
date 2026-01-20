import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

// TEMP DEBUG ADMIN LOGIN (bypass auth)
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign(
      { id: 1, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({ token, role: "admin" });
  }

  return res.status(401).json({ error: "Invalid credentials" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
