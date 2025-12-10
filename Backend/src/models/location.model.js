import mongoose from "mongoose";
const LocationSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
  address: String,
  geo: {
    type: { type: String, enum: ["Point"], default: "Point" },
    coordinates: { type: [Number], default: [0, 0] }, // [lng, lat]
  },
});

const RideOfferingSchema = new mongoose.Schema(
  {
    driver_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    car_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car",
      required: true,
    },

    ride_type: {
      type: String,
      enum: ["to_office", "from_office"],
      required: true,
    },

    start_location: LocationSchema,
    destination_location: LocationSchema,

    start_time: String, 
    available_seats: Number,

    base_fare: Number,

    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
  },
  { timestamps: true }
);
RideOfferingSchema.index({ "start_location.geo": "2dsphere" });

export default mongoose.model("RideOffering", RideOfferingSchema);
