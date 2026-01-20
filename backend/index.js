import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

console.log("ENV CHECK:", {
  ADMIN_EMAIL: process.env.ADMIN_EMAIL,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD ? "SET" : "MISSING",
  JWT_SECRET: process.env.JWT_SECRET ? "SET" : "MISSING"
});

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

// In-memory user store (v1)
const users = [];

const ensureAdminUser = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    console.error("Missing admin env vars", {
      ADMIN_EMAIL: process.env.ADMIN_EMAIL,
      ADMIN_PASSWORD: process.env.ADMIN_PASSWORD
    });
    throw new Error("Admin credentials are not set");
  }

const ensureAdminUser = async () => {
  if (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD) {
    throw new Error("Admin credentials are not set");
  }
  
  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  users.push({
    id: 1,
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    role: "admin",
  });
};

// LOGIN
app.post("/auth/login", async (req, res) => {
  const { email, password } = req.body;

  // TEMP DEBUG ADMIN LOGIN
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
  
// AUTH MIDDLEWARE
const auth = (roles = []) => (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.sendStatus(401);

  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(decoded.role)) {
      return res.sendStatus(403);
    }
    req.user = decoded;
    next();
  } catch {
    res.sendStatus(401);
  }
};

// PROTECTED SHINGLE CHECK
app.post("/check", auth(["admin", "user"]), (req, res) => {
  res.json({
    riskLevel: "Moderate",
    recommendation: "Schedule inspection within 6 months",
    confidenceScore: 0.78,
  });
});

// ADMIN: CREATE USER
app.post("/admin/users", auth(["admin"]), async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({ error: "User already exists" });
  }

  const hashed = await bcrypt.hash(password, 10);
  users.push({
    id: users.length + 1,
    email,
    password: hashed,
    role: "user",
  });

  res.json({ success: true });
});

// HEALTH CHECK
app.get("/", (req, res) => {
  res.json({ status: "API running" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
