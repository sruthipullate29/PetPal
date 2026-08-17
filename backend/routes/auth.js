const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const { isMongo, readDb, updateDb } = require("../db");
const User = require("../models/User");
const SitterProfile = require("../models/SitterProfile");
const { authMiddleware, JWT_SECRET } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", async (req, res, next) => {
  try {
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

    const cleanEmail = email.trim().toLowerCase();
    const hashedPassword = await bcrypt.hash(password, 10);

    if (isMongo()) {
      const existingUser = await User.findOne({ email: cleanEmail });
      if (existingUser) {
        return res.status(409).json({ error: "Email already registered" });
      }

      const user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        role,
      });

      if (role === "sitter") {
        await SitterProfile.create({
          userId: user._id,
          bio: "",
          hourlyRate: 25,
          services: ["Dog Walking", "Pet Sitting"],
          location: "",
          availability: [],
        });
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(201).json({
        token,
        user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
      });
    }

    // JSON Fallback
    const db = readDb();
    if (db.users.find((u) => u.email.toLowerCase() === cleanEmail)) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const user = {
      id: uuidv4(),
      email: cleanEmail,
      password: hashedPassword,
      name: name.trim(),
      role,
      createdAt: new Date().toISOString(),
    };

    await updateDb((db) => {
      db.users.push(user);
      if (role === "sitter") {
        db.sitterProfiles.push({
          userId: user.id,
          bio: "",
          hourlyRate: 25,
          services: ["Dog Walking", "Pet Sitting"],
          location: "",
          availability: [],
        });
      }
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password are required" });
    }

    const cleanEmail = email.trim().toLowerCase();

    if (isMongo()) {
      const user = await User.findOne({ email: cleanEmail });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      const token = jwt.sign(
        { id: user._id.toString(), email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        token,
        user: { id: user._id.toString(), email: user.email, name: user.name, role: user.role },
      });
    }

    // JSON Fallback
    const db = readDb();
    const user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);
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

    return res.json({
      token,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    });
  } catch (err) {
    next(err);
  }
});

router.get("/me", authMiddleware, async (req, res, next) => {
  try {
    if (isMongo()) {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.json({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        role: user.role,
      });
    }

    const db = readDb();
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
