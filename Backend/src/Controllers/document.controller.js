import documentmodel from "../model/document.model.js"
import messagemodel from "../model/message.model.js"

import { extractText }
from "../services/file.service.js"

import { chunkText }
from "../services/rag.service.js"

import { createEmbedding }
from "../services/embedding.service.js"

import { uploadToImageKit }
from "../services/imagekit.service.js"

export async function uploadDocument(req,res){

   const file = req.file
   const {chatid} = req.params

   let text = ""

   if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
     text = await extractText(file)
   } else if (file.mimetype === "application/json") {
     try {
       const parsed = JSON.parse(file.buffer.toString("utf8"))
       text = JSON.stringify(parsed, null, 2)
     } catch {
       text = file.buffer.toString("utf8")
     }
   } else if (file.mimetype.startsWith("text/") || file.mimetype === "text/csv") {
     text = file.buffer.toString("utf8")
   }

   // ✅ Upload to ImageKit — store the public URL instead of a local path
   const { url: fileUrl } = await uploadToImageKit(
     file.buffer,
     file.originalname,
     "/chats/documents"
   )

   // save upload as a chat document message so the UI can reflect the action
   await messagemodel.create({
      chat: chatid,
      role: "user",
      content: `Uploaded document ${file.originalname}`,
      file: fileUrl,
      fileType: file.mimetype === "application/pdf" ? "pdf" : "document"
   })

   // chunks
   const chunks = chunkText(text)

   // save all chunks
   for(const chunk of chunks){

      const embedding =
      await createEmbedding(chunk)

      await documentmodel.create({

         chat:chatid,

         chunk,

         embedding
      })
   }

   return res.status(200).json({

      msg:"Document uploaded successfully"
   })
}