// routes/products.js
const express = require('express')
const Product = require("../models/Products");

const router = express.Router();

// GET all products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

// GET products by category (e.g., tops)
router.get("/category/:category", async (req, res) => {
  const products = await Product.find({ category: req.params.category });
  res.json(products);
});

// GET search by query
router.get("/search", async (req, res) => {
  const { q } = req.query;
  const products = await Product.find({
    name: { $regex: q, $options: "i" },
  });
  res.json(products);
});

router.post("/", async (req, res) => {
  const newProduct = new Product(req.body);
  await newProduct.save();
  res.status(201).json(newProduct);
});

module.exports = router
