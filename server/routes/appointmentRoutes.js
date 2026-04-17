// routes/appointmentRoutes.js

import express from "express";
import Appointment from "../models/Appointment.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


// ✅ CREATE APPOINTMENT (Patient books)
router.post("/", protect, async (req, res) => {
  try {
    const { doctorId, date, time } = req.body;

    if (!doctorId || !date || !time) {
      return res.status(400).json({ msg: "All fields required" });
    }

    const newAppointment = await Appointment.create({
      patientId: req.user.id,   // from JWT 🔥
      doctorId,
      date,
      time,
      status: "scheduled"
    });

    res.json(newAppointment);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating appointment" });
  }
});


// ✅ GET APPOINTMENTS (with names)
router.get("/", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("doctorId", "name")
      .populate("patientId", "name");

    res.json(appointments);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching appointments" });
  }
});


// ✅ OPTIONAL: DELETE APPOINTMENT (🔥 bonus feature)
router.delete("/:id", protect, async (req, res) => {
  try {
    await Appointment.findByIdAndDelete(req.params.id);
    res.json({ msg: "Appointment deleted" });

  } catch (err) {
    res.status(500).json({ msg: "Error deleting appointment" });
  }
});

export default router;