const express = require("express")
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const app = express()
connectToDb();

app.set('view engine','ejs')
app.use(express.json())
app.use(express.urlencoded({extended:true}))

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

app.get("/createblog",(req,res)=>{


    res.render("./blog/create.ejs")
})

app.post("/createblog",async (req,res)=>{ 
    console.log(req.body)
    const {title,subtitle,description}=req.body
    await Blog.create({
        title,
        subtitle,
        description
    })
    res.send("Blog created successfully")
})
app.listen(3000, () => {
    console.log("NODEJS project has started at port" + 3000)
})