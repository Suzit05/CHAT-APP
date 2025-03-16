//controller for message routes
const Message = require("../models/message.model")
const User = require("../models/user.model")

const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        //filteredUsers m sbhi user ko find kr rha , excluding itself and exculing the passwords
        res.status(200).json(filteredUsers)
    }
    catch (error) {
        console.log("gET USERSFOR SIDEBAR FN error present in controller", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const getMessages = async (req, res) => {

    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;
        const messages = await Message.find({
            $or: [                     //us messages ko find kro jisme sender aur receiver , main aur jisse baat kr rha wo ho, vice versa
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId }
            ]
        })
        res.status(200).json(messages)
    } catch (error) {
        console.log("getMessages controller error", error.message)
        res.status(500).json({ message: "Internal Server Error" })
    }
}

const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params; //params se isliye le rhe qk uske chat (receiver) open rhega
        const senderId = req.user._id; //jiska account khula hua ho

        let imageUrl; //ya to undefined ya to image rhega
        if (image) {
            //cloud base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        })

        await newMessage.save();
        //realtime functionality goes here => socket.io 

        res.status(201).json(newMessage)


    } catch (error) {
        console.log("Error in sent message in messageController", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { getUsersForSidebar, getMessages, sendMessage };