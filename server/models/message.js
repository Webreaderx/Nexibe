const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
    {
        conversationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversation",
            required: true
        },

        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "user",
            required: true
        },

        text: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true
    }
);

const message = mongoose.model("message", messageSchema);

module.exports = message;