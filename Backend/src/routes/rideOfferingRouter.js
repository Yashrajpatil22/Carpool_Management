import express from "express";
// import carModel from "../models/car.model";
import RideOffering from "../models/location.model.js";
import Car from "../models/car.model.js";
const rideOfferingRouter = express.Router();

rideOfferingRouter.post("/createride", async (req, res) => {
    try {
        const { carId, ride_type, startLocation, destinationLocation, startTime, availableSeats, baseFare } = req.body;
        const car = await Car.findById(carId);
        if (!car) {
            return res.status(400).json({ message: "Car did not found" });
        }
        const userId = req.user?.id || req.body.userId;
        if (!userId) return res.status(401).json({ message: "User id not provided or not authenticated" });

        const ride = new RideOffering({
            driver_id: userId,
            car_id: carId,
            start_location: startLocation,
            destination_location: destinationLocation,
            start_time: startTime,
            available_seats: availableSeats,
            base_fare: baseFare,
            ride_type: ride_type
        });

        await ride.save();
        res.json({ message: "Ride created successfully", ride });
    } catch (error) {
        return res.json({ message: "ERROR: " + error })
    }
})

export default rideOfferingRouter;