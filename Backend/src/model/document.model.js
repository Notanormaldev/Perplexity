import mongoose from "mongoose"

const documentSchema = new mongoose.Schema({

   chat:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"chat"
   },

   chunk:{
      type:String
   },

   embedding:{
      type:[Number]
   }

})

export default mongoose.model(
   "document",
   documentSchema
)