import { Router } from "express";
import { GoogleGenAI } from "@google/genai";
import { GenerateStoryBody } from "@workspace/api-zod";

const router = Router();

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

router.post("/stories/generate", async (req, res) => {
  const parsed = GenerateStoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { childName, age, storyType, mood, language, characters } = parsed.data;

  const typeMap: Record<string, string> = {
    adventure: "thrilling adventure",
    educational: "educational",
    custom: "personalized (child is the hero)",
    fantasy: "magical fantasy",
    bedtime: "soothing bedtime",
    funny: "funny and humorous",
  };

  const moodMap: Record<string, string> = {
    happy: "joyful and uplifting",
    calm: "calm and peaceful",
    exciting: "exciting and energetic",
    mysterious: "mysterious and intriguing",
  };

  const langMap: Record<string, string> = {
    en: "English",
    fr: "French",
    ar: "Arabic",
  };

  const prompt = `Write a short ${typeMap[storyType] ?? storyType} children's story for a child named ${childName}, aged ${age} years.
${characters ? `Include these characters: ${characters}.` : ""}
Mood: ${moodMap[mood] ?? mood}.
Language: ${langMap[language] ?? language}.
Age-appropriate, warm, imaginative. Include a gentle moral lesson.
Format: emoji title on first line, then 3-4 short paragraphs. Under 220 words total.`;

  try {
    const response = await genai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const story = response.text ?? "";
    res.json({ story });
  } catch (err) {
    req.log.error({ err }, "Failed to generate story");
    res.status(500).json({ error: "Failed to generate story. Please try again." });
  }
});

export default router;
