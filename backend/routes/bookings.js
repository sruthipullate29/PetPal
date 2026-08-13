const express = require("express");
const Booking = require("../models/Booking");
const User = require("../models/User");
const Pet = require("../models/Pet");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

async function enrichBooking(booking) {
  const owner = await User.findOne({ id: booking.ownerId });
  const sitter = await User.findOne({ id: booking.sitterId });
  const pet = await Pet.findOne({ id: booking.petId });
  return {
    ...booking.toJSON(),
    ownerName: owner?.name || "Unknown",
    sitterName: sitter?.name || "Unknown",
    petName: pet?.name || "Unknown",
    petType: pet?.type || "",
  };
}

router.get("/", async (req, res) => {
  let bookings;
  if (req.user.role === "owner") {
    bookings = await Booking.find({ ownerId: req.user.id });
  } else {
    bookings = await Booking.find({ sitterId: req.user.id });
  }

  const enriched = await Promise.all(bookings.map(enrichBooking));
  res.json(enriched);
});

router.post("/", requireRole("owner"), async (req, res) => {
  const { sitterId, petId, startDate, endDate, serviceType, notes } = req.body;

  if (!sitterId || !petId || !startDate || !endDate || !serviceType) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  const sitter = await User.findOne({ id: sitterId, role: "sitter" });
  const pet = await Pet.findOne({ id: petId, ownerId: req.user.id });

  if (!sitter) return res.status(404).json({ error: "Sitter not found" });
  if (!pet) return res.status(404).json({ error: "Pet not found" });

  const booking = await Booking.create({
    ownerId: req.user.id,
    sitterId,
    petId,
    startDate,
    endDate,
    serviceType,
    notes: notes || "",
    status: "pending",
  });

  res.status(201).json(await enrichBooking(booking));
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "accepted", "declined", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const booking = await Booking.findOne({ id: req.params.id });
  if (!booking) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const isOwner = req.user.role === "owner" && booking.ownerId === req.user.id;
  const isSitter = req.user.role === "sitter" && booking.sitterId === req.user.id;

  if (!isOwner && !isSitter) {
    return res.status(403).json({ error: "Not authorized" });
  }

  if (isOwner && !["cancelled"].includes(status)) {
    return res.status(403).json({ error: "Owners can only cancel bookings" });
  }

  if (isSitter && !["accepted", "declined", "completed"].includes(status)) {
    return res.status(403).json({ error: "Sitters can accept, decline, or complete bookings" });
  }

  booking.status = status;
  await booking.save();

  res.json(await enrichBooking(booking));
});

module.exports = router;

