import { Router } from "express";
import { deleteaccount, getme, login, logout, register, verifyemail } from "../Controllers/Auth.controller.js";
import { LoginValidation, RegisterValidation } from "../Validation/Register.validation.js";
import { authuser } from "../middleware/authuser.js";


const UserRoute=Router()
UserRoute.post('/register',RegisterValidation,register)
UserRoute.get('/verify-email',verifyemail)
UserRoute.post('/login',LoginValidation,login)
UserRoute.get('/get-me',authuser,getme)
UserRoute.post('/logout',authuser,logout)
UserRoute.delete('/delete',authuser,deleteaccount)


export default UserRoute;