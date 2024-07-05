const blogController = require("../controllers/blogController");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user is connected");
    socket.on("newBlogPost", async (blogData) => {
      try {
        const newBlog = await blogController.createBlog(blogData);
        io.emmit("blogPostCreated", newBlog);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("likeBlog", async (blogId, userId) => {
      try {
        const blog = await blogController.likeBlog(blogId, userId);
      } catch (error) {
        console.log(error);
      }
    });
    socket.on("disconnect", () => {
      console.log("disconnect");
    });
  });
};
