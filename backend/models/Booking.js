const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const BOOKING_STATUSES = ["pending", "accepted", "declined", "completed", "cancelled"];

const bookingSchema = new mongoose.Schema({
  id: { type: String, default: uuidv4, unique: true },
  ownerId: { type: String, required: true },
  sitterId: { type: String, required: true },
  petId: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  serviceType: { type: String, required: true },
  notes: { type: String, default: "" },
  status: { type: String, enum: BOOKING_STATUSES, default: "pending" },
  createdAt: { type: Date, default: Date.now },
});

bookingSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

module.exports = mongoose.model("Booking", bookingSchema);

