const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "comment must have author"],
    },
    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: [true, "comment must have vendor"],
    },
    product: {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
      required: [true, "comment must have product"],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
