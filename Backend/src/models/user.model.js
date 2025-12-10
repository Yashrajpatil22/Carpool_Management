import mongoose from "mongoose";

const AddressSchema = new mongoose.Schema({
  lat: Number,
  lng: Number,
});

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },

    source_address: AddressSchema,
    destination_address: AddressSchema,

    toOfficeTime: String, 
    fromOfficeTime: String, 
    workingDays: [String], 

    type: {
      type: String,
      enum: ["driver", "passenger"],
      default: "passenger",
    },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
