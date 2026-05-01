import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts, try later"
});

export const aiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: "Too many AI requests, slow down"
});