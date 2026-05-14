import messagemodel from "../model/message.model.js";

import { generateImageMessage } from "../services/image.service.js";

export async function imageController(req, res) {
  try {
    const { chatid } = req.params;

    const prompt = req.body.message || "Describe this image";

    // USER SAVE
    await messagemodel.create({
      chat: chatid,
      role: "user",
      content: prompt,
      file: req.file.path,
      fileType: "image",
    });

    // AI CALL (SERVICE)
    const result = await generateImageMessage(
      req.file.path,
      prompt
    );

    // AI SAVE
    await messagemodel.create({
      chat: chatid,
      role: "ai",
      content: result,
       file: null,
      fileType: "text",
    });

    return res.status(200).json({ result });

  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
}