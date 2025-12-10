import mongoose from "mongoose";

const RideAssignmentSchema = new mongoose.Schema(
  {
    ride_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "RideOffering",
      required: true,
    },
    passenger_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    fare_final: Number,

    pickup_order: Number, 

    status: {
      type: String,
      enum: ["upcoming", "picked", "dropped", "completed"],
      default: "upcoming",
    },

    updated_route: { type: Object }, 
  },
  { timestamps: true }
);

export default mongoose.model("RideAssignment", RideAssignmentSchema);
