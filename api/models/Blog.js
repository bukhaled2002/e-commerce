const mongoose = require("mongoose");
const blogSchema = new mongoose.Schema({
  writer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  images: [{ type: String }],
  likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});
const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
