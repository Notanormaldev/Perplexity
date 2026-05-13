import documentmodel from "../model/document.model.js"

import { extractText }
from "../services/file.service.js"

import { chunkText }
from "../services/rag.service.js"

import { createEmbedding }
from "../services/embedding.service.js"

export async function uploadDocument(req,res){

   const file = req.file
   const {chatid} = req.params

   // extract text
   const text = await extractText(file)


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