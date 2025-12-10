import express from "express";
import RideRequest from "../models/rideRequest.model.js";
import RideOffering from "../models/location.model.js";
// import userAuth from "../middleware/auth.js";

const rideRequestRouter = express.Router();
// passenger => creates requests
rideRequestRouter.post("/createrequest", async (req, res) => {
    try {
        const passengerId = req.headers["user-id"];
        const { ride_id, pickup_location, drop_location, fare_offered } = req.body;

        const ride = await RideOffering.findById(ride_id);
        if (!ride) return res.status(404).send("Ride not found");

        if (ride.available_seats <= 0)
            return res.status(400).send("No seats left");

        const existing = await RideRequest.findOne({
            ride_id,
            passenger_id: passengerId,
            status: "pending",
        });

        if (existing) return res.status(400).send("Already requested");

        const request = await RideRequest.create({
            ride_id,
            passenger_id: passengerId,
            pickup_location,
            drop_location,
            fare_offered,
        });


        res.json({ message: "request created successfully", request });
    } catch (error) {
        return res.status(400).json({ message: "ERROR", error: error.message })
    }
})

export default rideRequestRouter;