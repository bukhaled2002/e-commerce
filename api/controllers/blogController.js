const Blog = require("../models/Blog");

exports.createBlog = async (blogData) => {
  try {
    const newBlog = await Blog.create(blogData);
    return newBlog;
  } catch (error) {
    throw error;
  }
};
exports.likeBlog = async (blogId, userId) => {
  try {
    const blog = await Blog.findById(blogId);
    if (!blog.likes.includes(userId)) {
      blog.likes.push(userId);
      await blog.save();
      return blog;
    }
  } catch (error) {
    throw error;
  }
};
