import mongoose from "mongoose";



const messageschema = mongoose.Schema({
    chat:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"chats",
        required:[true , 'chat required']
    },
    content:{
        type:String,
        required:[true, "content required"]
    },
    role:{
        type:String,
        enum:['user','ai'],
        required:[true,"role required"]
    }
},{
    timestamps:true
})

const messagemodel = mongoose.model('me')

