const mongoose = require("mongoose");
const commentSchema = new mongoose.Schema({
  writer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "no comment can be done without writer"],
  },
  blog: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "you must identify a blog"],
  },
  text: {
    type: String,
    required: [true, "no comment can be added without text"],
  },
  Likes: [{ type: mongoose.Schema.ObjectId, ref: "User" }],
});
const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
