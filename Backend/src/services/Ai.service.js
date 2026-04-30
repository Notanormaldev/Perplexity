import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMENI_API
});


export async function testai(){
   const res = await model.invoke("where is india?")
   console.log(res.content);
   
}
testai()