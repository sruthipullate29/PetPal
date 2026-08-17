const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    sitterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    petId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pet",
      required: true,
    },
    startDate: {
      type: String,
      required: true,
    },
    endDate: {
      type: String,
      required: true,
    },
    serviceType: {
      type: String,
      required: true,
      enum: ["Dog Walking", "Pet Sitting", "Overnight Care", "Drop-in Visit", "Grooming"],
      default: "Pet Sitting",
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "declined", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.ownerId = ret.ownerId ? ret.ownerId.toString() : ret.ownerId;
        ret.sitterId = ret.sitterId ? ret.sitterId.toString() : ret.sitterId;
        ret.petId = ret.petId ? ret.petId.toString() : ret.petId;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Booking", bookingSchema);
