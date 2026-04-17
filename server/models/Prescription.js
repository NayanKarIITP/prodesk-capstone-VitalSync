// models/Prescription.js
import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  medication: String,
  dosage: String,
  frequency: String,
  notes: String
});

export default mongoose.model("Prescription", prescriptionSchema);