import { User } from "../models/user.js";
import { Post } from "../models/post.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
export const register=async(req,res)=>{
    try {
        const {username,email,password}=req.body;
        if(!username||!email||!password){
            return res.status(401).json({
                message:"all fields requiered",
                success:false
            })
        }
        const user= await User.findOne({email});
        if(user){
            return res.status(401).json({
                message:"this email is already used",
                success:false
            })
        }
        const hashPassword=await bcrypt.hash(password,10);
        await User.create({
            username,
            email,
            password:hashPassword
        })
        return res.status(201).json({
            message:"Account created succesfully",
            success:true
        })
    } catch (error) {
        return res.status(500).json({
            message:error.message,
            success:false
        })
    }
}

export const login=async(req,res)=>{
    try {
        const {email,password}=req.body;
        if(!email||!password){
            return res.status(400).json({
                message:"all fields requiered",
                success:false
            })
        }
        const user=await User.findOne({email});
        if(!user){
            return res.status(400).json({
                message:"No account found with this 📩",
                success:false
            })
        }
        const isPassMatch=await bcrypt.compare(password,user.password)
        if(!isPassMatch){
            return res.status(400).json({
                message:"either 📩 or 🔑 is wrong",
                success:false
            })
        }
    const token=await jwt.sign({userId:user._id},process.env.SECRET_KEY,{expiresIn:"1d"});
    // const populatePosts=await Promise.all(
    //     user.posts.map(async(postId)=>{
    //         const post=await Post.findById(postId);
    //         if(post.author.equals(user._id)){
    //             return post;
    //         }
    //         return null;
    //     })
    // )
   const safeuser={
    _id:user._id,
    username:user.username,
    email:user.email,
    profilePitcure:user.profilePitcure,
    bio:user.bio,
    followers:user.followers,
    following:user.following,
    // posts:populatePosts
   }
    return res.cookie('token',token,{
        httpOnly:true,
        sameSite:'strict',
        maxAge:1*24*60*60*100
    }).json({
        message: `Welcome back ${user.username}`,
        success: true,
        safeuser
    })
    } catch (error) {
        console.log(error);
    }
}

export const logout =async(req,res)=>{
    try {
        
        return res.cookie("token","",{maxAge:0}).json({
            message:'Logged out successfully',
            success:true
        })
    } catch (error) {
        console.log(error)
    }
}

export const getProfile=async(req,res)=>{
    try {
        const userId=req.params.id
        let user =await User.findById(userId).populate({path:'posts',createdAt:-1}).populate('bookmarks').select("-password");
   return res.status(200).json({
    user,
    success:true
   })

        
    } catch (error) {
        console.log(error)
    }
}

export const editProfile=async(req,res)=>{
    try {
        const userId=req.id
        const {bio,gender}=req.body
        const profilePicture=req.file
        let cloudResponse;
        if(profilePicture){
            const fileUri=getDataUri(profilePicture)
            cloudResponse=await cloudinary.uploader.upload(fileUri)
        }
        const user=await User.findById(userId).select("-password")
        if(!user){
            return res.status(400).json({
                message:"User not found",
                success:true
            })
        }

        if(bio)user.bio=bio;
        if(gender)user.gender=gender;
        if(profilePicture)user.profilePicture=cloudResponse.secure_url;
        await user.save();
        return res.status(200).json({
            message:"Profile updated",
            success:true,
            user
        })
    } catch (error) {
        console.log(error)
    }
}

export const getSuggestedUser=async(req,res)=>{
  try {
    const suggestedUses=await User.find({_id:{$ne:req.id}}).select("-password")
    if(!suggestedUses){
        return res.status(400).json({
            message:"Currently do not have any user"
        })
    }
    return res.status(200).json({
        success:true,
        users:suggestedUses
    })
    
  } catch (error) {
    console.log(error)
  }
}

export const followOrUnfollow=async(req,res)=>{
  try {
    const followKarnewalla=req.id;
    const jiskofollowkarunga=req.params.id;
    if(followKarnewalla==jiskofollowkarunga){
        return res.status(400).json({
            message:'apne aap ko follow karega',
            success:false
        })
    }
    const user =await User.findById(followKarnewalla);
    const targetUser=await User.findById(jiskofollowkarunga);
    if(!user||!jiskofollowkarunga){
        return res.status(400).json({
            message:'user not found',
            success:false
        })
    }
    const isFollowing=user.following.includes(jiskofollowkarunga)
    if(isFollowing){
        await Promise.all([
            User.updateOne({_id:followKarnewalla},{$pull:{following:jiskofollowkarunga}}),
            User.updateOne({_id:jiskofollowkarunga},{$pull:{followers:followKarnewalla}})
        ])
        return res.status(200).json({
            message:'Unfollowed successfully',
            success:true
        })
    }else{
        await Promise.all([
            User.updateOne({_id:followKarnewalla},{$push:{following:jiskofollowkarunga}}),
            User.updateOne({_id:jiskofollowkarunga},{$push:{followers:followKarnewalla}})
        ])
        return res.status(200).json({
            message:'followed successfully',
            success:true
    })
}

  } catch (error) {
    console.log(error)
  }
}
