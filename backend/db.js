const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/petpal";
const DB_PATH = path.join(__dirname, "data", "db.json");

const DEFAULT_DB = {
  users: [],
  pets: [],
  sitterProfiles: [],
  bookings: [],
};

let isMongoConnected = false;
let writeQueue = Promise.resolve();

async function connectDatabase() {
  try {
    mongoose.set("strictQuery", false);
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB connected successfully to ${MONGODB_URI}`);
  } catch (err) {
    isMongoConnected = false;
    console.warn(`⚠️ MongoDB connection unavailable (${err.message}). Using JSON file database fallback (${DB_PATH}).`);
  }
}

function ensureDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_DB, null, 2));
  }
}

function readDb() {
  ensureDb();
  const raw = fs.readFileSync(DB_PATH, "utf-8");
  return JSON.parse(raw);
}

function writeDb(data) {
  ensureDb();
  writeQueue = writeQueue.then(() => {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2));
  });
  return writeQueue;
}

async function updateDb(updater) {
  const db = readDb();
  const result = updater(db);
  await writeDb(db);
  return result;
}

function isMongo() {
  return isMongoConnected;
}

module.exports = {
  connectDatabase,
  isMongo,
  readDb,
  writeDb,
  updateDb,
  DEFAULT_DB,
};
