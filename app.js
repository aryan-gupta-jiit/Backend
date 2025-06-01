import express from "express";
import mongoose from "mongoose";
import connectDB from "./config/mongodb.js"
import dotenv from "dotenv";
import userRouter from "./routes/UserRoute.js";
dotenv.config();

const app=express()
const PORT=process.env.PORT || 3000;

app.use(express.json())

// connect to db

connectDB()

// user endpoint

app.use('/api/user',userRouter)

// routing - testing

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
})

