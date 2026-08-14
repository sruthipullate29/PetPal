const express = require("express");
const cors = require("cors");
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

app.use((_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
  console.log(`PetPal API running on http://localhost:${PORT}`);
});
