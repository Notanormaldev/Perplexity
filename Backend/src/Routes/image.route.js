import express from "express"

import multer from "multer"

import {
   imageController
}
from "../Controllers/image.controller.js"

const router = express.Router()

const upload = multer({

   dest:"uploads/"
})

router.post(

   "/describe",

   upload.single("image"),

   imageController
)

export default router