const mongoose = require("mongoose");
const Product = require("./Product");

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

reviewSchema.statics.calcRatingAvg = async function (productId) {
  const stats = await this.aggregate([
    { $match: { product: productId } },
    { $group: { _id: "$product", avgRating: { $avg: "$rating" } } },
  ]);
  await Product.findByIdAndUpdate(productId, {
    avgRating: stats[0].avgRating.toFixed(3),
  });
};
reviewSchema.post("save", function () {
  this.constructor.calcRatingAvg(this.product);
});

reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this);
  next();
});
reviewSchema.post(/^findOneAnd/, async function (next) {
  await this.r.constructor.calcRatingAvg(this.r.product);
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
