const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readDb, updateDb } = require("../db");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware);

function enrichBooking(db, booking) {
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

router.get("/", (req, res) => {
  const db = readDb();
  let bookings;

  if (req.user.role === "owner") {
    bookings = db.bookings.filter((b) => b.ownerId === req.user.id);
  } else {
    bookings = db.bookings.filter((b) => b.sitterId === req.user.id);
  }

  res.json(bookings.map((b) => enrichBooking(db, b)));
});

router.post("/", requireRole("owner"), async (req, res) => {
  const { sitterId, petId, startDate, endDate, serviceType, notes } = req.body;

  if (!sitterId || !petId || !startDate || !endDate || !serviceType) {
    return res.status(400).json({ error: "Missing required booking fields" });
  }

  const db = readDb();
  const sitter = db.users.find((u) => u.id === sitterId && u.role === "sitter");
  const pet = db.pets.find((p) => p.id === petId && p.ownerId === req.user.id);

  if (!sitter) return res.status(404).json({ error: "Sitter not found" });
  if (!pet) return res.status(404).json({ error: "Pet not found" });

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

  res.status(201).json(enrichBooking(readDb(), booking));
});

router.patch("/:id/status", async (req, res) => {
  const { status } = req.body;
  const validStatuses = ["pending", "accepted", "declined", "completed", "cancelled"];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  const db = readDb();
  const index = db.bookings.findIndex((b) => b.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: "Booking not found" });
  }

  const booking = db.bookings[index];
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

  await updateDb((db) => {
    const idx = db.bookings.findIndex((b) => b.id === req.params.id);
    if (idx !== -1) db.bookings[idx].status = status;
  });

  const updated = { ...booking, status };
  res.json(enrichBooking(readDb(), updated));
});

module.exports = router;
