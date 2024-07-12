const express = require("express")
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
require("dotenv").config()
const cookieParser= require('cookie-parser')

const User = require("./model/userModel")
const app = express()
const jwt =require("jsonwebtoken")

const { multer, storage } = require('./middleware/multerConfig')
const upload = multer({ storage: storage })

const bcrypt = require('bcryptjs');
const isAunthenticated = require("./middleware/isAunthenticated");


connectToDb();

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser())
app.get("/",async (req, res) => {
    // res.send("<h1>This is the ok</h1>")
    const blogs = await Blog.find() //Always returns arrays
    if (blogs.length === 0) {
        res.send("No blogs")
    }

    res.render("./blog/home.ejs", { blogs: blogs })
})

app.get("/about", (req, res) => {
    const name = "Pujan Neupane"
    res.render("about.ejs", { name })
})

app.get("/blogs/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id)
    res.render("./blog/blogs.ejs", { blog });
})


app.get("/contact", (req, res) => {
    const ACES = "Aces Workshop"
    res.render("contact.ejs", { ACES })
})

app.get("/createblog",isAunthenticated,(req, res) => {
    res.render("./blog/create.ejs")
})

app.get("/deleteblog/:id", async (req, res) => {
    const id = req.params.id;
    await Blog.findByIdAndDelete(id)
    // res.send("Blog Deleted"
    res.redirect("/")
})
app.get("/update/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id)
    res.render("blog/updateblog.ejs", { blog })
})
app.post("/update/:id", upload.single('image'), async (req, res) => {
    const id = req.params.id;
    const fileName = req.file.filename;
    const { title, Subtitle, description } = req.body;
    await Blog.findByIdAndUpdate(id, {
        title,
        subtitle: Subtitle,
        description,
        image: fileName
    });
    res.redirect("/blogs/" + id)

})

app.post("/createblog", upload.single('image'), async (req, res) => {
    const fileName = req.file.filename
    console.log(fileName)
    console.log(req.body)
    const { title, Subtitle, description } = req.body
    await Blog.create({
        title,
        subtitle: Subtitle,
        description,
        image: fileName
    })
    res.send("Blog created successfully")
})

app.get("/register", (req, res) => {
    res.render("register.ejs");
})
app.post("/register", async (req, res) => {
    const { username, email, password } = req.body
    const user = await User.find({ email })
    if (user.email === email) {
        res.send("User already exits with this email!")
    } else {
        await User.create({
            username: username,
            email: email,
            password: bcrypt.hashSync(password, 12)
            // password:await hash(password,12)
        })
        res.send("User registered");
    }
})


app.get("/login", (req, res) => {
    res.render("login.ejs");
})
app.post("/login", async (req, res) => {
    const { email, password } = req.body
    const user = await User.find({ email: email })
    if (user.length === 0) {
        res.send("NO mail bye bye")
    }
    else {
        //check password
        const isMatched = bcrypt.compareSync(password, user[0].password)
        if (!isMatched) {
            res.send("Invalid password");
        }
        else {

            const token = jwt.sign({userID: user[0]._id},process.env.SECURITY_KEY,{
                expiresIn: '20d'
            })
            // localstorage && cookies
            res.cookie("token",token) // key=value
            res.send("login in succes")

        }
    }

})





app.use(express.static("./storage"))
app.use(express.static("./public/css"))


app.listen(3000, () => {
    console.log("NODEJS project has started at port" + 3000)
})