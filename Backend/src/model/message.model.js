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
    },
 file: {
  type: String,
  default: null
},

fileType: {
  type: String,
  enum: ["text", "image", "pdf", "document"],
  default: "text"
}
},{
    timestamps:true
})

const messagemodel = mongoose.model('messages',messageschema)
export default messagemodel

