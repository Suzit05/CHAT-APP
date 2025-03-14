const express = require("express")
const protectRoute = require("../middleware/auth.middleware")
const getUsersForSidebar = require("../controllers/message.controller")
const router = express.Router()

router.get("/", (req, res) => {
    res.send("weldcome to message routes")
})

router.get("/users", protectRoute, getUsersForSidebar)
//WRITE NEXT API HERE

module.exports = router;