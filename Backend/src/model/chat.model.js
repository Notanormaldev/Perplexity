import mongoose from "mongoose";


const chatSchema = mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"users",
        required:[true,'user required']
    },
    title:{
        type:String,
        default:"New Chat",
        required:[true,'title required']
    }
},{
    timestamps:true
})

const chatmodel = mongoose.model('chats',chatSchema)

export default chatmodel