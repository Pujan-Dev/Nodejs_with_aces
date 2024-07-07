const express = require("express")
const app = express()
app.set('view engine','ejs')

app.get("/",(req,res)=>{
    res.send("<h1>This is the ok</h1>")
})

app.get("/about",(req,res)=>{
    const name = "Pujan Neupane"
    res.render("about.ejs",{name})
})
app.get("/contact",(req,res)=>{
    const ACES= "Aces Workshop"
    res.render("contact.ejs",{ACES})
})
app.listen(3000, () => {
    console.log("NODEJS project has started at port" + 3000)
})