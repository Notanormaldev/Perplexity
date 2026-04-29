import mongoose from "mongoose";


async function conntectDB() {
    mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("DATABASE CONNTECTED");

    })
    
}

export default conntectDB;