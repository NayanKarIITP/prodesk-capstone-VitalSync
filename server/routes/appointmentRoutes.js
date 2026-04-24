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

router.put("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: "Not found" });
    }

    // 🔐 Ownership check
    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    appointment.date = req.body.date || appointment.date;
    appointment.time = req.body.time || appointment.time;

    await appointment.save();

    res.json(appointment);

  } catch (err) {
    res.status(500).json({ msg: "Error updating" });
  }
});


// ✅ OPTIONAL: DELETE APPOINTMENT (🔥 bonus feature)
router.delete("/:id", protect, async (req, res) => {
  try {
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ msg: "Not found" });
    }

    // 🔐 Ownership check
    if (appointment.patientId.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Not allowed" });
    }

    await appointment.deleteOne();

    res.json({ msg: "Deleted successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Error deleting" });
  }
});

router.get("/my", protect, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id
    }).populate("doctorId", "name");

    res.json(appointments);

  } catch {
    res.status(500).json({ msg: "Error" });
  }
});

export default router;