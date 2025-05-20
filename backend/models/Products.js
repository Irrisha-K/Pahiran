// models/Product.js
import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String, // e.g., "tops", "pants", etc.
  type: String, // optional, like "New Arrival", "Best Seller"
  images: [String], // array of image URLs or paths
  stock: Number,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Product", productSchema);
