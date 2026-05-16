import documentmodel from "../model/document.model.js"
import messagemodel from "../model/message.model.js"

import { extractText }
from "../services/file.service.js"

import { chunkText }
from "../services/rag.service.js"

import { createEmbedding }
from "../services/embedding.service.js"

export async function uploadDocument(req,res){

   const file = req.file
   const {chatid} = req.params

   let text = ""

   if (file.mimetype === "application/pdf" || file.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
     text = await extractText(file)
   } else if (file.mimetype === "application/json") {
     const raw = fs.readFileSync(file.path, "utf8")
     try {
       const parsed = JSON.parse(raw)
       text = JSON.stringify(parsed, null, 2)
     } catch {
       text = raw
     }
   } else if (file.mimetype.startsWith("text/") || file.mimetype === "text/csv") {
     text = fs.readFileSync(file.path, "utf8")
   }

   // save upload as a chat document message so the UI can reflect the action
   await messagemodel.create({
      chat: chatid,
      role: "user",
      content: `Uploaded document ${file.originalname}`,
      file: file.path,
      fileType: file.mimetype === "application/pdf" ? "pdf" : "text"
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