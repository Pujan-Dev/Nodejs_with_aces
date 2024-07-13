const express = require("express");
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
require("dotenv").config();
const cookieParser = require('cookie-parser');

const User = require("./model/userModel");
const app = express();
const jwt = require("jsonwebtoken");

const { multer, storage } = require('./middleware/multerConfig');
const upload = multer({ storage: storage });

const bcrypt = require('bcryptjs');
const isAunthenticated = require("./middleware/isAunthenticated");

connectToDb();

app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req, res) => {
    const blogs = await Blog.find().populate('author', 'username');
    if (blogs.length === 0) {
        res.send("No blogs");
    } else {
        res.render("./blog/home.ejs", { blogs: blogs });
    }
});

app.get("/about", (req, res) => {
    const name = "Pujan Neupane";
    res.render("about.ejs", { name });
});

app.get("/blogs/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id).populate('author', 'username');
    console.log(blog);
    res.render("./blog/blogs.ejs", { blog });
});

app.get("/contact", (req, res) => {
    const ACES = "Aces Workshop";
    res.render("contact.ejs", { ACES });
});

app.get("/createblog", isAunthenticated, (req, res) => {
    res.render("./blog/create.ejs");
});

app.get("/deleteblog/:id", async (req, res) => {
    const id = req.params.id;
    await Blog.findByIdAndDelete(id);
    res.redirect("/");
});

app.get("/update/:id", async (req, res) => {
    const id = req.params.id;
    const blog = await Blog.findById(id);
    res.render("blog/updateblog.ejs", { blog });
});

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
    res.redirect("/blogs/" + id);
});
app.post("/createblog", isAunthenticated, upload.single('image'), async (req, res) => {
    const fileName = req.file.filename;
    const { title, Subtitle, description } = req.body;
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.SECURITY_KEY);
    const userId = decoded.userID;

    await Blog.create({
        title,
        subtitle: Subtitle,
        description,
        image: fileName,
        author: userId
    });

    res.redirect("/");
});


app.get("/register", (req, res) => {
    res.render("register.ejs");
});

app.post("/register", async (req, res) => {
    const { username, email, password } = req.body;
    const user = await User.findOne({ email });
    if (user) {
        res.send("User already exists with this email!");
    } else {
        await User.create({
            username: username,
            email: email,
            password: bcrypt.hashSync(password, 12)
        });
        res.send("User registered");
    }
});

app.get("/login", (req, res) => {
    res.render("login.ejs");
});

app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
        res.send("No user found with this email");
    } else {
        const isMatched = bcrypt.compareSync(password, user.password);
        if (!isMatched) {
            res.send("Invalid password");
        } else {
            const token = jwt.sign({ userID: user._id }, process.env.SECURITY_KEY, {
                expiresIn: '20d'
            });
            res.cookie("token", token);
            res.send("Login successful");
        }
    }
});

app.get("/search", async (req, res) => {
    const query = req.query.query.toLowerCase();
    const blogs = await Blog.find();

    const filtered_blogs = blogs.filter((blog) =>
        blog.title.toLowerCase().includes(query)
    );

    if (filtered_blogs.length === 0) {
        res.send("No blogs found");
    } else {
        res.render("blog/home", { blogs: filtered_blogs });
    }
});

app.get("/logout", async (req, res) => {
    res.clearCookie("token");
    res.send("Logged out successfully");
});

app.use(express.static("./storage"));
app.use(express.static("./public"));

app.listen(3000, () => {
    console.log("NODEJS project has started at port " + 3000);
});

module.exports = Blog;
