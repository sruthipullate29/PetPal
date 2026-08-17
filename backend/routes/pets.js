const express = require("express");
const { v4: uuidv4 } = require("uuid");
const { isMongo, readDb, updateDb } = require("../db");
const Pet = require("../models/Pet");
const { authMiddleware, requireRole } = require("../middleware/auth");

const router = express.Router();

router.use(authMiddleware, requireRole("owner"));

router.get("/", async (req, res, next) => {
  try {
    if (isMongo()) {
      const pets = await Pet.find({ ownerId: req.user.id }).sort({ createdAt: -1 });
      return res.json(pets);
    }

    const db = readDb();
    const pets = db.pets.filter((p) => p.ownerId === req.user.id);
    return res.json(pets);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const { name, type, breed, age, notes } = req.body;
    if (!name || !type) {
      return res.status(400).json({ error: "Name and type are required" });
    }

    if (isMongo()) {
      const pet = await Pet.create({
        ownerId: req.user.id,
        name: name.trim(),
        type,
        breed: breed ? breed.trim() : "",
        age: age ? age.trim() : "",
        notes: notes ? notes.trim() : "",
      });
      return res.status(201).json(pet);
    }

    // JSON Fallback
    const pet = {
      id: uuidv4(),
      ownerId: req.user.id,
      name: name.trim(),
      type,
      breed: breed || "",
      age: age || "",
      notes: notes || "",
      createdAt: new Date().toISOString(),
    };

    await updateDb((db) => {
      db.pets.push(pet);
    });

    return res.status(201).json(pet);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const { name, type, breed, age, notes } = req.body;

    if (isMongo()) {
      const pet = await Pet.findOne({ _id: req.params.id, ownerId: req.user.id });
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      if (name !== undefined) pet.name = name.trim();
      if (type !== undefined) pet.type = type;
      if (breed !== undefined) pet.breed = breed.trim();
      if (age !== undefined) pet.age = age.trim();
      if (notes !== undefined) pet.notes = notes.trim();

      await pet.save();
      return res.json(pet);
    }

    // JSON Fallback
    const db = readDb();
    const index = db.pets.findIndex((p) => p.id === req.params.id && p.ownerId === req.user.id);
    if (index === -1) {
      return res.status(404).json({ error: "Pet not found" });
    }

    const updated = {
      ...db.pets[index],
      name: name !== undefined ? name : db.pets[index].name,
      type: type !== undefined ? type : db.pets[index].type,
      breed: breed !== undefined ? breed : db.pets[index].breed,
      age: age !== undefined ? age : db.pets[index].age,
      notes: notes !== undefined ? notes : db.pets[index].notes,
    };

    await updateDb((db) => {
      const idx = db.pets.findIndex((p) => p.id === req.params.id);
      if (idx !== -1) db.pets[idx] = updated;
    });

    return res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    if (isMongo()) {
      const result = await Pet.deleteOne({ _id: req.params.id, ownerId: req.user.id });
      if (result.deletedCount === 0) {
        return res.status(404).json({ error: "Pet not found" });
      }
      return res.json({ message: "Pet deleted" });
    }

    // JSON Fallback
    const db = readDb();
    const index = db.pets.findIndex((p) => p.id === req.params.id && p.ownerId === req.user.id);
    if (index === -1) {
      return res.status(404).json({ error: "Pet not found" });
    }

    await updateDb((db) => {
      db.pets = db.pets.filter((p) => p.id !== req.params.id);
    });

    return res.json({ message: "Pet deleted" });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
