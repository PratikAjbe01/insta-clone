import { User } from "../models/user";
import { Post } from "../models/post";
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
        const hashPassword=await bcrypt.hashPassword(password,10);
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
    const populatePosts=await Promise.all(
        user.posts.map(async(postId)=>{
            const post=await Post.findById(postId);
            if(post.author.equals(user._id)){
                return post;
            }
            return null;
        })
    )
   user={
    _id:user._id,
    username:user.username,
    email:user.email,
    profilePitcure:user.profilePitcure,
    bio:user.bio,
    follower:user.followers,
    following:user.following,
    posts:populatePosts
   }
    return res.cookie('token',token,{
        httpOnly:true,
        sameSite:'strict',
        maxAge:1*24*60*60*100
    }).json({
        message: `Welcome back ${user.username}`,
        success: true,
        user
    })
    } catch (error) {
        console.log(error);
    }
}
