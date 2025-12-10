import express from "express";
import RideAssignment from "../models/rideAssignment.model.js";
import RideOffering from "../models/rideOffering.model.js";

const rideAssignmentRouter = express.Router();

// driver => view assigned passengers
rideAssignmentRouter.get("/ride/:rideId", async (req, res) => {
    try {
        const driverId = req.headers["user-id"];
        const { rideId } = req.params;

        const ride = await RideOffering.findById(rideId);

        if (String(ride.driver_id) !== String(driverId))
            return res.status(403).send("Not allowed");

        const assignments = await RideAssignment.find({ ride_id: rideId }).populate(
            "passenger_id"
        );

        res.json(assignments);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// DRIVER =>update passenger status (picked / dropped)
rideAssignmentRouter.put("/:assignmentId/status", async (req, res) => {
    try {
        const driverId = req.headers["user-id"];
        const { assignmentId } = req.params;

        const assignment = await RideAssignment.findById(assignmentId);
        const ride = await RideOffering.findById(assignment.ride_id);

        if (String(ride.driver_id) !== String(driverId))
            return res.status(403).send("Not allowed");

        assignment.status = req.body.status;
        await assignment.save();

        res.json(assignment);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

// DRIVER => update route for assignment
rideAssignmentRouter.put("/:assignmentId/route", async (req, res) => {
    try {
        const driverId = req.headers["user-id"];
        const { assignmentId } = req.params;

        const assignment = await RideAssignment.findById(assignmentId);
        const ride = await RideOffering.findById(assignment.ride_id);

        if (String(ride.driver_id) !== String(driverId))
            return res.status(403).send("Not allowed");

        assignment.updated_route = req.body.updated_route;
        await assignment.save();

        res.json(assignment);
    } catch (err) {
        res.status(500).send("Server error");
    }
});

export default rideAssignmentRouter;
