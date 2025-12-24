import mongoose from "mongoose"
const postSchema=new mongoose.Schema({
    captaion:{type:String,default:''},
    image:{type:String,required:true},
    author:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    likes:[{types:mongoose.Schema.Types.ObjectId,ref:"User"}],
    comment:[{types:mongoose.Schema.Types.ObjectId,ref:"User"}]
})
export const Post= mongoose.model('Post',postSchema);