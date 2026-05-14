import {
   describeImage
}
from "../services/image-ai.service.js"

export async function imageController(

   req,
   res

){

   const result =
   await describeImage(

      req.file.path
   )

   return res.status(200).json({

      result
   })
}