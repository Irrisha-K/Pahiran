const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  discount: { type: Number },
  image: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String }, // ✅ New field
  quantity: { type: Number, required: true }, // ✅ New field
});

module.exports = mongoose.model("Product", productSchema);
