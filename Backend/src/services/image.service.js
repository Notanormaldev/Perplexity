import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

const IMAGE_SYSTEM_PROMPT = `You are an AI assistant that describes images clearly and concisely. Use the image content to answer the user's prompt and avoid making unsupported assumptions.`

// ✅ Now accepts buffer directly (from multer memoryStorage) instead of file path
export async function generateImageMessage(buffer, mimetype, prompt = "Describe this image in detail") {
  if (!buffer) {
    throw new Error('No image buffer provided')
  }

  const base64 = buffer.toString("base64")

  const response = await client.chat.completions.create({
    model: "openrouter/auto",
    messages: [
      {
        role: "system",
        content: IMAGE_SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: prompt,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimetype};base64,${base64}`,
            },
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
}