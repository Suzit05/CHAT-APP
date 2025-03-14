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

module.exports = getUsersForSidebar;