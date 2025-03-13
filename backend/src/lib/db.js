const mongoose = require("mongoose")

const connectDB = async () => { //isko export kr do index.js m
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`mongo db connected: ${conn.connection.host}`)
    }
    catch (error) {
        console.log("Mongo db connection error:", error)
    }
}


module.exports = connectDB;