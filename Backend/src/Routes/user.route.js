import { Router } from "express";
import { getme, login, register, verifyemail } from "../Controllers/Auth.controller.js";
import { LoginValidation, RegisterValidation } from "../Validation/Register.validation.js";
import { authuser } from "../middleware/authuser.js";


const UserRoute=Router()
UserRoute.post('/register',RegisterValidation,register)
UserRoute.get('/verify-email',verifyemail)
UserRoute.post('/login',LoginValidation,login)
UserRoute.get('/get-me',authuser,getme)



export default UserRoute;