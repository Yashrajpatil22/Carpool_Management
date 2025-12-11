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

//passenger => view requests
rideRequestRouter.get("/viewrequest", async (req, res) => {
    try {
        const passengerId = req.headers["user-id"];

        const requests = await RideRequest.find({
            passenger_id: passengerId,
        }).populate("ride_id");

        res.json(requests);
    } catch (err) {
        res.status(500).send("Server error");
    }
});


//driver => view request for a ride
rideRequestRouter.get("/ride/:rideId", async (req, res) => {
    try {
        const driverId = req.headers["user-id"];
        const { rideId } = req.params;

        const ride = await RideOffering.findById(rideId);
        if (!ride) return res.status(404).send("Ride not found");

        // if (String(ride.driver_id) !== String(driverId))
            // return res.status(403).send("Not allowed");

        const requests = await RideRequest.find({ ride_id: rideId }).populate(
            "passenger_id"
        );

        res.json(requests);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// driver => accept requets //error
rideRequestRouter.put("/:requestId/accept", async (req, res) => {
    try {
        const driverId = req.headers["user-id"];
        const { requestId } = req.params;

        const request = await RideRequest.findById(requestId);
        if (!request) return res.status(404).send("Request not found");

        const ride = await RideOffering.findById(request.ride_id);

        // if (String(ride.driver_id) !== String(driverId))
        //     return res.status(403).send("Not allowed");

        if (ride.available_seats <= 0)
            return res.status(400).send("No seats left");

        request.status = "accepted";
        await request.save();

        const assignment = await RideAssignment.create({
            ride_id: ride._id,
            passenger_id: request.passenger_id,
            fare_final: request.fare_offered || ride.base_fare,
        });

        ride.available_seats--;
        await ride.save();

        res.json({ request, assignment });
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// driver => reject requets //error 
rideRequestRouter.put("/:requestId/reject", async (req, res) => {
    try {
        const driverId = req.headers["user-id"];
        const { requestId } = req.params;

        const request = await RideRequest.findById(requestId);
        const ride = await RideOffering.findById(request.ride_id);

        // if (String(ride.driver_id) !== String(driverId))
        //     return res.status(403).send("Not allowed");

        request.status = "rejected";
        await request.save();

        res.json(request);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// passenger => cancel request
rideRequestRouter.delete("/:requestId", async (req, res) => {
    try {
        const passengerId = req.headers["user-id"];
        const { requestId } = req.params;

        const request = await RideRequest.findById(requestId);
        if (!request) return res.status(404).send("Not found");

        if (String(request.passenger_id) !== String(passengerId))
            return res.status(403).send("Not allowed");

        request.status = "cancelled";
        await request.save();

        res.json(request);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

export default rideRequestRouter;