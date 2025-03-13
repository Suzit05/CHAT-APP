//controller - so that the routes does not have too much code
const bcrypt = require("bcryptjs")
const User = require("../models/user.model")
const generateToken = require("../lib/util")

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


const login = (req, res) => {
    res.send("login up route")
}


const logout = (req, res) => {
    res.send("logout up route")
}


module.exports = { signup, login, logout }  //way to export in module way