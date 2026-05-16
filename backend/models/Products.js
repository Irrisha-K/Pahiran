// models/Products.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  quantity: { type: Number, required: true },

  // ✅ ADDED — soft delete flag
  // false = removed from store, but order history still intact
  isActive: { type: Boolean, default: true },
});

module.exports = mongoose.model("Product", productSchema);
