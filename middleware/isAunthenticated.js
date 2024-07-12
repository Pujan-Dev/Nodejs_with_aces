const jwt = require("jsonwebtoken");
const user = require("../model/userModel");
// const promisify = require("util").promisify



const isAunthenticated =  (req, res, next) => {
    const token = req.cookies.token;
    console.log(token)
    if (!token || token === null) {
        return res.send("PLease login ");
    }
    // else block
    // rather then using the call back function we can use promisify
    jwt.verify(token, process.env.SECURITY_KEY, async (err, result) => {
        if (err) {

            res.send("Invalid token")
        }
        else {
            const data = await user.findById(result.userID)
            if(!data){
                res.send("Invalid Userid")
                
            }
            else{
                req.userid = result.userid
                next()
            }
            console.log("Valid token", result);
        }
    })
    // the program will not go to the next step if this is not done
}

module.exports = isAunthenticated
