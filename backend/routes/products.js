// routes/productRoutes.js  — full file, replace your existing one
const express = require("express");
const { check, validationResult } = require("express-validator");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const Product = require("../models/Products");
const Order = require("../models/Order"); // ✅ needed for delete check
const productControllers = require("../controllers/Products-controllers");
const HttpError = require("../models/http-error");
const fileUpload = require("../controllers/fileStorage");

const router = express.Router();

// ── GET /products/category/:categoryName ─────────────────────────────────────
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
    isActive: true, // ✅ only active products
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

// ── GET /products ─────────────────────────────────────────────────────────────
router.get("/", async (req, res) => {
  const { category, exclude } = req.query;
  try {
    const query = { isActive: true }; // ✅ only active
    if (category) query.category = category;
    if (exclude) query._id = { $ne: exclude };

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Fetching products failed." });
  }
});

// ── GET /products/bestseller ──────────────────────────────────────────────────
router.get("/bestseller", async (req, res) => {
  try {
    const bestseller = await Product.find({
      category: "bestseller",
      isActive: true,
    });
    res.json(bestseller);
  } catch (err) {
    res.status(500).json({ message: "Fetching Best-Seller clothes failed." });
  }
});

// ── GET /products/home ────────────────────────────────────────────────────────
router.get("/home", async (req, res) => {
  try {
    const home = await Product.find({ category: "home", isActive: true });
    res.json(home);
  } catch (err) {
    res.status(500).json({ message: "Fetching Clothes failed." });
  }
});

// ── GET /products/newarrival ──────────────────────────────────────────────────
router.get("/newarrival", async (req, res) => {
  try {
    const newarrival = await Product.find({
      category: "newarrival",
      isActive: true,
    });
    res.json(newarrival);
  } catch (err) {
    res.status(500).json({ message: "Fetching New Arrivals failed." });
  }
});

// ── GET /products/search ──────────────────────────────────────────────────────
router.get("/search", async (req, res) => {
  const { query } = req.query;
  if (!query?.trim()) return res.json([]);

  try {
    const products = await Product.find({
      isActive: true, // ✅ only active
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

// ── GET /products/:id ─────────────────────────────────────────────────────────
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found." });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Fetching product failed." });
  }
});

// ── POST /products/addProduct ─────────────────────────────────────────────────
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
      isActive: true,
    });

    try {
      await createdProduct.save();
      res.status(201).json({ product: createdProduct });
    } catch (err) {
      return next(new HttpError("Creating product failed.", 500));
    }
  },
);

// ── PUT /products/updateProduct/:id ──────────────────────────────────────────
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

    const { name, price, category, description, quantity } = req.body;
    let imagePath;
    if (req.file) imagePath = req.file.path.replace(/\\/g, "/");

    try {
      const product = await Product.findById(req.params.id);
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
      if (imagePath) product.image = imagePath;

      await product.save();
      res.status(200).json({ product });
    } catch (err) {
      console.error(err);
      return next(new HttpError("Updating product failed.", 500));
    }
  },
);

// ── PATCH /products/:id/decrement ─────────────────────────────────────────────
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

// ── DELETE /products/:pid ─────────────────────────────────────────────────────
// Safe delete:
//   1. Check for active (unpaid/undelivered) orders containing this product
//   2. If found → block deletion, return the affected order count
//   3. If clear → soft-delete (isActive: false) so order history stays intact
//   4. Physical image file is NOT deleted — orders may still reference it
router.delete("/:pid", async (req, res, next) => {
  const productId = req.params.pid;

  // ── Step 1: find the product ──────────────────────────────────────────────
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    return next(
      new HttpError("Could not delete product, please try again.", 500),
    );
  }

  if (!product) {
    return next(new HttpError("Could not find product for this id.", 404));
  }

  // ── Step 2: block if there are active orders ──────────────────────────────
  // "Active" = paid but not yet delivered or cancelled
  try {
    const activeOrders = await Order.find({
      "items.id": productId,
      status: { $nin: ["delivered", "cancelled"] },
    });

    if (activeOrders.length > 0) {
      return res.status(409).json({
        message: `Cannot remove this product — it appears in ${activeOrders.length} active order(s). Cancel or fulfil those orders first, or use soft-remove.`,
        activeOrderCount: activeOrders.length,
        // Return IDs so admin can navigate to them
        affectedOrderIds: activeOrders.map((o) => o._id),
      });
    }
  } catch (err) {
    return next(new HttpError("Could not check active orders.", 500));
  }

  // ── Step 3: soft-delete — hide from store, keep in order history ──────────
  try {
    product.isActive = false;
    await product.save();
  } catch (err) {
    return next(new HttpError("Could not soft-delete product.", 500));
  }

  // Note: we intentionally keep the image file so past orders
  // can still display the product image if needed.
  // Only hard-delete the image if you are 100% sure no orders reference it.

  res.status(200).json({ message: "Product removed from store successfully." });
});

// ── DELETE /products/:pid/force ───────────────────────────────────────────────
// Hard delete — use only when you are sure (e.g. product was never ordered).
// Removes from DB AND deletes image file.
router.delete("/:pid/force", async (req, res, next) => {
  const productId = req.params.pid;

  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
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
    return next(new HttpError("Could not delete product from DB.", 500));
  }

  fs.unlink(imagePath, (err) => {
    if (err) console.log("Failed to delete image file:", err);
    else console.log("Image file deleted:", imagePath);
  });

  res.status(200).json({ message: "Product permanently deleted." });
});

module.exports = router;
