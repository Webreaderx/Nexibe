const express= require('express');
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const conversationModel = require("../models/conversation");
const userModel = require("../models/user");

router.post("/",authMiddleware,async (req,res)=>{
    const { receiverId } = req.body;
    
    const userId=req.userId;

    const user= await userModel.findOne({_id:userId});
    try {
        if(!receiverId){
            return res.status(400).json({
                success:false,
                message:"Receiver required"
            })
        }

        let conversation = await conversationModel.findOne({
            participants:{
                $all:[userId,receiverId]
            }
        })
        if(!conversation){
            conversation=await conversationModel.create({
                participants:[userId,receiverId],
                lastMessage:"New"
            })
            const rec= await userModel.findOne({_id:receiverId});
            user.friends.push(conversation._id);
            rec.friends.push(conversation._id);

            await user.save();
            await rec.save();

        }
        return res.status(200).json({
            conversation
        })
        
    } catch (error) {
        
    }

})

router.get("/:conversationId",authMiddleware,async (req,res)=>{
    const conversationId=req.params.conversationId;
    try {
        if(!conversationId){
            return res.status(400).json({
                success:false,
                message:"Conversation Id required"
            })
        }
       
       const conversation = await conversationModel
    .findById(conversationId)
    .populate("participants", "-password");
        if(!conversation){
            return res.status(400).json({
                success:false,
                message:"Conversation not found"
            })
        }

        if (
        !conversation.participants.some(
            (id) => id._id.toString() === req.userId
        )
    ) {
        return res.status(403).json({
            success:false,
            message: "You are not a participant of this conversation"
        });
    }

        return res.status(200).json({
            conversation
        })


    } catch (error) {
        
    }
})




module.exports = router;