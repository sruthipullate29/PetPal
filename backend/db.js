const mongoose = require("mongoose");
require("dotenv").config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petpal";

async function connectDb() {
  await mongoose.connect(MONGODB_URI);
  console.log("MongoDB connected");
}

module.exports = { connectDb, MONGODB_URI };

