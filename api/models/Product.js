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
      required: [true, "please provide category field"],
      enum: ["clothes", "smartphones", "accessories", "goods"],
    },
    description: {
      type: String,
      required: [true, "product must have description"],
      minLength: [10, "description must be more than 10 charachters"],
    },
    tags: [String],
    images: {
      type: String,
      requierd: true,
      default:
        "https://marketplace.canva.com/EAFNVAn583I/1/0/800w/canva-minimal-paper-coming-soon-instagram-post-ChSd0pJy1DQ.jpg",
    },

    price: {
      type: Number,
      required: [true, "you must provide price"],
      min: 1,
      max: 100000,
    },
    vendor: { type: mongoose.Schema.ObjectId, ref: "User" },
    quantity: {
      type: Number,
      required: [true, "please provide quantity of item"],
    },
    avgRating: { type: Number, default: 3 },
    discount: { type: Number, default: 0 },
    freeShipping: { type: Boolean, default: false },
  },

  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
productSchema.virtual("reviews", {
  ref: "Review",
  foreignField: "product",
  localField: "_id",
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
