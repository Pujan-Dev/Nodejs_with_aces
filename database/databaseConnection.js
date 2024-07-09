const mongoose = require("mongoose")
require('dotenv').config()
async function connectToDb() {

    await mongoose.connect(process.env.API_KEY)
    console.log("Database connected")

}
module.exports =connectToDb