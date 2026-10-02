const express= require('express');
const router = express.Router();

const userModel = require("../models/user");
const capitalizeName= require("../utils/Capitilization");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authMiddleware=require("../middleware/authMiddleware");

router.get("/ji",(req,res)=>{
    res.json({
        message:"hello ji"
    })
})

router.post("/register",async (req,res)=>{
    const {name,username,password,email}=req.body;
 
    const arr=["#c8493f","#eda15b","#a9c1ae","#d9435e","#7c9268","#e0596e","#599ce0","#ab60c8"]
    try {
        if(!name || !username ||!password || !email){
            return res.status(400).json({
                success:false,
                message:"All fields are required"
            })
        }
        const user = await userModel.findOne({email:email.toLowerCase()});
        if(user){
           return res.status(409).json({
                success:false,
                message:"User Already exist with this email id"
            })
        }
        const uname= await userModel.findOne({username});
        if(uname){
           return res.status(409).json({
                success:false,
                message:"Choose a different userame"
            })
        }
        const randomNumber = Math.floor(Math.random() * 8);


        const salt =await  bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password,salt);
        
        await userModel.create({
            username,
            name:capitalizeName(name),
            email:email.toLowerCase(),
            password:hash,
            color:arr[randomNumber]
            
        })
       return res.status(200).json({
            success:true,
            message:"User registered successfully"
        })
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
})

router.post('/login',async(req,res)=>{
    const {email,password}=req.body;
    try {
        if(!email || ! password){
           return res.status(400).json({
                success:false,
                message:"Email and Password are required"
            })
        }
        const user = await userModel.findOne({
            $or:[
                {username:email},
                {email:email.toLowerCase()}
            ]
        });
        if(!user){
           return res.status(400).json({
                success:false,
                message:"Email or Password are incorrect"
            }) 
        }
        const check = await bcrypt.compare(password,user.password);
        if(!check){
            return res.status(400).json({
                success:false,
                message:"Email or Password are incorrect"
            })
        }
        const token= jwt.sign({userId:user._id},process.env.JWT_KEY,{ expiresIn: '7d' });
        return res.status(200).json({
            success:true,
            message:"User Logged in Successfully",
            token
        })

        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
})

router.get("/me", authMiddleware, async (req, res) => {
    try {
        const user = await userModel
            .findOne({ _id: req.userId })
            .select("-password")
            .populate({
                path: "friends",
                populate: {
                    path: "participants"
                }
            });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "User not found"
            });
        }

        const userData = user.toObject();

        userData.friends = user.friends.map((conversation) => {
            const conversationData = conversation.toObject();

            conversationData.unreadCount =
                conversation.unreadCounts.get(req.userId) || 0;

            return conversationData;
        });

        return res.status(200).json({
            success: true,
            user: userData
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    }
});





module.exports=router;