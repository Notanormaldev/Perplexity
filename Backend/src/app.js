import express from 'express'
import cookie from 'cookie-parser'
import UserRoute from './Routes/user.route.js'
import morgan from 'morgan'
import cors from 'cors'


const app = express()
app.use(express.json())
app.use(cookie())
app.use(morgan('dev'))


app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    methods:['GET','POST','DELETE','PUT']
}))
app.use('/api/auth',UserRoute)


export default app;