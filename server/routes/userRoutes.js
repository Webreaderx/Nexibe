const express= require('express');
const router = express.Router();
const userModel = require("../models/user");
const authMiddleware = require('../middleware/authMiddleware');



router.get("/",authMiddleware, async (req,res)=>{
    try {
        const users = await userModel.find({_id:{
            $ne:req.userId
        }}).select("-password");

        return res.status(200).json({
            users
        })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
    }
    
})


module.exports=router;