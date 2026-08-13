const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const sitterProfileSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  userId: { type: String, required: true, unique: true },
  bio: { type: String, default: "" },
  hourlyRate: { type: Number, default: 25 },
  services: { type: [String], default: [] },
  location: { type: String, default: "" },
  availability: {
    type: [{ day: String, start: String, end: String }],
    default: [],
  },
});

sitterProfileSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("SitterProfile", sitterProfileSchema);

