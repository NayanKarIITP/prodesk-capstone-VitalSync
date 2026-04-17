// routes/protected.js
import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", protect, (req, res) => {
  res.json({ msg: "Protected data", user: req.user });
});

export default router;