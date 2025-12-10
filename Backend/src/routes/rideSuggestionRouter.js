import express from "express";
import RideOffering from "../models/location.model.js";

const rideSuggestionRouter = express.Router();

rideSuggestionRouter.post("/find", async (req, res) => {
  try {
    const { pickup_location, radius } = req.body;

    if (!pickup_location?.lat || !pickup_location?.lng)
      return res.status(400).json({ error: "pickup_location required" });

    const maxDistance = radius || 5000; // default 5 km

    const rides = await RideOffering.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [pickup_location.lng, pickup_location.lat],
          },
          distanceField: "distance",
          spherical: true,
          maxDistance: maxDistance,
          key: "start_location.geo",
        },
      },
      {
        $match: {
          status: "active",
          available_seats: { $gt: 0 },
        },
      },
      {
        $sort: { distance: 1, start_time: 1 },
      },
      {
        $limit: 20,
      },
    ]);

    res.json({
      total: rides.length,
      rides,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

export default rideSuggestionRouter;
