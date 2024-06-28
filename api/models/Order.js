const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.ObjectId, ref: "User" },
  products: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  shipping: [
    {
      address: {
        type: String,
        required: [true, "please provide address for shipping"],
      },
      price: {
        type: Number,
      },
    },
  ],
  total: { type: Number },
  shipped: { type: Boolean },
});
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
