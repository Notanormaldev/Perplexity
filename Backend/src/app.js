import express from 'express'
import cookie from 'cookie-parser'
import UserRoute from './Routes/user.route.js'
import morgan from 'morgan'
import cors from 'cors'
import chatRouter from './Routes/chat.route.js'
import path from 'path'
const app = express()
app.use(cors({
    origin:"https://zerio-ai.onrender.com",
    credentials:true,
    methods:['GET','POST','DELETE','PUT'],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

app.use(express.json())
// app.use(express.static('./public'))
app.use(cookie())
app.use(morgan('dev'))



app.use('/api/auth',UserRoute)
app.use('/api/chats',chatRouter)

// app.use('*name',(req,res)=>{
//     res.sendFile(path.join(__dirname , ".." , './public/index.html'))

// })

export default app;