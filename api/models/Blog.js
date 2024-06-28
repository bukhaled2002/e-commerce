const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  writer: { type: mongoose.Schema.ObjectId, ref: "User" },
  images: [{ type: String }],
  Likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
  comments: [{ type: mongoose.Schema.ObjectId, ref: "Comment" }],
});
const Blog = mongoose.model("Model", blogSchema);
module.exports = Blog;
