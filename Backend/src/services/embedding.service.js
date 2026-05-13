import { Mistral }
from "@mistralai/mistralai"

const client = new Mistral({

   apiKey:process.env.MISTRAL_API
})

export async function createEmbedding(text){

   try{

      const response =
      await client.embeddings.create({

         model:"mistral-embed",

         inputs:[text]
      })

      return response.data[0].embedding

   }catch(error){

      console.log(error)

      throw error
   }
}