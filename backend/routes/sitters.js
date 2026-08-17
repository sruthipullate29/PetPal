const express = require("express");
const { isMongo, readDb, updateDb } = require("../db");
const User = require("../models/User");
const SitterProfile = require("../models/SitterProfile");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", authMiddleware, async (req, res, next) => {
  try {
    if (isMongo()) {
      const sitters = await User.find({ role: "sitter" }).select("-password");
      const profiles = await SitterProfile.find();
      const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

      const result = sitters.map((user) => {
        const profile = profileMap.get(user._id.toString()) || {};
        return {
          id: user._id.toString(),
          name: user.name,
          bio: profile.bio || "",
          hourlyRate: typeof profile.hourlyRate === "number" ? profile.hourlyRate : Number(profile.hourlyRate) || 25,
          services: profile.services || [],
          location: profile.location || "",
          availability: profile.availability || [],
        };
      });

      return res.json(result);
    }

    // JSON Fallback
    const db = readDb();
    const sitters = db.users
      .filter((u) => u.role === "sitter")
      .map((user) => {
        const profile = db.sitterProfiles.find((p) => p.userId === user.id) || {};
        const numericRate = typeof profile.hourlyRate === "number"
          ? profile.hourlyRate
          : parseInt(String(profile.hourlyRate).replace(/[^0-9]/g, ""), 10) || 25;
        return {
          id: user.id,
          name: user.name,
          bio: profile.bio || "",
          hourlyRate: numericRate,
          services: profile.services || [],
          location: profile.location || "",
          availability: profile.availability || [],
        };
      });
    return res.json(sitters);
  } catch (err) {
    next(err);
  }
});

router.get("/me", authMiddleware, requireRole("sitter"), async (req, res, next) => {
  try {
    if (isMongo()) {
      const user = await User.findById(req.user.id).select("-password");
      let profile = await SitterProfile.findOne({ userId: req.user.id });

      if (!profile) {
        profile = await SitterProfile.create({
          userId: req.user.id,
          bio: "",
          hourlyRate: 25,
          services: ["Dog Walking", "Pet Sitting"],
          location: "",
          availability: [],
        });
      }

      return res.json({
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        bio: profile.bio || "",
        hourlyRate: profile.hourlyRate || 25,
        services: profile.services || [],
        location: profile.location || "",
        availability: profile.availability || [],
      });
    }

    // JSON Fallback
    const db = readDb();
    const user = db.users.find((u) => u.id === req.user.id);
    let profile = db.sitterProfiles.find((p) => p.userId === req.user.id);

    if (!profile) {
      profile = {
        userId: req.user.id,
        bio: "",
        hourlyRate: 25,
        services: ["Dog Walking", "Pet Sitting"],
        location: "",
        availability: [],
      };
    }

    return res.json({
      id: user ? user.id : req.user.id,
      name: user ? user.name : req.user.name,
      email: user ? user.email : req.user.email,
      ...profile,
    });
  } catch (err) {
    next(err);
  }
});

router.put("/me", authMiddleware, requireRole("sitter"), async (req, res, next) => {
  try {
    const { bio, hourlyRate, services, location, availability } = req.body;

    if (hourlyRate !== undefined && Number(hourlyRate) <= 0) {
      return res.status(400).json({ error: "Hourly rate must be greater than 0" });
    }

    if (isMongo()) {
      let profile = await SitterProfile.findOne({ userId: req.user.id });
      if (!profile) {
        profile = new SitterProfile({ userId: req.user.id });
      }

      if (bio !== undefined) profile.bio = bio.trim();
      if (hourlyRate !== undefined) profile.hourlyRate = Number(hourlyRate);
      if (services !== undefined) profile.services = services;
      if (location !== undefined) profile.location = location.trim();
      if (availability !== undefined) profile.availability = availability;

      await profile.save();
      return res.json(profile);
    }

    // JSON Fallback
    const db = readDb();
    const index = db.sitterProfiles.findIndex((p) => p.userId === req.user.id);

    if (index === -1) {
      const newProfile = {
        userId: req.user.id,
        bio: bio || "",
        hourlyRate: Number(hourlyRate) || 25,
        services: services || ["Dog Walking", "Pet Sitting"],
        location: location || "",
        availability: availability || [],
      };
      await updateDb((db) => db.sitterProfiles.push(newProfile));
      return res.json(newProfile);
    }

    const updated = {
      ...db.sitterProfiles[index],
      bio: bio !== undefined ? bio : db.sitterProfiles[index].bio,
      hourlyRate: hourlyRate !== undefined ? Number(hourlyRate) : db.sitterProfiles[index].hourlyRate,
      services: services !== undefined ? services : db.sitterProfiles[index].services,
      location: location !== undefined ? location : db.sitterProfiles[index].location,
      availability: availability !== undefined ? availability : db.sitterProfiles[index].availability,
    };

    await updateDb((db) => {
      const idx = db.sitterProfiles.findIndex((p) => p.userId === req.user.id);
      if (idx !== -1) db.sitterProfiles[idx] = updated;
    });

    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    if (isMongo()) {
      const user = await User.findOne({ _id: req.params.id, role: "sitter" }).select("-password");
      if (!user) {
        return res.status(404).json({ error: "Sitter not found" });
      }

      const profile = (await SitterProfile.findOne({ userId: user._id })) || {};
      return res.json({
        id: user._id.toString(),
        name: user.name,
        bio: profile.bio || "",
        hourlyRate: typeof profile.hourlyRate === "number" ? profile.hourlyRate : 25,
        services: profile.services || [],
        location: profile.location || "",
        availability: profile.availability || [],
      });
    }

    // JSON Fallback
    const db = readDb();
    const user = db.users.find((u) => u.id === req.params.id && u.role === "sitter");
    if (!user) {
      return res.status(404).json({ error: "Sitter not found" });
    }

    const profile = db.sitterProfiles.find((p) => p.userId === user.id) || {};
    const numericRate = typeof profile.hourlyRate === "number"
      ? profile.hourlyRate
      : parseInt(String(profile.hourlyRate).replace(/[^0-9]/g, ""), 10) || 25;

    return res.json({
      id: user.id,
      name: user.name,
      bio: profile.bio || "",
      hourlyRate: numericRate,
      services: profile.services || [],
      location: profile.location || "",
      availability: profile.availability || [],
    });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
