import mongoose from "mongoose";
import RideTracking from "../models/rideTracking.model.js";
import express from "express";

const rideTrackingRouter = express.Router();

rideTrackingRouter.post("/update", async (req, res) => {
  try {
    const { rideId, lat, lng } = req.body;
    if (!rideId || !lat || !lng)
      return res.status(400).json({ error: "Missing data" });

    await RideTracking.findOneAndUpdate(
      { ride_id: rideId },
      { lat, lng, updatedAt: new Date() },
      { upsert: true }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Live tracking error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

rideTrackingRouter.get("/:rideId", async (req, res) => {
  try {
    const { rideId } = req.params;
    const tracking = await RideTracking.findOne({ ride_id: rideId });
    if (!tracking) return res.status(404).json({ error: "No tracking data" });
    res.json({
      lat: tracking.lat,
      lng: tracking.lng,
      updatedAt: tracking.updatedAt,
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

export default rideTrackingRouter;
