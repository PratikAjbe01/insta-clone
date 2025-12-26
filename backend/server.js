import express, { urlencoded } from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { configDotenv } from "dotenv";
import connectDB from "./utils/db.js";
import UserRouter from "./routes/user.js";
configDotenv();
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(urlencoded({extended:true}))
app.use(cors({
    // origin:"http://localhost:5173",
    // credentials:true
}));
app.get('/',(_,res)=>{
    return res.status(200).json({
        message:"i am coming from 🖥️ server",
        success:"true"
    })
})
app.use("/api/user/v1/",UserRouter);
connectDB();
const PORT=process.env.PORT|| 5000;
app.listen(PORT,()=>{
    console.log(`server 🏃‍♀️🏃‍♀️🏃‍♀️🏃‍♀️ on PORT :${PORT}`)
})