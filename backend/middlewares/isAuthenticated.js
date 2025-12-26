import jwt  from "jsonwebtoken";

export const isAuthenticated=async(req,res,next)=>{
try {
    const token=req.cookies.token;
    if(!token){
        return res.status(400).json({
            message:"not authenticated",
            success:false
        })
    }
    const decode =await jwt.verify(token,process.env.SECRET_KEY);
    if(!decode){
        return res.staus(401).json({
            message:"Invalid",
            success:false
        })
    }
    req.id=decode.userId;
    next();
    
} catch (error) {
    console.log(error)
}
}
export default isAuthenticated