const express = require("express");
const Pet = require("../models/Pet");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware, requireRole("owner"));

router.get("/", async (req, res) => {
  const pets = await Pet.find({ ownerId: req.user.id });
  res.json(pets);
});

router.post("/", async (req, res) => {
  const { name, type, breed, age, notes } = req.body;
  if (!name || !type) {
    return res.status(400).json({ error: "Name and type are required" });
  }

  const pet = await Pet.create({
    ownerId: req.user.id,
    name,
    type,
    breed: breed || "",
    age: age || "",
    notes: notes || "",
  });

  res.status(201).json(pet);
});

router.put("/:id", async (req, res) => {
  const pet = await Pet.findOne({ id: req.params.id, ownerId: req.user.id });
  if (!pet) {
    return res.status(404).json({ error: "Pet not found" });
  }

  const { name, type, breed, age, notes } = req.body;
  pet.name = name ?? pet.name;
  pet.type = type ?? pet.type;
  pet.breed = breed ?? pet.breed;
  pet.age = age ?? pet.age;
  pet.notes = notes ?? pet.notes;
  await pet.save();

  res.json(pet);
});

router.delete("/:id", async (req, res) => {
  const pet = await Pet.findOne({ id: req.params.id, ownerId: req.user.id });
  if (!pet) {
    return res.status(404).json({ error: "Pet not found" });
  }

  await pet.deleteOne();
  res.json({ message: "Pet deleted" });
});

module.exports = router;

