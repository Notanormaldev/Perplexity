import jwt from 'jsonwebtoken'
import redis from '../config/cache.js'


export async function authuser(req,res,next){
        const token = req.cookies.token
        
      
       

        if(!token){
            return res.status(404).json({
                msg:"empty token",
                sucess:false
            })
        }

        const istokenblacklisted = await redis.get(token)

        if(istokenblacklisted){
            return res.status(200).json({
                msg:"already logout"
            })
        }

       try {
        
        const decoded = jwt.verify(token,process.env.JWT)
        req.user = decoded
        next()
       } catch (error) {
        res.status(409).json({
            msg:"invalid token",error,
            sucess:false
        })
       }

}