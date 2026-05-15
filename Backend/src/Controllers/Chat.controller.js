import fs from "fs"
import chatmodel from "../model/chat.model.js"
import messagemodel from "../model/message.model.js"
import { generateChatTitle, generateMessage } from "../services/Ai.service.js"
import { extractText } from "../services/file.service.js"

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

    // ✅ File handle karo properly
    const filePath = req.file ? req.file.path : null
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

    let fileText = ""
    if (req.file && fileType !== "image") {
      if (fileType === "pdf" || fileType === "document") {
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
      fileType: fileType
    })

    // Saare messages fetch karo
    const messages = await messagemodel.find({ chat: activeChatId })

    // ✅ AI call — image base64 bhi bhejo agar file hai
    let imageBase64 = null
    let imageMimetype = null

    if (req.file && fileType === "image") {
      imageBase64 = fs.readFileSync(req.file.path).toString("base64")
      imageMimetype = req.file.mimetype
    }

    const result = await generateMessage(messages, activeChatId, imageBase64, imageMimetype, model, fileText)

    const aimessage = await messagemodel.create({
      chat: activeChatId,
      content: result,
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
    
    // Handle 429 Too Many Requests
    if (err.status === 429 || err.message?.includes("Too many requests")) {
      return res.status(429).json({ 
        message: "Too many requests. Please upgrade your plan or contact support.",
        error: "RATE_LIMIT_EXCEEDED"
      })
    }
    
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
