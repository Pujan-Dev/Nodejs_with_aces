const express = require("express")
const connectToDb = require("./database/databaseConnection");
const Blog = require("./model/blogModel");
const app = express()

const { multer, storage } = require('./middleware/multerConfig')
const uplaod = multer({ storage: storage })

connectToDb();

app.set('view engine', 'ejs')
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", async (req, res) => {
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

app.get("/createblog", (req, res) => {
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
app.post("/update/:id", uplaod.single('image'), async (req, res) => {
    const id = req.params.id;
    const fileName = req.file.filename;
    const { title, Subtitle, description } = req.body;
    await Blog.findByIdAndUpdate(id, {
        title,
        subtitle: Subtitle,
        description,
        image: fileName
    });
    res.redirect("/")

})

app.post("/createblog", uplaod.single('image'), async (req, res) => {
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

app.use(express.static("./storage"))

app.listen(3000, () => {
    console.log("NODEJS project has started at port" + 3000)
})