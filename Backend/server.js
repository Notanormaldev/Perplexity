import 'dotenv/config';
import app from "./src/app.js";
import conntectDB from './src/config/database.js';
import { testai } from './src/services/Ai.service.js';
testai()
conntectDB()
app.listen(3000,()=>{
    console.log('3000 port pe conntected');
    
})