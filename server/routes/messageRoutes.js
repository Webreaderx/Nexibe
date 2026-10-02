const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const conversationModel= require("../models/conversation");
const messageModel=require("../models/message");


router.post("/",authMiddleware,async (req,res)=>{
    const {conversationId,text}=req.body;
    try {
        if(!conversationId || ! text){
            return res.status(400).json({
                success:false,
                message:"conversation id or text require"
            })
        }
        const conversation = await conversationModel.findOne({_id:conversationId});

        if(!conversation.participants.some(
            (id)=>id.toString()===req.userId
        )){
            return res.status(400).json({
                success:false,
                message:"You are not the participants of this conversation"
            })
        }

        const message = await messageModel.create({
            conversationId:conversationId,
            senderId:req.userId,
            text:text
        });

        conversation.lastMessage=text;
        await conversation.save();

        return res.status(200).json({
            successs:true,
            
            message
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
        
    }
})

router.get("/:conversationId",authMiddleware,async(req,res)=>{
    const conversationId=req.params.conversationId;
    try {

        if(!conversationId){
            return res.status(400).json({
                success:false,
                message:"Conversation Id required"
            })
        }

        const conversation = await conversationModel.findOne({_id:conversationId});

        if(!conversation.participants.some(
            (id)=>id.toString()===req.userId
        )){
            return res.status(400),json({
                success:false,
                message:"You are not the participants of this conversation"
            })
        }

        const messages = await messageModel.find({conversationId:conversationId}).sort({createdAt: 1 })

        return res.status(200).json({
            success:true,
            message:"message receiveed successfully",
            messages
        })
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:"Something went wrong"
        })
        
    }
})



module.exports = router;