import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed." });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ error: "Missing text." });
  }

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  
  try {
    const response = await openai.audio.speech.create({
      model: "tts-1",
      voice: "ash",
      input: text,
    });

    // Set headers for streaming
    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Transfer-Encoding", "chunked"); // ensures chunked streaming

    // Pipe TTS stream to the outgoing response
    response.body.pipe(res);

    // Optional: handle events
    response.body.on("end", () => {
      console.log("TTS stream ended.");
      if (!res.headersSent) {
        res.end();
      }
    });

    response.body.on("error", (err) => {
      console.error("TTS stream error:", err);
      if (!res.headersSent) {
        res.status(500).send("Error streaming audio.");
      }
    });
  } catch (err) {
    console.error("Error generating speech:", err);
    res.status(500).json({ error: "Failed to generate speech." });
  }
}