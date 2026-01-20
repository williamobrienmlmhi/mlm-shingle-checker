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

import bcrypt from "bcryptjs";

const users = [];

const ensureAdminUser = async () => {
  const index = users.findIndex(
    u => u.email === process.env.ADMIN_EMAIL
  );

  if (index !== -1) {
    users.splice(index, 1);
  }

  const hashed = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

  users.push({
    id: 1,
    email: process.env.ADMIN_EMAIL,
    password: hashed,
    role: "admin",
  });
};

app.post("/auth/login", async (req, res) => {
  try {
    await ensureAdminUser();

    const { email, password } = req.body;

    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    res.json({ token, role: user.role });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Auth failed" });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
