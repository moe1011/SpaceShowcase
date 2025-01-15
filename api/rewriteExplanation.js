// pages/api/rewriteExplanation.js

import OpenAI from "openai";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST requests are allowed." });
  }

  // Explanation text from the client
  const { explanation } = req.body;
  if (!explanation || typeof explanation !== "string") {
    return res
      .status(400)
      .json({ error: "A valid 'explanation' string is required." });
  }

  // Make sure you have OPENAI_API_KEY in your environment
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
  if (!OPENAI_API_KEY) {
    return res
      .status(500)
      .json({ error: "Missing OPENAI_API_KEY in environment variables." });
  }

  try {
    const openai = new OpenAI({
      apiKey: OPENAI_API_KEY,
    });

    /**
     * Using the GPT-4o model with an instruction:
     * - Tone: exciting
     * - First-person perspective, identifies as a scientist
     * - Keep it brief (max 300 chars)
     *
     * The user-provided NASA explanation is in `explanation`.
     */
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a brilliant scientist with an enthusiastic personality. " +
            "Rewrite the user's text in first-person but keep it brief and only include important points, speak in an excited tone." +
            "Keep it short and dynamic. Never go over 250 characters."
        },
        {
          role: "user",
          content: explanation
        }
      ],
      // Adjust temperature as you like, e.g. 0.7 for more creativity
      temperature: 0.7
    });

    // Extract the GPT-4o response
    const newText = completion.choices[0].message.content;

    // Return the new, rewritten text to the client
    return res.status(200).json({ newExplanation: newText });
  } catch (error) {
    console.error("Error rewriting explanation:", error);
    return res
      .status(500)
      .json({ error: error.message || "Failed to rewrite explanation." });
  }
}