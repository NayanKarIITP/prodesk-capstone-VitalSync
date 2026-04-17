// models/Appointment.js
import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  date: String,
  time: String,
  status: {
    type: String,
    default: "scheduled"
  }
});

export default mongoose.model("Appointment", appointmentSchema);