import userModel from "../models/User.js";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const createToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET);
  }

// route for user login

const loginUser=async(req,res)=>{
    try {
        const {email,password}=req.body;
        const user=await userModel.findOne({email});
        if(!user){
            return res.json({success:false,message:"User doesn't exists"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(isMatch){
            const token=createToken(user._id);
            res.json({success:true,token})
        }
        else{
            return res.json({success:false,message:"Invalid password"})
        }
    } catch (error) {
        console.log(error)
    }
    
}

// route for user registration

const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // checking existing user
        const exists = await userModel.findOne({ email })

        if (exists) {
            return res.json({ success: false, message: "User already exists" });
        }

        // validation email format and strong password
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please Enter a valid email" })
        }
        if (password.length < 8) {
            return res.json({ success: false, message: "Please Enter strong password" })
        }

        // salting hashed password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // creating new user
        const newUser = new userModel({
            name,
            email,
            password: hashedPassword,
        })
        // saving new user
        const user = await newUser.save()

        const token=createToken(user._id);

        res.json({success:true,token});

    } catch (error) {
        console.log(error);
    }
}

export { registerUser,loginUser };