import express from "express";
import { register, login } from "../controllers/authController.js";
import { loginLimiter } from "../middleware/rateLimiter.js";

const router = express.Router();

// 🔐 REGISTER
router.post("/register", register);

// 🔐 LOGIN (rate limited)
router.post("/login", loginLimiter, login);

export default router;