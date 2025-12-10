import mongoose from "mongoose";
const CarSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    model: String,
    company: String,
    plate_number: { type: String, required: true },
    color: String,
    number_of_seats: { type: Number, required: true },
    year_of_manufacture: Number,

    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Car", CarSchema);
