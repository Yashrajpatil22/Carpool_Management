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
          start_location: {
            ...startLocation,
            geo: {
              type: "Point",
              coordinates: [startLocation.lng, startLocation.lat],
            },
          },
          destination_location: {
            ...destinationLocation,
            geo: {
              type: "Point",
              coordinates: [destinationLocation.lng, destinationLocation.lat],
            },
          },
          start_time: startTime,
          available_seats: availableSeats,
          base_fare: baseFare,
          ride_type: ride_type,
        });

        await ride.save();
        res.json({ message: "Ride created successfully", ride });
    } catch (error) {
        return res.json({ message: "ERROR: " + error })
    }
});

rideOfferingRouter.get("/getrides/my/:userId", async (req, res) => {
    try {
        const { userId } = req.params;

        const rides = await RideOffering.find({ driver_id: userId }).sort({
            createdAt: -1,
        });

        res.json(rides);

    } catch (error) {
        return res.json({ message: "ERROR " + error })
    }
});

rideOfferingRouter.put("/updateride/:rideId", async (req, res) => {
    try {
        const { rideId } = req.params;
        const ride = await RideOffering.findById(rideId);
        if (!ride) {
            return res.status(400).json({ message: "ride not found" });

        }
        const allowedFields = [
            "start_location",
            "destination_location",
            "start_time",
            "available_seats",
            "base_fare",
        ];

        allowedFields.forEach((field) => {
            if (req.body[field] !== undefined) {
                ride[field] = req.body[field];
            }
        });

        await ride.save();
        res.json({ message: "Ride updated succussfully", ride });
    } catch (error) {
        return res.status(400).json({ message: "ERROR " + error })
    }
});

rideOfferingRouter.put("/:rideId/status", async (req, res) => {
    try {
        // const { userId } = req.params;
        const { rideId } = req.params;
        const { status } = req.body;

        const ride = await RideOffering.findById(rideId);
        if (!ride) return res.status(404).send("Ride not found");

        // if (String(ride.driver_id) !== String(userId)) {
        //     return res.status(403).send("Not allowed");
        // }

        ride.status = status;
        await ride.save();

        // Auto reject all pending requests on cancelling ride
        if (status === "cancelled") {
            await RideRequest.updateMany(
                { ride_id: rideId, status: "pending" },
                { status: "rejected" }
            );
        }

        res.json(ride);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

export default rideOfferingRouter;