// routes/availabilityRoutes.js
import express from "express";
import Availability from "../models/Availability.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { isAvailable } = req.body;

  let record = await Availability.findOne({ doctorId: req.user.id });

  if (record) {
    record.isAvailable = isAvailable;
    await record.save();
  } else {
    await Availability.create({
      doctorId: req.user.id,
      isAvailable
    });
  }

  res.json({ msg: "Updated" });
});

export default router;