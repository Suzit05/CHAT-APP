const express = require("express")
const dotenv = require("dotenv")
const cookieParser = require("cookie-parser")
const authRoutes = require("./routes/auth.route")
const messageRoutes = require("./routes/message.route")
const connectDB = require("./lib/db")


dotenv.config()
const app = express()
const PORT = process.env.PORT;

app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRoutes)
app.use("/api/message", messageRoutes)

app.get("/", (req, res) => {
    res.send("welcome to the backend of chat app")
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT} ⚡ `)
    connectDB()
})