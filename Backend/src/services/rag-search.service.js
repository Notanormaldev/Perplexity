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

            limit:1,

            filter:{

               chat:
             new mongoose.Types.ObjectId(
                  chatid
               )
            }
         }
      }
   ])
   console.log(embedding)
console.log(embedding.length)
console.log(typeof embedding[0])
console.log(result.map(doc=>doc.chunk).join("\n"));

   return result
   .map(doc=>doc.chunk)
   .join("\n")
}