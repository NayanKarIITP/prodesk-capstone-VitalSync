import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";

const router = express.Router();

//  ZOD VALIDATION
const aiSchema = z.object({
  prompt: z.string().min(5, "Prompt must be at least 5 characters")
});

//  Retry function (handles 503 errors)
async function generateWithRetry(model, prompt, retries = 2) {
  try {
    return await model.generateContent(prompt);
  } catch (err) {
    if (retries > 0) {
      console.log("⏳ Retrying AI request...");
      await new Promise(res => setTimeout(res, 1000));
      return generateWithRetry(model, prompt, retries - 1);
    }
    throw err;
  }
}

//  AI SUGGEST
router.post("/suggest", protect, async (req, res) => {
  try {
    // ✅ VALIDATION
    const parsed = aiSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        msg: parsed.error.errors[0].message
      });
    }

    const { prompt } = parsed.data;


    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    // ✅ Stable model
    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    // ✨ Structured Prompt (IMPORTANT)
    const structuredPrompt = `
Act as a professional AI Health Assistant.

Give a well-structured diet plan using:
- clear headings
- bullet points
- emojis

Sections must include:
1. Core Principles
2. Meal Plan (Breakfast, Lunch, Snack, Dinner)
3. Healthy Snacks
4. Smart Swaps
5. Tips

Keep it short, clean, and app-friendly.

User request: ${prompt}
`;

    // 🤖 Call AI with retry
    const result = await generateWithRetry(model, structuredPrompt);

    const text = result.response.text();

    // ✅ Clean response format
    res.status(200).json({
      success: true,
      result: text
    });

  } catch (err) {
    console.error("🔥 AI ERROR:", err.message);

    res.status(500).json({
      success: false,
      msg: "AI failed",
      error: err.message
    });
  }
});

export default router;