const fs = require("fs");
const path = require("path");

const DB_PATH = path.join(__dirname, "data", "db.json");

const DEFAULT_DB = {
  users: [],
  pets: [],
  sitterProfiles: [],
  bookings: [],
};

let writeQueue = Promise.resolve();

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

module.exports = { readDb, writeDb, updateDb, DEFAULT_DB };
