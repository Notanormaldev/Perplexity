import usermodel from "../model/user.model.js"
import { sendEmail } from "../services/mail.service.js"


export async function register(req,res){

    const {username,email,password} = req.body


    const isuserlareadyexist  = await usermodel.findOne({
        $or:[
            {email},{username}
        ]
    })

    if(isuserlareadyexist){
        return res.status(403).json({
            msg:"already exist",
            err:'already exist',
            sucess:false
        })
    }

    const user= await usermodel.create({email,username,password})

    await sendEmail({
        to:email,
        subject:"welcome to perplexity",
        html:`<h1>welcome ${username} to our app</h1> <p>we are glad to have you here</p> <h2>best regards</h2> <h3>perplexity team</h3>    `
    })

    res.status(200).json({
        msg:"created sucess fully",
        user:user
    })


}