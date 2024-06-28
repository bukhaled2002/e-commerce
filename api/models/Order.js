const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.ObjectId, ref: "User" },
  products: [{ type: mongoose.Schema.ObjectId, ref: "Product" }],
  shipping: {
    address: { type: String },
  },
});
