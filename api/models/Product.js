const mongoose = require("mongoose");
const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "please provide the name of product"],
      minLength: [5, "must have more than 5 charachter"],
      maxLength: [30, "must have less than 30 charachters"],
    },
    category: {
      type: String,
      required: [true, "please provide category filed"],
      enum: ["clothes", "smartphones"],
    },
    description: {
      type: String,
      required: [true, "product must have description"],
      minLength: [10, "description must be more than 10 charachters"],
    },
    tags: [String],
    images: [String],
    price: {
      type: Number,
      required: [true, "you must provide price"],
      min: 1,
      max: 100000,
    },
    vendor: { type: mongoose.Schema.ObjectId, ref: "User" },
    reviews: [{ type: mongoose.Schema.ObjectId, ref: "Review" }],
    quantity: {
      type: Number,
      required: [true, "please provide quantity of item"],
    },
    discount: { type: Number, default: 0 },
    freeShipping: { type: Boolean, default: false },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
