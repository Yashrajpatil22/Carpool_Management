import express from "express";
import RoutePoint from "../models/routePoints.model.js";
import RideOffering from "../models/rideOffering.model.js";

const routePointRouter = express.Router();

routePointRouter.post("/:rideId", async (req, res) => {
  try {
    const driverId = req.body.driverId;
    const { rideId } = req.params;
    const { waypoints } = req.body;

    const ride = await RideOffering.findById(rideId);

    if (String(ride.driver_id) !== String(driverId))
      return res.status(403).send("Not allowed");

    await RoutePoint.deleteMany({ ride_id: rideId });

    const docs = waypoints.map((w) => ({
      ride_id: rideId,
      ...w,
    }));

    await RoutePoint.insertMany(docs);

    res.json({ success: true });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

routePointRouter.get("/:rideId", async (req, res) => {
  try {
    // const userId = req.body;
    const { rideId } = req.params;

    const points = await RoutePoint.find({ ride_id: rideId }).sort(
      "sequence_number"
    );

    res.json(points);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

export default router;