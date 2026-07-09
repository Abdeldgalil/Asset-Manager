 import { Router } from "express";
import Groq from "groq-sdk";
import { GenerateStoryBody } from "@workspace/api-zod";

const router = Router();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const SETTINGS = [
  "a floating island above the clouds", "an underwater coral kingdom", "a candy-colored forest",
  "a tiny village inside a giant tree", "a desert of singing sand dunes", "a city built on the back of a giant turtle",
  "a snowy mountain with a secret cave", "a garden where flowers can talk", "an old lighthouse by a glowing sea",
  "a train that travels through the stars",
];

const TWISTS = [
  "a map that redraws itself", "a shy creature who turns out to be the bravest of all",
  "a riddle that must be solved before sunset", "a friendship with someone very unexpected",
  "a lost object that holds a surprising secret", "a storm that reveals a hidden path",
  "a mistake that leads to the best discovery", "a small act of kindness that changes everything",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

router.post("/stories/generate", async (req, res) => {
  const parsed = GenerateStoryBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const { childName, age, storyType, mood, language, characters, length } = parsed.data;
  const isLong = length === "long";

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

  const setting = pick(SETTINGS);
  const twist = pick(TWISTS);

  const systemPrompt = `You are an award-winning children's book author known for vivid imagination, warm humor, and stories that never repeat the same structure twice. You avoid clichés like generic "once upon a time" openings unless it truly fits. Every story you write feels fresh and surprising, with a clear beginning, an engaging middle, and a satisfying end.`;

  const prompt = isLong
    ? `Write a long ${typeMap[storyType] ?? storyType} children's story for a child named ${childName}, aged ${age} years.
${characters ? `Include these characters: ${characters}.` : ""}
Mood: ${moodMap[mood] ?? mood}.
Language: ${langMap[language] ?? language}.
Setting inspiration: ${setting}.
Weave in this story element naturally: ${twist}.
Age-appropriate, rich, imaginative, with vivid sensory descriptions and natural dialogue. Include a meaningful moral lesson that emerges from the plot rather than being stated bluntly.
Format: an original emoji title on the first line (avoid generic titles), then 6-8 detailed paragraphs. Around 500-600 words total.`
    : `Write a short ${typeMap[storyType] ?? storyType} children's story for a child named ${childName}, aged ${age} years.
${characters ? `Include these characters: ${characters}.` : ""}
Mood: ${moodMap[mood] ?? mood}.
Language: ${langMap[language] ?? language}.
Setting inspiration: ${setting}.
Weave in this story element naturally: ${twist}.
Age-appropriate, warm, imaginative. Include a gentle moral lesson that emerges from the plot rather than being stated bluntly.
Format: an original emoji title on the first line (avoid generic titles), then 3-4 short paragraphs. Under 220 words total.`;

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
      max_tokens: isLong ? 2048 : 1024,
      temperature: 1.05,
      top_p: 0.95,
    });

    const story = completion.choices[0]?.message?.content ?? "";
    res.json({ story });
  } catch (err) {
    req.log.error({ err }, "Failed to generate story");
    res.status(500).json({ error: "Failed to generate story. Please try again." });
  }
});

export default router;
