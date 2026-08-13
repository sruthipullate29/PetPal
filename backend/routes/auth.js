const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const SitterProfile = require("../models/SitterProfile");
const { authMiddleware, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password, name, role } = req.body;

  if (!email || !password || !name || !role) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!["owner", "sitter"].includes(role)) {
    return res.status(400).json({ error: "Role must be owner or sitter" });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: "Email already registered" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    name,
    role,
  });

  if (role === "sitter") {
    await SitterProfile.create({
      userId: user.id,
      bio: "",
      hourlyRate: 25,
      services: ["Dog Walking", "Pet Sitting"],
      location: "",
      availability: [],
    });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.status(201).json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  res.json({
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  });
});

router.get("/me", authMiddleware, async (req, res) => {
  const user = await User.findOne({ id: req.user.id });
  if (!user) {
    return res.status(404).json({ error: "User not found" });
  }
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });
});

module.exports = router;

