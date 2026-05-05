import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import {HumanMessage, SystemMessage} from 'langchain'

import{ChatMistralAI}  from '@langchain/mistralai'
const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMENI_API
});

const mistralmodel = new ChatMistralAI({
  model:"mistral-small-latest",
  apiKey:process.env.MISTRAL_API
})


export async function generateMessage(message){
  const res = await geminimodel.invoke([
    new HumanMessage(message)
  ]
  )
  return res.text
}
export async function generateChatTitle(message){
    const res = await mistralmodel.invoke([
      new SystemMessage(`you are a helpful assistant that generates a title for a chat conversation based on use message, the title should be short and descriptive of the conversation, and should not contain more than 5 words`),
      new HumanMessage(message)
    ])
    return res.text
}
