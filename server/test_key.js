import { GoogleGenerativeAI } from "@google/generative-ai";

// PASTE YOUR ACTUAL KEY HERE
const API_KEY = "Axxx4E";

const genAI = new GoogleGenerativeAI(API_KEY);

async function run() {
  try {
    console.log("Attempting to connect with model: gemini-2.5-flash");

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent("Say hello");

    console.log("✅ SUCCESS! API Response:", result.response.text());
  } catch (error) {
    console.error("❌ ERROR:");
    console.error(error.message);
  }
}

run();