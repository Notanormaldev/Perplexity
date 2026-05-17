import 'dotenv/config';
import app from "./src/app.js";
import conntectDB from './src/config/database.js';
import http from 'http';
import { initsocket } from './src/sockets/server.socket.js';

const httpserver = http.createServer(app)

initsocket(httpserver)


// import { testai } from './src/services/Ai.service.js';
// testai()

conntectDB()
const PORT = process.env.PORT || 3000;

httpserver.listen(PORT,()=>{
    console.log(' port  conntected');
    
})