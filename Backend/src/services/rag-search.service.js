import mongoose from "mongoose"

import documentmodel
from "../model/document.model.js"

import { createEmbedding }
from "./embedding.service.js"

export async function searchRelevantChunks(

   chatid,
   question

){

   const embedding =
   await createEmbedding(question)

   const result =
   await documentmodel.aggregate([

      {
         $vectorSearch:{

            index:"vector_index",

            path:"embedding",

            queryVector:embedding,

            numCandidates:50,

            limit:3,

            filter:{

               chat:
               new mongoose.Types.ObjectId(
                  chatid
               )
            }
         }
      }
   ])

   return result
   .map(doc=>doc.chunk)
   .join("\n")
}