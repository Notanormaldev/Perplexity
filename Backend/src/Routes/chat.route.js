import { Router } from "express";
import { authuser } from "../middleware/authuser.js";
import { getchat, messageandres } from "../Controllers/Chat.controller.js";



const chatRouter  = Router()
chatRouter.post('/message',authuser,messageandres)
chatRouter.get('/',authuser,getchat)

export default chatRouter;