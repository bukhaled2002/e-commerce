const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    customer: { type: mongoose.Schema.ObjectId, ref: "User" },
    products: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
    shipping: {
      address: {
        type: String,
        required: [true, "please provide address for shipping"],
      },
      price: {
        type: Number,
      },
    },
    payment: {
      paymentMethod: {
        type: String,
      },
    },
    total: { type: Number },
    shipped: { type: Boolean },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
