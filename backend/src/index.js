const express = require("express")
const dotenv = require("dotenv")
const authRoutes = require("./routes/auth.route")
const connectDB = require("./lib/db")


dotenv.config()
const app = express()
const PORT = process.env.PORT;

app.use(express.json())

app.use("/api/auth", authRoutes)

app.get("/", (req, res) => {
    res.send("welcome to the backend of chat app")
})

app.listen(PORT, () => {
    console.log(`server is running on ${PORT} ⚡ `)
    connectDB()
})