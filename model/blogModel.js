const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Object create gara ko 
const blogSchema =new Schema({
    title:{
        type:String
    },
    subtitle:{
        type:String
    },
    description:{
        type:String
    },
    image:{
        type:String
    }

})
// table lai query garna BLOG la ho 
const Blog= mongoose.model("Blog",blogSchema)
module.exports =Blog