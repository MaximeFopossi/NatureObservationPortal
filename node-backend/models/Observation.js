const mongoose = require("mongoose");

const ObservationSchema = new mongoose.Schema(
    {
        title: { type: String, required: true, trim: true },
        latinName: { type: String, required: true, trim: true },
        location: { type: String, required: true, trim: true },
        date: { type: String, required: true }, // keep string like "2026-01-13"
        tags: { type: [String], default: [] },
        lat: { type: Number, default: null },
        lng: { type: Number, default: null },
    },
    { timestamps: true } // adds createdAt/updatedAt automatically
);

module.exports = mongoose.model("Observation", ObservationSchema);