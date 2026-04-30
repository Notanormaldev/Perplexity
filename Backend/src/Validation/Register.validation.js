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
    body('username')
    .notEmpty().withMessage('empty credtinals')
    .isString().withMessage('username in string'),
    body('email')
    .notEmpty().withMessage('empty credtinals')
    .isEmail().withMessage('email not email form'),
    body('password')
    .notEmpty().withMessage('empty credtinals')
    .isLength({min:6,max:12}).withMessage('note 6 to 12'),
    validate
]

export const LoginValidation=[
    body('email')
    .notEmpty().withMessage('empty credtinals')
    .isEmail().withMessage('email not email form'),
    body('password')
    .notEmpty().withMessage('empty credtinals')
    .isLength({min:6,max:12}).withMessage('note 6 to 12'),
    validate
]

