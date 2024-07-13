const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subtitle: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
}, { timestamps: true });

const Blog = mongoose.model("Blog", blogSchema);
module.exports = Blog;
