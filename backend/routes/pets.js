const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { readDb, updateDb } = require("../db");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware, requireRole("owner"));

router.get("/", (req, res) => {
  const db = readDb();
  const pets = db.pets.filter((p) => p.ownerId === req.user.id);
  res.json(pets);
});

router.post("/", async (req, res) => {
  const { name, type, breed, age, notes } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: "Name and type are required" });
  }

  const pet = {
    id: uuidv4(),
    ownerId: req.user.id,
    name,
    type,
    breed: breed || "",
    age: age || "",
    notes: notes || "",
    createdAt: new Date().toISOString(),
  };

  await updateDb((db) => {
    db.pets.push(pet);
  });

  res.status(201).json(pet);
});

router.put("/:id", async (req, res) => {
  const db = readDb();
  const index = db.pets.findIndex((p) => p.id === req.params.id && p.ownerId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ error: "Pet not found" });
  }

  const { name, type, breed, age, notes } = req.body;
  const updated = {
    ...db.pets[index],
    name: name ?? db.pets[index].name,
    type: type ?? db.pets[index].type,
    breed: breed ?? db.pets[index].breed,
    age: age ?? db.pets[index].age,
    notes: notes ?? db.pets[index].notes,
  };

  await updateDb((db) => {
    const idx = db.pets.findIndex((p) => p.id === req.params.id);
    if (idx !== -1) db.pets[idx] = updated;
  });

  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  const db = readDb();
  const index = db.pets.findIndex((p) => p.id === req.params.id && p.ownerId === req.user.id);
  if (index === -1) {
    return res.status(404).json({ error: "Pet not found" });
  }

  await updateDb((db) => {
    db.pets = db.pets.filter((p) => p.id !== req.params.id);
  });

  res.json({ message: "Pet deleted" });
});

module.exports = router;
