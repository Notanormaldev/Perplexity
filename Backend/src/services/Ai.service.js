import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage} from 'langchain'
const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMENI_API
});




export async function generateMessage(message){
  const res = await geminimodel.invoke([
    new HumanMessage(message)
  ]
  )
  return res.text
}
