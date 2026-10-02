require('dotenv').config();
const express = require('express');
const app = express();
const connnectDB = require('./config/db');
const cors = require('cors');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const conversationRouter = require("./routes/conversationRoutes");
const messageRouter = require("./routes/messageRoutes");
const jwt = require("jsonwebtoken");
const http = require('http');
const { Server } = require("socket.io");
const conversationModel = require('./models/conversation');
const messageModel = require("./models/message");

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/conversation", conversationRouter);
app.use("/api/user", userRouter);
app.use("/api/message", messageRouter);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: true
    }
})

io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error("Authentication error"));
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_KEY);
        if (!decode) {
            return next(new Error("Authentication error"));
        }
        socket.userId = decode.userId;
        next();
    } catch (error) {
        return next(new Error("Authentication error"));
    }
})
const onlineUsers = new Map();

io.on("connection", (socket) => {




    console.log("User connected:", socket.userId);

    socket.join(socket.userId);

// -------------------
const userId = socket.userId;

    const currentCount = onlineUsers.get(userId) || 0;

    onlineUsers.set(userId, currentCount + 1);

    // Is user ko currently online users ki list bhejo
    socket.emit("onlineUsers", [...onlineUsers.keys()]);

    // Baaki connected users ko batao ki ye user online hai
    if (currentCount === 0) {
        socket.broadcast.emit("userOnline", userId);
    }




// -------------------



    socket.on("sendMessage", async (data) => {

    const { conversationId, text } = data;

    const conversation = await conversationModel.findById(conversationId);

    if (!conversation) {
        return;
    }

    const isParticipents = conversation.participants.some(
        (id) => id.toString() === socket.userId
    );

    if (!isParticipents) {
        return;
    }

    const receiverId = conversation.participants.find(
        (id) => id.toString() !== socket.userId
    );

    const receiverSockets = io.sockets.adapter.rooms.get(
        receiverId.toString()
    );

    let receiverIsInConversation = false;

    if (receiverSockets) {

        for (const socketId of receiverSockets) {

            const receiverSocket = io.sockets.sockets.get(socketId);

            if (
                receiverSocket.currentConversationId === conversationId
            ) {
                receiverIsInConversation = true;
                break;
            }
        }
    }


    // Unread count
    let newUnreadCount = 0;

    if (!receiverIsInConversation) {

        const currentUnread =
            conversation.unreadCounts.get(receiverId.toString()) || 0;

        newUnreadCount = currentUnread + 1;

        conversation.unreadCounts.set(
            receiverId.toString(),
            newUnreadCount
        );
    }


    // Message save
    const message = await messageModel.create({
        conversationId,
        senderId: socket.userId,
        text: text
    });


    // Last message update
    conversation.lastMessage = text;

    await conversation.save();


    // Current conversation message
    io.to(conversationId).emit("newMessage", message);


    // Sidebar update
    io.to(conversationId).emit("sidebarUpdate", {
        conversationId,
        lastMessage: text,
        updatedAt: new Date()
    });


    // Unread notification
    if (!receiverIsInConversation) {

        io.to(receiverId.toString()).emit("messageNotification", {
            conversationId,
            unreadCount: newUnreadCount
        });

    }

});

    socket.on("joinConversation", async (conversationId) => {

        if (!conversationId) {
            return
        }
        const conversation = await conversationModel.findById(conversationId);
        if (!conversation) {
            return;
        }
        const isParticipents = conversation.participants.some((id) => {
            return id.toString() === socket.userId;
        })
        if (!isParticipents) {
            return;
        }
        if (socket.currentConversationId) {
            socket.leave(socket.currentConversationId);
        }
        socket.join(conversationId);

        socket.currentConversationId = conversationId;
        conversation.unreadCounts.set(socket.userId, 0);

        await conversation.save();
        io.to(socket.userId).emit("unreadCleared", {
            conversationId
        });
    })

     socket.on("closeConversations",async(conversationId)=>{
        if(!conversationId){
            return;
        }
        if(socket.currentConversationId){
            socket.leave(socket.currentConversationId);
        }
         socket.currentConversationId = null;
     });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.userId);
         const userId = socket.userId;

    const currentCount = onlineUsers.get(userId) || 0;

    if (currentCount <= 1) {
        onlineUsers.delete(userId);

        io.emit("userOffline", userId);
    } else {
        onlineUsers.set(userId, currentCount - 1);
    }
    })
})


const PORT = process.env.PORT;

connnectDB().then(() => {
    server.listen(PORT,"0.0.0.0", () => {
        console.log(`server is listening on port ${PORT}`);

    })
})

