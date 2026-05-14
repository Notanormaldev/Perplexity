import fs from "fs";
import OpenAI from "openai";
import "dotenv/config";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,

  baseURL: "https://openrouter.ai/api/v1",
});

export async function generateImageMessage(filepath, prompt = "Describe this image in detail") {

  const image = fs.readFileSync(filepath);
  const base64 = image.toString("base64");

  const response = await client.chat.completions.create({
    model: "openrouter/auto",

    messages: [
      {
        role: "system",
        content: BASE_SYSTEM_PROMPT,
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
              url: `data:image/png;base64,${base64}`,
            },
          },
        ],
      },
    ],
  });

  return response.choices[0].message.content;
}