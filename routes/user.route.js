const express = require("express")
require("dotenv").config()
const {userModel} = require("../model/user.model")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")


const userRouter = express.Router()


userRouter.post("/signup",async(req,res)=>{
    try{
         const {email,password,phone,gender} = req.body
         const existinguser = await userModel.findOne({email})
         if (existinguser){
            return res.status(401).json({msg:"The User are already exist...please try another Email Address"})
            
         } 
         const hashed = await bcrypt.hash(password,10)
         const newuser = await userModel({email,password:hashed,phone,gender})
         await newuser.save()

        //  const token = jwt.sign({userId:newuser._id},process.env.jwt_key , {
        //     expiresIn:"1hr"
        //  })

         res.status(201).json({msg:"User Has been Created Sucessfully..🥳",newuser})

    }
    catch(err){
        console.log(err)
        res.status(501).json({msg:"Something went wrong to Signup the User.."})
    }
})

userRouter.post("/login",async(req,res)=>{
    try{
       const {email,password} = req.body

       const user = await userModel.findOne({email})

       if (!user){
        return res.status(401).json({msg:"user are not found"})
    }
        const convpass = await bcrypt.compare(password,user.password)
        const token = jwt.sign({userId:user._Id},process.env.jwt_key,{
            expiresIn:"5min",
        });
        if (convpass){
            return res.status(201).json({msg:"user are logged",token})
        }else{
            return res.status(401).json({msg:"wrong credentials❌"})
        }
       
    }
    catch(err){
         console.log(err)
         res.status(401).send({msg:"Internal server error"})
    }
})



module.exports = {
    userRouter
}