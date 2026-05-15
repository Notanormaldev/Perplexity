import { Router } from "express";
import { authuser } from "../middleware/authuser.js";
import { deletechat, getchats, getmessages, messageandres, togglePinChat } from "../Controllers/Chat.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadDocument } from "../Controllers/document.controller.js";
import { imageController } from "../Controllers/image.controller.js";
import { generateMessageStream, getAvailableModels } from "../services/Ai.service.js"
import fs from "fs"
const chatRouter = Router()


chatRouter.post('/message', authuser, upload.single('file'), messageandres)
chatRouter.get('/', authuser, getchats)
chatRouter.get('/messages/:chatid', authuser, getmessages)
chatRouter.get('/models', authuser, (req, res) => {
  res.json({ models: getAvailableModels() })
})
chatRouter.delete('/delete/:chatid', authuser, deletechat)
chatRouter.patch('/pin/:chatid', authuser, togglePinChat)
chatRouter.post('/upload/:chatid', authuser, upload.single('file'), uploadDocument)
chatRouter.post("/image/describe/:chatid", authuser, upload.single("file"), imageController)

// ✅ Streaming image description route
chatRouter.post('/image/describe/stream/:chatid', authuser, upload.single('file'), async (req, res) => {
  try {
    const { chatid } = req.params
    const { message } = req.body

    if (!req.file) {
      return res.status(400).json({ message: "Image file is required" })
    }

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()

    const messagemodel = (await import("../model/message.model.js")).default

    // User message save with image
    await messagemodel.create({
      chat: chatid,
      role: "user",
      content: message || "Describe this image",
      file: req.file.path,
      fileType: "image",
    })

    // Stream the AI response
    const { generateImageMessage } = await import("../services/image.service.js")
    const result = await generateImageMessage(req.file.path, message || "Describe this image in detail")

    // For now, send the complete result (we can make it truly streaming later)
    res.write(`data: ${JSON.stringify({ text: result, done: true })}\n\n`)

    // AI message save
    await messagemodel.create({
      chat: chatid,
      role: "ai",
      content: result,
      file: null,
      fileType: "text",
    })

    res.end()
  } catch (err) {
    console.error('Image describe stream error:', err)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})


// ✅ Streaming route — add karo existing routes ke saath
chatRouter.post('/message/stream', authuser, upload.single('file'), async (req, res) => {
  try {
    const { message, chatid, model = "gemini" } = req.body

    // SSE headers
    res.setHeader("Content-Type", "text/event-stream")
    res.setHeader("Cache-Control", "no-cache")
    res.setHeader("Connection", "keep-alive")
    res.flushHeaders()

    let chat = null
    if (!chatid) {
      const { generateChatTitle } = await import("../services/Ai.service.js")
      const title = await generateChatTitle(message)
      const chatmodel = (await import("../model/chat.model.js")).default
      chat = await chatmodel.create({ user: req.user.id, title })
    }

    const activeChatId = chatid || chat._id
    const messagemodel = (await import("../model/message.model.js")).default

    // File handle
    const filePath = req.file ? req.file.path : null
    const fileType = req.file
      ? req.file.mimetype.startsWith("image/") ? "image"
      : req.file.mimetype === "application/pdf" ? "pdf"
      : req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ? "document"
      : ["application/json", "text/plain", "text/csv"].includes(req.file.mimetype) ? "document"
      : "text"
      : "text"

    let fileText = ""
    if (req.file && fileType !== "image") {
      if (fileType === "pdf" || fileType === "document") {
        const { extractText } = await import("../services/file.service.js")
        fileText = await extractText(req.file)
      }
      if (!fileText && req.file.mimetype.startsWith("text/")) {
        fileText = fs.readFileSync(req.file.path, "utf8")
      }
      if (!fileText && req.file.mimetype === "application/json") {
        fileText = fs.readFileSync(req.file.path, "utf8")
      }
      if (!fileText && req.file.mimetype === "text/csv") {
        fileText = fs.readFileSync(req.file.path, "utf8")
      }
    }

    // User message save
    await messagemodel.create({
      chat: activeChatId,
      content: message,
      role: 'user',
      file: filePath,
      fileType
    })

    const messages = await messagemodel.find({ chat: activeChatId })

    // Image base64
    let imageBase64 = null, imageMimetype = null
    if (req.file && fileType === "image") {
      imageBase64 = fs.readFileSync(req.file.path).toString("base64")
      imageMimetype = req.file.mimetype
    }

    let lastChunk = ""
    let fullResponse = ""

    fullResponse = await generateMessageStream(messages, activeChatId, (chunk) => {
      const newText = chunk.startsWith(lastChunk) ? chunk.slice(lastChunk.length) : chunk
      if (newText) {
        res.write(`data: ${JSON.stringify({ text: newText })}\n\n`)
        lastChunk = chunk
      }
    }, imageBase64, imageMimetype, model, fileText)

    // AI message save
    const chatmodel2 = (await import("../model/chat.model.js")).default
    await messagemodel.create({ chat: activeChatId, content: fullResponse, role: "ai", file: null, fileType: "text" })

    // Chat info bhejo
    res.write(`data: ${JSON.stringify({ done: true, chatId: activeChatId.toString() })}\n\n`)
    res.end()

  } catch (err) {
    console.error(err)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
})
export default chatRouter