const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
    {
        participants: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "user",
                required: true
            }
        ],
        lastMessage:{
            type:String
        },
        unreadCounts: {
        type: Map,
        of: Number,
        default: {}
    }
    },
    {
        timestamps: true
    }
);

const conversation = mongoose.model(
    "conversation",
    conversationSchema
);

module.exports = conversation;