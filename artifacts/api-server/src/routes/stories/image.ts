import { Router } from "express";

const router = Router();

router.post("/stories/image", async (req, res) => {
  const prompt = req.body?.prompt;
  if (typeof prompt !== "string" || prompt.trim().length === 0) {
    res.status(400).json({ error: "Invalid request body" });
    return;
  }

  const seed = Math.floor(Math.random() * 1000000);
  const apiKey = process.env.POLLINATIONS_API_KEY;

  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=512&height=512&nologo=true&model=flux&seed=${seed}${apiKey ? `&key=${apiKey}` : ""}`;

  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Pollinations returned ${response.status}`);
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    res.setHeader("Content-Type", "image/jpeg");
    res.send(buffer);
  } catch (err) {
    req.log.error({ err }, "Failed to generate image");
    res.status(500).json({ error: "Failed to generate image" });
  }
});

export default router;
