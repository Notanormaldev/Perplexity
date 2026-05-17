import chatmodel from "../model/chat.model.js"
import messagemodel from "../model/message.model.js"
import { generateChatTitle, generateMessage } from "../services/Ai.service.js"
import { extractText } from "../services/file.service.js"
import { uploadToImageKit } from "../services/imagekit.service.js"

export async function messageandres(req, res) {
  try {
    const { message, chatid, model } = req.body

    let chat = null, title = null

    if (!chatid) {
      title = await generateChatTitle(message)
      chat = await chatmodel.create({
        user: req.user.id,
        title: title
      })
    }

    const activeChatId = chatid || chat._id

    //  Determine file type from mimetype
    let fileType = "text"
    if (req.file) {
      if (req.file.mimetype.startsWith("image/")) {
        fileType = "image"
      } else if (req.file.mimetype === "application/pdf") {
        fileType = "pdf"
      } else if (req.file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        fileType = "document"
      } else if (["application/json", "text/plain", "text/csv"].includes(req.file.mimetype)) {
        fileType = "document"
      }
    }

    // Extract text from buffer (no disk read)
    let fileText = ""
    if (req.file && fileType !== "image") {
      if (fileType === "pdf" || fileType === "document") {
        fileText = await extractText(req.file)
      }
      if (!fileText && req.file.mimetype.startsWith("text/")) {
        fileText = req.file.buffer.toString("utf8")
      }
      if (!fileText && req.file.mimetype === "application/json") {
        fileText = req.file.buffer.toString("utf8")
      }
      if (!fileText && req.file.mimetype === "text/csv") {
        fileText = req.file.buffer.toString("utf8")
      }
    }

    //  Upload to ImageKit and get persistent URL
    let filePath = null
    if (req.file) {
      const folder = fileType === "image" ? "/chats/images" : "/chats/documents"
      const { url } = await uploadToImageKit(req.file.buffer, req.file.originalname, folder)
      filePath = url
    }

    // User message save
    await messagemodel.create({
      chat: activeChatId,
      content: message,
      role: 'user',
      file: filePath,
      fileType: fileType
    })

    // Saare messages fetch karo
    const messages = await messagemodel.find({ chat: activeChatId })

    // AI call — image base64 from buffer
    let imageBase64 = null
    let imageMimetype = null

    if (req.file && fileType === "image") {
      imageBase64 = req.file.buffer.toString("base64")
      imageMimetype = req.file.mimetype
    }

    let aiContent
    try {
      aiContent = await generateMessage(messages, activeChatId, imageBase64, imageMimetype, model, fileText)
    } catch (aiErr) {
      console.error("AI generation failed:", aiErr)
      const aiStatus = aiErr.status || aiErr.response?.status || aiErr.statusCode

      if (aiStatus === 429 || aiErr.message?.includes("Too many requests") || aiErr.message?.includes("rate limit")) {
        aiContent = null
        return res.status(429).json({
          message: "Too many requests. Please try again later.",
          error: "RATE_LIMIT_EXCEEDED",
          chat: await chatmodel.findById(activeChatId)
        })
      }

      // For 400 or other AI errors, save a fallback message and return success
      aiContent = "⚠️ Sorry, I couldn't process your request. The AI model returned an error. Please try a different model or rephrase your message."
    }

    const aimessage = await messagemodel.create({
      chat: activeChatId,
      content: aiContent,
      role: "ai",
      file: null,
      fileType: "text"
    })

    res.status(201).json({
      chat: await chatmodel.findById(aimessage.chat),
      aimessage
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: err.message })
  }
}




export async function getchats(req,res){
    const user = req.user

    const chats = await chatmodel.find({user:user.id}).sort({ pinned:-1, updatedAt:-1 })

    res.status(200).json({
        msg:"chats get sucessfully",
        chats
    })
}


export async function getmessages(req,res){
     const {chatid}=req.params  
   
    const chat = await chatmodel.findOne({
        _id:chatid,
        user:req.user.id
    })

    if(!chat){
        return res.status(404).json({
            msg:"chat not found"
        })
    }

    const messages = await messagemodel.find({chat:chatid})

    return res.status(200).json({
        msg:"Message get sucessfully",
        messages
    })
}

export async function deletechat(req,res){
    const {chatid} = req.params

    const chat = await chatmodel.findOneAndDelete({
        _id:chatid,
        user:req.user.id
    })


    await messagemodel.deleteMany({
        chat:chatid
    })

    if(!chat){
        return res.status(404).json({
            msg:"chat not found"
        })
    }

    return res.status(200).json({
        msg:"delete chat sucessfully"
    })
}

export async function togglePinChat(req, res) {
  try {
    const { chatid } = req.params
    const chat = await chatmodel.findOne({ _id: chatid, user: req.user.id })
    if (!chat) {
      return res.status(404).json({ msg: "chat not found" })
    }
    chat.pinned = !chat.pinned
    await chat.save()
    return res.status(200).json({ msg: "pin updated", chat })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ msg: err.message })
  }
}
