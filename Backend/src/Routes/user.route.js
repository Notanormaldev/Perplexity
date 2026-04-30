import { Router } from "express";
import { register, verifyemail } from "../Controllers/Auth.controller.js";
import { RegisterValidation } from "../Validation/Register.validation.js";


const UserRoute=Router()
UserRoute.post('/register',RegisterValidation,register)
UserRoute.get('/verify-email',verifyemail)
export default UserRoute;