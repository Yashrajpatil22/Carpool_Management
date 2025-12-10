import mongoose from "mongoose";
const RoutePointSchema = new mongoose.Schema(
  {
    ride_id: { type: mongoose.Schema.Types.ObjectId, ref: "RideOffering" },

    lat: Number,
    lng: Number,

    sequence_number: Number,
    type: { type: String, enum: ["start", "pickup", "drop", "end"] },
  },
  { timestamps: true }
);

export default mongoose.model("RoutePoints", RoutePointSchema);
