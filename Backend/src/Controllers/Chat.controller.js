import { generateMessage } from "../services/Ai.service.js"

export async function messageandres(req,res){
    const {message} = req.body
    
    const result = await generateMessage(message)

    res.send({
        AImessage:result
    })

}