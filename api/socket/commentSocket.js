const commentController = require("../controllers/commentController");
module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.on("newComment", async (commentData) => {
      try {
        const comment = await commentController.createComment(commentData);
        io.emmit("commentCreated", comment);
      } catch (err) {
        console.log(error);
      }
    });
    socket.on("likeComment", async (commentId, userId) => {
      try {
        const comment = await commentController.likeComment(commentId, userId);
        io.emmit("commentLiked", comment);
      } catch (err) {
        console.log(error);
      }
    });
    socket.on("disconnect", () => {
      console.log("a user disconnct");
    });
  });
};
