import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { configDotenv } from "dotenv";
import connectDB from "./utils/db.js";
configDotenv();
const app=express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
connectDB();
const PORT=process.env.PORT|| 5000;
app.listen(PORT,()=>{
    console.log(`server 🏃‍♀️🏃‍♀️🏃‍♀️🏃‍♀️ on PORT :${PORT}`)
})