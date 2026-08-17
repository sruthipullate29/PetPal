const mongoose = require("mongoose");

const petSchema = new mongoose.Schema(
  {
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: [true, "Pet name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Pet type is required"],
      enum: ["Dog", "Cat", "Bird", "Rabbit", "Other"],
      default: "Dog",
    },
    breed: {
      type: String,
      default: "",
      trim: true,
    },
    age: {
      type: String,
      default: "",
      trim: true,
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.ownerId = ret.ownerId ? ret.ownerId.toString() : ret.ownerId;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("Pet", petSchema);
