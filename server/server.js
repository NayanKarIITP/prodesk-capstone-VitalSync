import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/authRoutes.js";
import doctorRoutes from "./routes/doctorRoutes.js";
import appointmentRoutes from "./routes/appointmentRoutes.js";
import prescriptionRoutes from "./routes/prescriptionRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

dotenv.config();

const app = express();

//  Middlewares
app.use(cors());
app.use(express.json());


//  RATE LIMITERS 

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, try later"
});

// 🤖 AI limiter
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many AI requests, slow down"
});


//  ROUTES

// Apply limiter only where needed
app.use("/api/auth/login", loginLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/payment", paymentRoutes);

// Apply AI limiter
app.use("/api/ai/suggest", aiLimiter);
app.use("/api/ai", aiRoutes);


//  DB 
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch(() => {
    console.error("Database connection failed");
  });


  //  SERVER 
app.listen(5000, () => {
  console.log("Server running on port 5000");
});