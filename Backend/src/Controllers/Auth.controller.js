import usermodel from "../model/user.model.js"
import { sendEmail } from "../services/mail.service.js"
import jwt from 'jsonwebtoken'

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



    const emailverifytoken = jwt.sign({
    email:user.email
    },process.env.JWT)




    await sendEmail({
        to:email,
        subject:"welcome to perplexity",
        html:`<h1>Welcome  ${user.username} to perplexity</h1>
        <p>please verify your email by clicking the link below</p>
        <a href="http://localhost:3000/api/auth/verify-email?token=${emailverifytoken}">Verify Email</a>
        <p>best regards</p>
        <p>perplexity team</p>
        `
    })

    res.status(200).json({
        msg:"created sucessfully",
        user:user
    })


}
export async function verifyemail(req,res){
    const token = req.query.token
    

    const decoded = jwt.verify(token,process.env.JWT)


    const user = await usermodel.findOne({email:decoded.email})


    if(!user){
       return res.status(404).json({
        msg:"invalid token",
        sucess:false,
        err:'user not exist'
       })
    }

    user.verify=true

    await user.save()


    const html =  `<h1>Email verified successfully</h1>
    <p>your email has been verified successfully you can now login to your account</p>
    <a href="http://localhost:3000/login">Login</a>
    <p>best regards</p>
    <p>perplexity team</p>
    `


   res.send(html);
}
