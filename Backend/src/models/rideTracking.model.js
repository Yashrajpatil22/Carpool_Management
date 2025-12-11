import mongoose from "mongoose";

const RideTrackingSchema = new mongoose.Schema(
  {
    ride_id: { type: mongoose.Schema.Types.ObjectId, ref: "Ride", required: true },
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);
export default mongoose.model("RideTracking", RideTrackingSchema);