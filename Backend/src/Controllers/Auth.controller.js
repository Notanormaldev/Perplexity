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
    if(!token){
        return res.status(404).json({
            msg:"empty token"
        })
    }

    try {
    const decoded = jwt.verify(token,process.env.JWT)


    const user = await usermodel.findOne({email:decoded.email})


    if(!user){
       return res.status(404).json({
        msg:"user not eixst",
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


      return res.send(html);
    } catch (error) {
        return res.status(409).json({
            msg:"verify email failed",error
        })
    }
}
export async function login(req,res){
  const { email , password} = req.body

 const user  = await usermodel.findOne({
    $or:[{email}]
 })

 if(!user){
    return res.status(400).json({
        msg:"invalid creditnals",
        sucess:false,
        err:"email or pass incorrrect"
    })
 }

 const ispassmatch = await user.comparepassword(password)

  if(!ispassmatch){
    return res.status(400).json({
        msg:"invalid creditnals",
        sucess:false,
        err:"email or pass incorrrect"
    })
 }


 if(!user.verify){
     return res.status(400).json({
        msg:"please verify by email or check your mail-box"
     })
 }
   

 const token = jwt.sign({
    id:user._id,
    username:user.username
 },process.env.JWT)

 res.cookie('token',token)

 res.status(200).json({
    msg:"login sucess",
    user:user
 })





}
export async function getme(req,res){
   const decoded = req.user
//    console.log(decoded);
   

   const user = await usermodel.findById(decoded.id)

   return res.status(200).json({
    msg:"getme",
    user:user
   })
}