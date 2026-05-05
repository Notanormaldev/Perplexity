import { generateChatTitle, generateMessage } from "../services/Ai.service.js"

export async function messageandres(req,res){
    const {message} = req.body
    
    const result = await generateMessage(message)
    const title = await generateChatTitle(message)
    console.log(title);
    
    res.send({
        AImessage:result,
        title
    })

}