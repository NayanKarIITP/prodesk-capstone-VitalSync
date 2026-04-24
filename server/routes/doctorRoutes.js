// routes/doctorRoutes.js

import express from "express";
import User from "../models/User.js";
import Availability from "../models/Availability.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, async (req, res) => {
  try {
    // ✅ Fetch doctors only with required fields
    const doctors = await User.find({ role: "doctor" }).select("_id name");

    // ✅ Fetch availability
    const availability = await Availability.find();

    // ✅ Convert to map (FASTER lookup 🔥)
    const availabilityMap = {};
    availability.forEach((a) => {
      availabilityMap[a.doctorId.toString()] = a.isAvailable;
    });

    // ✅ Merge data
    const result = doctors.map((doc) => ({
      _id: doc._id,
      name: doc.name,
      // isAvailable: availabilityMap[doc._id.toString()] || false
      isAvailable: true
    }));

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching doctors" });
  }
});

export default router;