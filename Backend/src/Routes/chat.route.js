import { Router } from "express";
import { authuser } from "../middleware/authuser.js";
import { deletechat, getchats, getmessages, messageandres } from "../Controllers/Chat.controller.js";
import { upload } from "../middleware/upload.middleware.js";
import { uploadDocument } from "../Controllers/document.controller.js";



const chatRouter  = Router()
chatRouter.post('/message',authuser,messageandres)
chatRouter.get('/',authuser,getchats)
chatRouter.get('/messages/:chatid',authuser,getmessages)
chatRouter.delete('/delete/:chatid',authuser,deletechat)
chatRouter.post('/upload/:chatid',authuser,upload.single('file'),uploadDocument)


export default chatRouter;