import { Router } from "express";
import { register } from "../Controllers/Auth.controller.js";
import { RegisterValidation } from "../Validation/Register.validation.js";


const UserRoute=Router()
UserRoute.post('/register',RegisterValidation,register)

export default UserRoute;