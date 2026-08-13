const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const petSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  ownerId: { type: String, required: true },
  name: { type: String, required: true },
  type: { type: String, required: true },
  breed: { type: String, default: "" },
  age: { type: String, default: "" },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

petSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Pet", petSchema);

