import messagemodel from "../model/message.model.js";
import { generateImageMessage } from "../services/image.service.js";
import { uploadToImageKit } from "../services/imagekit.service.js";

export async function imageController(req, res) {
  try {
    const { chatid } = req.params
    const prompt = req.body.message || "Describe this image"

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" })
    }

    // ✅ Upload image to ImageKit — get persistent CDN URL
    const { url: imageUrl } = await uploadToImageKit(
      req.file.buffer,
      req.file.originalname,
      "/chats/images"
    )

    // USER SAVE — store ImageKit URL (not local path)
    await messagemodel.create({
      chat: chatid,
      role: "user",
      content: prompt,
      file: imageUrl,
      fileType: "image",
    })

    // AI CALL — pass buffer + mimetype directly
    const result = await generateImageMessage(req.file.buffer, req.file.mimetype, prompt)

    // AI SAVE
    await messagemodel.create({
      chat: chatid,
      role: "ai",
      content: result,
      file: null,
      fileType: "text",
    })

    return res.status(200).json({ result })
  } catch (err) {
    console.error('Image describe error:', err)
    return res.status(500).json({
      message: err.message,
    })
  }
}