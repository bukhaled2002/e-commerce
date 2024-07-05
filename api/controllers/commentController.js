const Comment = require("../models/Comment");

exports.createComment = async (commentData) => {
  try {
    const comment = await Comment.create(commentData);
    return comment;
  } catch (error) {
    throw error;
  }
};
exports.likeComment = async (commentId, userId) => {
  try {
    const comment = await Comment.findById(commentId);
    if (!comment.Likes.includes(userId)) {
      comment.Likes.push(userId);
      await comment.save();
      return comment;
    }
  } catch (error) {
    throw error;
  }
};
