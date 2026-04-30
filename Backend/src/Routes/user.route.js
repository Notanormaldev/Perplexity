import { Router } from "express";
import { login, register, verifyemail } from "../Controllers/Auth.controller.js";
import { LoginValidation, RegisterValidation } from "../Validation/Register.validation.js";


const UserRoute=Router()
UserRoute.post('/register',RegisterValidation,register)
UserRoute.get('/verify-email',verifyemail)
UserRoute.post('/login',LoginValidation,login)



export default UserRoute;