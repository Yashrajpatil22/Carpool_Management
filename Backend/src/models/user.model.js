import mongoose from "mongoose";

const LocationSchema = new mongoose.Schema({
  address: String,
  lat: Number,
  lng: Number,
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },

    home_address: LocationSchema,
    work_address: LocationSchema,

    toOfficeTime: String, 
    fromOfficeTime: String, 
    workingDays: [String], 

    type: {
      type: String,
      enum: ["driver", "passenger", "admin"],
      default: "passenger",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
