// routes/prescriptionRoutes.js
import express from "express";
import Prescription from "../models/Prescription.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const newPres = await Prescription.create({
    ...req.body,
    doctorId: req.user.id
  });

  res.json(newPres);
});

export default router;