import { Router } from "express";
import { authuser } from "../middleware/authuser.js";
import { messageandres } from "../Controllers/Chat.controller.js";



const chatRouter  = Router()
chatRouter.post('/message',authuser,messageandres)


export default chatRouter;