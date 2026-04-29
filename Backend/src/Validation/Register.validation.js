import { body, validationResult } from "express-validator";


async function validate(req,res,next){
    const results  = validationResult(req)

    if(results.isEmpty()){
       return next()
    }
    res.status(200).json({
        err:results.array()
    })
}



export const RegisterValidation=[
    body('username').isString().withMessage('username in string'),
    body('email').isEmail().withMessage('email not email form'),
    body('password').isLength({min:6,max:12}).withMessage('note 6 to 12'),
    validate
]