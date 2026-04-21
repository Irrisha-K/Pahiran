const express = require("express");
const { check, validationResult } = require("express-validator");

const Product = require("../models/Products");
const productControllers = require("../controllers/Products-controllers");
const HttpError = require("../models/http-error");
const fileUpload = require("../controllers/fileStorage");
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");

const router = express.Router();

router.get("/category/:categoryName", async (req, res) => {
  const { categoryName } = req.params;
  const { search = "", page = 1, limit = 6, price = "" } = req.query;
  const normalizedSearch = search.toLowerCase().trim();

  const searchTerms = normalizedSearch.split(" ").filter(Boolean);
  const regexQuery = searchTerms.map((term) => ({
    name: { $regex: term, $options: "i" },
  }));

  const query = {
    category: categoryName,
    ...(regexQuery.length > 0 && { $and: regexQuery }),
  };

  const sortQuery =
    price === "asc" ? { price: 1 } : price === "desc" ? { price: -1 } : {};

  try {
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, quantity: total });
  } catch (err) {
    res.status(500).json({ message: `Fetching ${categoryName} failed.` });
  }
});

router.get("/", async (req, res) => {
  const { category, exclude } = req.query;
  try {
    let query = {};
    if (category) {
      query.category = category;
    }
    if (exclude) {
      query._id = { $ne: exclude };
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Fetching products failed." });
  }
});

router.get("/bestseller", async (req, res) => {
  try {
    const bestseller = await Product.find({ category: "bestseller" });
    res.json(bestseller);
  } catch (err) {
    res.status(500).json({ message: "Fetching Best-Seller clothes failed." });
  }
});

router.get("/home", async (req, res) => {
  try {
    const home = await Product.find({ category: "home" });
    res.json(home);
  } catch (err) {
    res.status(500).json({ message: "Fetching Clothes failed." });
  }
});

router.get("/newarrival", async (req, res) => {
  try {
    const newarrival = await Product.find({ category: "newarrival" });
    res.json(newarrival);
  } catch (err) {
    res.status(500).json({ message: "Fetching New Arrivals failed." });
  }
});

router.get("/search", async (req, res) => {
  const { query } = req.query;

  // Guard: return empty array if no query
  if (!query || !query.trim()) return res.json([]);

  try {
    const products = await Product.find({
      $or: [
        { name: { $regex: query.trim(), $options: "i" } },
        { category: { $regex: query.trim(), $options: "i" } },
        { description: { $regex: query.trim(), $options: "i" } },
      ],
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Fetching product failed." });
  }
});

router.post(
  "/addProduct",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("price").isNumeric(),
    check("category").not().isEmpty(),
    check("description").not().isEmpty(),
    check("quantity").isNumeric(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422),
      );
    }

    const { name, price, category, description, quantity } = req.body;

    const imagePath = req.file?.path.replace(/\\/g, "/");

    const createdProduct = new Product({
      name,
      price,
      image: imagePath,
      category,
      description,
      quantity,
    });

    try {
      await createdProduct.save();
      res.status(201).json({ product: createdProduct });
    } catch (err) {
      return next(new HttpError("Creating product failed.", 500));
    }
  },
);

router.put(
  "/updateProduct/:id",
  fileUpload.single("image"),
  [
    check("name").not().isEmpty(),
    check("price").isNumeric(),
    check("category").not().isEmpty(),
    check("description").not().isEmpty(),
    check("quantity").isNumeric(),
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError("Invalid inputs passed, please check your data.", 422),
      );
    }

    const productId = req.params.id;
    const { name, price, category, description, quantity } = req.body;

    let imagePath;
    if (req.file) {
      imagePath = req.file.path.replace(/\\/g, "/");
    }

    try {
      const product = await Product.findById(productId);
      if (!product) {
        return next(
          new HttpError("Could not find product for the provided id.", 404),
        );
      }

      product.name = name;
      product.price = price;
      product.category = category;
      product.description = description;
      product.quantity = quantity;

      if (imagePath) {
        product.image = imagePath;
      }

      await product.save();

      res.status(200).json({ product });
    } catch (err) {
      console.error(err);
      return next(new HttpError("Updating product failed.", 500));
    }
  },
);

// PATCH /products/:id/decrement
router.patch("/:id/decrement", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || product.quantity <= 0) {
      return res
        .status(404)
        .json({ message: "Product not found or out of stock" });
    }
    product.quantity -= 1;
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Failed to update product quantity" });
  }
});

router.delete("/:pid", async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    console.error(err);
    return next(
      new HttpError("Could not delete product, please try again.", 500),
    );
  }

  if (!product) {
    return next(new HttpError("Could not find product for this id.", 404));
  }

  const imagePath = path.join(__dirname, "..", product.image);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await product.deleteOne({ session: sess });
    await sess.commitTransaction();
  } catch (err) {
    console.error(err);
    return next(new HttpError("Could not delete product from DB.", 500));
  }

  fs.unlink(imagePath, (err) => {
    if (err) {
      console.log("Failed to delete image file:", err);
    } else {
      console.log("Image file deleted:", imagePath);
    }
  });

  res.status(200).json({ message: "Product deleted successfully." });
});

module.exports = router;
