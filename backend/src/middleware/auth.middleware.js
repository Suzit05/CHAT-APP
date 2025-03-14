const jwt = require("jsonwebtoken")
const User = require("../models/user.model")

const protectRoute = async (req, res, next) => {
    //check kro ki token h ya nhi
    try {
        const token = req.cookies.jwt;
        if (!token) {
            return res.status(401).json({ message: "Unauthorized- No token available" })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET) //TOKEN KO VERIFY KRO
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized- Invalid token" })
        }

        const user = await User.findById(decoded.userId).select("-password") //user select kro excluding password
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        req.user = user //verified user hai to database m add kro
        next()
    }
    catch (error) {
        console.log("error in protect route middleware:", error)
        res.status(500).json({ message: "Internal server error" })
    }
}

module.exports = protectRoute