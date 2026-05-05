import chatmodel from "../model/chat.model.js"
import messagemodel from "../model/message.model.js"
import { generateChatTitle, generateMessage } from "../services/Ai.service.js"

export async function messageandres(req,res){
    const {message,chatid} = req.body

  let chat =null,title =null;
    if(!chatid){
    title = await generateChatTitle(message)
    chat =await chatmodel.create({
    user:req.user.id,
    title:title
     })
}
    const usermessage =await messagemodel.create({
    chat:chatid || chat._id,
    content:message,
    role:'user'
   })
   const messages = await messagemodel.find({chat:chatid || chat._id})
   //    console.log(messages);
   
   const result = await generateMessage(messages)
  
   const aimessage = await messagemodel.create({
    chat:chatid || chat._id,
    content:result,
    role:"ai"
   })
    
    res.status(201).json({
       messages,
       aimessage
    })

}


export async function getchat(req,res){
    
}