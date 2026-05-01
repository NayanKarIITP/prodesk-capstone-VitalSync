import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const suggestAI = async (req, res) => {
  try {
    console.log("👉 KEY:", process.env.GEMINI_API_KEY);

    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ msg: "Prompt is required" });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-flash-latest",
    });

    const result = await model.generateContent(prompt);

    const reply = result.response.text();

    res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 AI ERROR:", error.message);
    res.status(500).json({
      msg: "AI failed",
      error: error.message,
    });
  }
};