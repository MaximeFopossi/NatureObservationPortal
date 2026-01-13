require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Observation = require("./models/Observation");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// 1) Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

// 2) Routes

// GET all observations
app.get("/observations", async (req, res) => {
  try {
    const items = await Observation.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch observations" });
  }
});

// POST create new observation
app.post("/observation", async (req, res) => {
  try {
    const { title, latinName, location, date, tags, lat, lng } = req.body;

    const created = await Observation.create({
      title,
      latinName,
      location,
      date,
      tags: Array.isArray(tags) ? tags : [],
      lat: typeof lat === "number" ? lat : null,
      lng: typeof lng === "number" ? lng : null,
    });

    res.json({ status: "ok", observation: created });
  } catch (err) {
    res.status(400).json({ error: err.message || "Create failed" });
  }
});

// GET one observation by id
app.get("/observation/:id", async (req, res) => {
  try {
    const item = await Observation.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

// DELETE one observation by id
app.delete("/observation/:id", async (req, res) => {
  try {
    const deleted = await Observation.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Not found" });
    res.json({ status: "ok", deleted });
  } catch (err) {
    res.status(400).json({ error: "Invalid id" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});