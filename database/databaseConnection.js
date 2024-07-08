const mongoose = require("mongoose")

async function connectToDb() {
    await mongoose.connect("mongodb+srv://pujanneupaneop0907:pujan123@cluster0.sjmc5mr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    console.log("Database connected")

}
module.exports =connectToDb