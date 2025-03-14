//controller - so that the routes does not have too much code
const bcrypt = require("bcryptjs")
const User = require("../models/user.model")
const generateToken = require("../lib/util")
const cloudinary = require("../lib/cloudinary")

const signup = async (req, res) => {
    const { fullName, email, password } = req.body
    try {
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be 6 characters atleast" })
        }
        const user = await User.findOne({ email })
        if (user) return res.status(400).json({ message: "Email already exist" });

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt) //password hash ho gya 10 rounds

        const newUser = new User({
            fullName,
            email,
            password: hashedPassword
        })

        if (newUser) {
            //generate jwt token here ,(utils folder) 
            generateToken(newUser._id, res) //newUser bnaye hai upr, _id = mongodb default bnata hai
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic,
            })
        }


        else {
            res.status(400).json({ message: "Invalid User Data" })
        }
    }

    catch (error) {
        console.log("Error in sign up controller", error.message)
        res.status(500).json({ message: "Internal Server error" })
    }
}


const login = async (req, res) => {
    const { email, password } = req.body
    try {
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" })
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password) //password that entered and password thats in the db
        if (!isPasswordCorrect) {
            return res.status(400).json({ message: "Invalid credentials" })
        }
        generateToken(user._id, res)

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic
        })

    }
    catch (error) {
        console.log("Error in signup controller", error.message)
        res.status(400).json({ message: "Internal server error" })
    }
}


const logout = (req, res) => {
    //logout m cookie clear kr do
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" })
    }
    catch (error) {
        console.log("Error in logout controller", error.message)
        res.status(400).json({ message: "Internal server error" })
    }
}

const updateProfile = async (req, res) => {
    //profile pic upload
    try {
        const { profilePic } = req.body;
        const userId = req.user._id;

        if (!profilePic) {
            return res.status(400).json({ message: "Profile pic is required" })
        }
        const uploadResponse = await cloudinary.uploader.upload(profilePic); //pic cloudinary m upload ho rha
        //pic cloudinary se db m bheja jaa rha
        const updatedUser = await User.findByIdAndUpdate(userId, { profilePic: uploadResponse.secure_url }, { new: true })
        res.status(200).json(updatedUser)
    }
    catch (error) {
        console.log("error in update profile", error);
        res.status(500).json({ message: "Internal server error" })
    }
}

const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user)
    }
    catch (error) {
        console.log("Error in checkAuth", error.message)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = { signup, login, logout, updateProfile, checkAuth }  //way to export in module way