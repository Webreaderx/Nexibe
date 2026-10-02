const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },
        username:{
            type:String,
            unique:true
        },

        password: {
            type: String,
            required: true
            
        },
        friends:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: "conversation",
                
        }],
        color:{
            type:String
        }
    },
    {
        timestamps: true
    }
);

const user = mongoose.model("user", userSchema);

module.exports = user;