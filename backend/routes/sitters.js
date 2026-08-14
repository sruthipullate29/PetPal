const express = require("express");
const { readDb, updateDb } = require("../db");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, (req, res) => {
  const db = readDb();
  const sitters = db.users
    .filter((u) => u.role === "sitter")
    .map((user) => {
      const profile = db.sitterProfiles.find((p) => p.userId === user.id) || {};
      return {
        id: user.id,
        name: user.name,
        bio: profile.bio || "",
        hourlyRate: `₹${profile.hourlyRate || 25}`,
        services: profile.services || [],
        location: profile.location || "",
        availability: profile.availability || [],
      };
    });
  res.json(sitters);
});

router.get("/me", authMiddleware, requireRole("sitter"), (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.user.id);
  const profile = db.sitterProfiles.find((p) => p.userId === req.user.id);

  if (!profile) {
    return res.status(404).json({ error: "Profile not found" });
  }

  res.json({
    id: user.id,
    name: user.name,
    email: user.email,
    ...profile,
  });
});

router.put("/me", authMiddleware, requireRole("sitter"), async (req, res) => {
  const { bio, hourlyRate, services, location, availability } = req.body;
  const db = readDb();
  const index = db.sitterProfiles.findIndex((p) => p.userId === req.user.id);

  if (index === -1) {
    return res.status(404).json({ error: "Profile not found" });
  }

  const updated = {
    ...db.sitterProfiles[index],
    bio: bio ?? db.sitterProfiles[index].bio,
    hourlyRate: hourlyRate ?? db.sitterProfiles[index].hourlyRate,
    services: services ?? db.sitterProfiles[index].services,
    location: location ?? db.sitterProfiles[index].location,
    availability: availability ?? db.sitterProfiles[index].availability,
  };

  await updateDb((db) => {
    const idx = db.sitterProfiles.findIndex((p) => p.userId === req.user.id);
    if (idx !== -1) db.sitterProfiles[idx] = updated;
  });

  res.json(updated);
});

router.get("/:id", authMiddleware, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.params.id && u.role === "sitter");
  if (!user) {
    return res.status(404).json({ error: "Sitter not found" });
  }

  const profile = db.sitterProfiles.find((p) => p.userId === user.id) || {};
  res.json({
    id: user.id,
    name: user.name,
    bio: profile.bio || "",
    hourlyRate: `₹${profile.hourlyRate || 25}`,
    services: profile.services || [],
    location: profile.location || "",
    availability: profile.availability || [],
  });
});

module.exports = router;
