const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const { connectDb } = require("./db");
const authRoutes = require("./routes/auth");
const petsRoutes = require("./routes/pets");
const sittersRoutes = require("./routes/sitters");
const bookingsRoutes = require("./routes/bookings");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", message: "PetPal API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/pets", petsRoutes);
app.use("/api/sitters", sittersRoutes);
app.use("/api/bookings", bookingsRoutes);

// Serve the built React frontend in production
const distPath = path.join(__dirname, "..", "Frontend", "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  // SPA fallback: serve index.html for any non-API routes
  app.get(/^(?!\/api).*/, (_req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

async function start() {
  try {
    await connectDb();
    app.listen(PORT, () => {
      console.log(`PetPal API running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}




start();
