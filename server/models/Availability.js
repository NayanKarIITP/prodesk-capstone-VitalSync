// models/Availability.js
import mongoose from "mongoose";

const availabilitySchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  isAvailable: Boolean
});

export default mongoose.model("Availability", availabilitySchema);