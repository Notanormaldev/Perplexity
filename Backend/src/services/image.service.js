import fs from "fs"

import {
   GoogleGenerativeAI
}
from "@google/generative-ai"

const genAI =
new GoogleGenerativeAI(
   process.env.GEMENI_API
)

export async function describeImage(

   filepath,
   prompt = "Describe this image in detail"

){

   const model =
   genAI.getGenerativeModel({

      model:"gemini-1.5-flash"
   })

   const image = fs.readFileSync(filepath)

   const imagePart = {

      inlineData:{

         data:image.toString("base64"),

         mimeType:"image/png"
      }
   }

   const result =
   await model.generateContent([

      prompt,

      imagePart
   ])

   return result.response.text()
}