import mongoose from "mongoose"

const UserSchema= new mongoose.Schema({
username:{type:String, required:true,unique:true},
email:{type:String, required:true,unique:true},
password:{type:String, required:true},
profilePitcure:{type:String, default:''},
bio:{type:String, default:''},
gender:{type:String,enum:['male','female','LGBTQ']},
follower:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
following:[{type:mongoose.Schema.Types.ObjectId,ref:"User"}],
post:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}],
bookmark:[{type:mongoose.Schema.Types.ObjectId,ref:"Post"}]
},{timestamps:true})
export const User =new mongoose.model('User',UserSchema);