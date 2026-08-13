const express = require("express");
const User = require("../models/User");
const SitterProfile = require("../models/SitterProfile");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  const sitters = await User.find({ role: "sitter" });
  const profiles = await SitterProfile.find();

  const result = sitters.map((user) => {
    const profile = profiles.find((p) => p.userId === user.id) || {};
    return {
      id: user.id,
      name: user.name,
      bio: profile.bio || "",
      hourlyRate: profile.hourlyRate || 25,
      services: profile.services || [],
      location: profile.location || "",
      availability: profile.availability || [],
    };
  });

  res.json(result);
});

router.get("/me", authMiddleware, requireRole("sitter"), async (req, res) => {
  const user = await User.findOne({ id: req.user.id });
  const profile = await SitterProfile.findOne({ userId: req.user.id });

  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    bio: profile.bio || "",
    hourlyRate: profile.hourlyRate || 25,
    services: profile.services || [],
    location: profile.location || "",
    availability: profile.availability || [],
  });
});

router.put("/me", authMiddleware, requireRole("sitter"), async (req, res) => {
  const { bio, hourlyRate, services, location, availability } = req.body;
  let profile = await SitterProfile.findOne({ userId: req.user.id });

  if (!profile) {
    profile = await SitterProfile.create({ userId: req.user.id });
  }

  profile.bio = bio ?? profile.bio;
  profile.hourlyRate = hourlyRate ?? profile.hourlyRate;
  profile.services = services ?? profile.services;
  profile.location = location ?? profile.location;
  profile.availability = availability ?? profile.availability;
  await profile.save();

  res.json(profile);
});

router.get("/:id", authMiddleware, async (req, res) => {
  const user = await User.findOne({ id: req.params.id, role: "sitter" });
  if (!user) {
    return res.status(404).json({ error: "Sitter not found" });
  }

  const profile = await SitterProfile.findOne({ userId: user.id });
  res.json({
    id: user.id,
    name: user.name,
    bio: profile?.bio || "",
    hourlyRate: profile?.hourlyRate || 25,
    services: profile?.services || [],
    location: profile?.location || "",
    availability: profile?.availability || [],
  });
});

module.exports = router;

