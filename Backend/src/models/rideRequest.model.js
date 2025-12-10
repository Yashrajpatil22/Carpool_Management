import mongoose from "mongoose";
const LocationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  address: String,
});
const RideRequestSchema = new mongoose.Schema(
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

    pickup_location: LocationSchema,
    drop_location: LocationSchema,

    fare_offered: Number,

    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "cancelled"],
      default: "pending",
    },

    request_time: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("RideRequest", RideRequestSchema);
