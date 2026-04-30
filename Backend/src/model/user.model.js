import mongoose from "mongoose";
import bcrypt from 'bcryptjs'



const UserSchema = mongoose.Schema({
   username:{
    type:String,
    required:[true,"username required"],
    unique:[true,"username be unique"]
   },
  email:{
    type:String,
    required:[true,"username required"],
    unique:[true,"username be unique"]
   },
    password:{
    type:String,
    required:[true,"username required"],
   },
   verify:{
    type:Boolean,
    default:false
   }
},{
    timestamps:true
})

// UserSchema.pre('save',async function(next){
//     if(!this.isModified('password')) return next();
//     this.password = await bcrypt.hash(this.password,10);
//     next()
// })
UserSchema.pre('save',async function(){
    if(this.isModified('password')){
        this.password = await bcrypt.hash(this.password,10);
       
    }else{
        return 
    }
})


UserSchema.methods.comparepassword =function (userpass){
    return bcrypt.compare(userpass,this.password)
}



const usermodel = mongoose.model('users',UserSchema)

export default usermodel;