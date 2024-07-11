const mongoose = require("mongoose")
const Schema = mongoose.Schema

// Object create gara ko 
const userSchema =new Schema({
    username:{
        type:String,
        required:[true,"Username is required"]

    },
    email:{
        type:String,
        required:[true,"Email is required"]

    },
    password:{
        type:String,
        required:[true,"Password is required"]
        
    }

})
// table lai query garna User la ho 
const user= mongoose.model("User",userSchema)
module.exports =user