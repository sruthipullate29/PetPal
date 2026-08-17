const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    day: {
      type: String,
      enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      required: true,
    },
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

const sitterProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    bio: {
      type: String,
      default: "",
      trim: true,
    },
    hourlyRate: {
      type: Number,
      required: true,
      default: 25,
      min: [1, "Hourly rate must be greater than 0"],
    },
    services: {
      type: [String],
      default: ["Dog Walking", "Pet Sitting"],
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    availability: {
      type: [availabilitySlotSchema],
      default: [],
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        ret.id = ret._id.toString();
        ret.userId = ret.userId ? ret.userId.toString() : ret.userId;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

module.exports = mongoose.model("SitterProfile", sitterProfileSchema);
