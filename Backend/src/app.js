import express from 'express'
import cookie from 'cookie-parser'
import UserRoute from './Routes/user.route.js'




const app = express()
app.use(express.json())
app.use(cookie())
app.use('/api/auth',UserRoute)


export default app;