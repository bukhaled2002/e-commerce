const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  costumer: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  vendor: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  product: {
    type: mongoose.Schema.ObjectId,
    ref: "Product",
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "please add rating to that review"],
  },
  comment: {
    type: String,
    required: [true, "please add comment for that review"],
  },
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
