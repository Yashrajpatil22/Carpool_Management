import express from "express";
import RideOffering from "../models/location.model.js";

const rideDiscoveryRouter = express.Router();

rideDiscoveryRouter.post("/search", async (req, res) => {
  try {
    const { start_location, destination_location, start_time } = req.body;
    const query = { status: "active" };
    if (start_location && start_location.address)
      query["start_location.address"] = start_location.address;
    if (destination_location && destination_location.address)
      query["destination_location.address"] = destination_location.address;
    if (start_time) query.start_time = start_time;
    const rides = await RideOffering.find(query);
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

rideDiscoveryRouter.get("/active", async (req, res) => {
  try {
    const rides = await RideOffering.find({ status: "active" });
    res.status(200).json(rides);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

rideDiscoveryRouter.get("/:rideId", async (req, res) => {
  try {
    const ride = await RideOffering.findById(req.params.rideId);
    if (!ride) return res.status(404).send("Ride not found");
    res.status(200).json(ride);
  } catch (error) {
    res.status(500).send("Server error");
  }
});

export default rideDiscoveryRouter;
