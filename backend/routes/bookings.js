const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { isMongo, readDb, updateDb } = require("../db");
const User = require("../models/User");
const Pet = require("../models/Pet");
const Booking = require("../models/Booking");
const SitterProfile = require("../models/SitterProfile");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

function enrichBookingJSON(db, booking) {
  const owner = db.users.find((u) => u.id === booking.ownerId);
  const sitter = db.users.find((u) => u.id === booking.sitterId);
  const pet = db.pets.find((p) => p.id === booking.petId);
  return {
    ...booking,
    ownerName: owner?.name || "Unknown",
    sitterName: sitter?.name || "Unknown",
    petName: pet?.name || "Unknown",
    petType: pet?.type || "",
  };
}

router.get("/", async (req, res, next) => {
  try {
    if (isMongo()) {
      const filter = req.user.role === "owner" ? { ownerId: req.user.id } : { sitterId: req.user.id };
      const bookings = await Booking.find(filter)
        .populate("ownerId", "name email")
        .populate("sitterId", "name email")
        .populate("petId", "name type breed")
        .sort({ createdAt: -1 });

      const enriched = bookings.map((b) => {
        const obj = b.toJSON();
        return {
          ...obj,
          ownerName: b.ownerId?.name || "Unknown",
          sitterName: b.sitterId?.name || "Unknown",
          petName: b.petId?.name || "Unknown",
          petType: b.petId?.type || "",
        };
      });

      return res.json(enriched);
    }

    // JSON Fallback
    const db = readDb();
    let bookings;
    if (req.user.role === "owner") {
      bookings = db.bookings.filter((b) => b.ownerId === req.user.id);
    } else {
      bookings = db.bookings.filter((b) => b.sitterId === req.user.id);
    }

    return res.json(bookings.map((b) => enrichBookingJSON(db, b)));
  } catch (err) {
    next(err);
  }
});

router.post("/", requireRole("owner"), async (req, res, next) => {
  try {
    const { sitterId, petId, startDate, endDate, serviceType, notes } = req.body;

    if (!sitterId || !petId || !startDate || !endDate || !serviceType) {
      return res.status(400).json({ error: "Missing required booking fields" });
    }

    if (new Date(endDate) < new Date(startDate)) {
      return res.status(400).json({ error: "End date cannot be before start date" });
    }

    if (isMongo()) {
      const sitter = await User.findOne({ _id: sitterId, role: "sitter" });
      const pet = await Pet.findOne({ _id: petId, ownerId: req.user.id });

      if (!sitter) return res.status(404).json({ error: "Sitter not found" });
      if (!pet) return res.status(404).json({ error: "Pet not found for current user" });

      const profile = await SitterProfile.findOne({ userId: sitterId });
      const rate = profile ? profile.hourlyRate : 25;

      const start = new Date(startDate);
      const end = new Date(endDate);
      const days = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);
      const totalPrice = days * rate;

      const booking = await Booking.create({
        ownerId: req.user.id,
        sitterId,
        petId,
        startDate,
        endDate,
        serviceType,
        totalPrice,
        notes: notes ? notes.trim() : "",
        status: "pending",
      });

      const owner = await User.findById(req.user.id);

      return res.status(201).json({
        ...booking.toJSON(),
        ownerName: owner ? owner.name : "Unknown",
        sitterName: sitter.name,
        petName: pet.name,
        petType: pet.type,
      });
    }

    // JSON Fallback
    const db = readDb();
    const sitter = db.users.find((u) => u.id === sitterId && u.role === "sitter");
    const pet = db.pets.find((p) => p.id === petId && p.ownerId === req.user.id);

    if (!sitter) return res.status(404).json({ error: "Sitter not found" });
    if (!pet) return res.status(404).json({ error: "Pet not found for current user" });

    const booking = {
      id: uuidv4(),
      ownerId: req.user.id,
      sitterId,
      petId,
      startDate,
      endDate,
      serviceType,
      notes: notes || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };

    await updateDb((db) => {
      db.bookings.push(booking);
    });

    return res.status(201).json(enrichBookingJSON(readDb(), booking));
  } catch (err) {
    next(err);
  }
});

router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ["pending", "accepted", "declined", "completed", "cancelled"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    if (isMongo()) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ error: "Booking not found" });
      }

      const isOwner = req.user.role === "owner" && booking.ownerId.toString() === req.user.id;
      const isSitter = req.user.role === "sitter" && booking.sitterId.toString() === req.user.id;

      if (!isOwner && !isSitter) {
        return res.status(403).json({ error: "Not authorized to update this booking" });
      }

      if (isOwner && !["cancelled"].includes(status)) {
        return res.status(403).json({ error: "Owners can only cancel bookings" });
      }

      if (isSitter && !["accepted", "declined", "completed"].includes(status)) {
        return res.status(403).json({ error: "Sitters can accept, decline, or complete bookings" });
      }

      booking.status = status;
      await booking.save();

      const owner = await User.findById(booking.ownerId);
      const sitter = await User.findById(booking.sitterId);
      const pet = await Pet.findById(booking.petId);

      return res.json({
        ...booking.toJSON(),
        ownerName: owner ? owner.name : "Unknown",
        sitterName: sitter ? sitter.name : "Unknown",
        petName: pet ? pet.name : "Unknown",
        petType: pet ? pet.type : "",
      });
    }

    // JSON Fallback
    const db = readDb();
    const index = db.bookings.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      return res.status(404).json({ error: "Booking not found" });
    }

    const booking = db.bookings[index];
    const isOwner = req.user.role === "owner" && booking.ownerId === req.user.id;
    const isSitter = req.user.role === "sitter" && booking.sitterId === req.user.id;

    if (!isOwner && !isSitter) {
      return res.status(403).json({ error: "Not authorized to update this booking" });
    }

    if (isOwner && !["cancelled"].includes(status)) {
      return res.status(403).json({ error: "Owners can only cancel bookings" });
    }

    if (isSitter && !["accepted", "declined", "completed"].includes(status)) {
      return res.status(403).json({ error: "Sitters can accept, decline, or complete bookings" });
    }

    await updateDb((db) => {
      const idx = db.bookings.findIndex((b) => b.id === req.params.id);
      if (idx !== -1) db.bookings[idx].status = status;
    });

    const updated = { ...booking, status };
    return res.json(enrichBookingJSON(readDb(), updated));
  } catch (err) {
    next(err);
  }
});

module.exports = router;
