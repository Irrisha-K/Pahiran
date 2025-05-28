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

router.get("/pants", async (req, res) => {
  const { search = "", page = 1, limit = 6, price = "" } = req.query;
  const normalizedSearch = search.toLowerCase().trim();

  const searchTerms = normalizedSearch.split(" ").filter(Boolean);
  const regexQuery = searchTerms.map((term) => ({
    name: { $regex: term, $options: "i" },
  }));

  const query = {
    category: "pants",
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
    res.status(500).json({ message: "Fetching Pants failed." });
  }
});

router.get("/tops", async (req, res) => {
  const { search = "", page = 1, limit = 6, price = "" } = req.query;
  const normalizedSearch = search.toLowerCase().trim();

  const searchTerms = normalizedSearch.split(" ").filter(Boolean);
  const regexQuery = searchTerms.map((term) => ({
    name: { $regex: term, $options: "i" },
  }));

  const query = {
    category: "tops",
    ...(regexQuery.length > 0 && { $and: regexQuery }),
  };

  const sortQuery =
    price === "asc" ? { price: 1 } : price === "desc" ? { price: -1 } : {}; // Default: no sort

  try {
    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ products, quantity: total });
  } catch (err) {
    res.status(500).json({ message: "Fetching Tops failed." });
  }
});

router.get("/dresses", async (req, res) => {
  const { search = "", page = 1, limit = 6, price = "" } = req.query;
  const normalizedSearch = search.toLowerCase().trim();

  const searchTerms = normalizedSearch.split(" ").filter(Boolean);
  const regexQuery = searchTerms.map((term) => ({
    name: { $regex: term, $options: "i" },
  }));

  const query = {
    category: "dresses",
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
    res.status(500).json({ message: "Fetching Dresses failed." });
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

router.get("/skirts", async (req, res) => {
  const { search = "", page = 1, limit = 6, price = "" } = req.query;
  const normalizedSearch = search.toLowerCase().trim();

  const searchTerms = normalizedSearch.split(" ").filter(Boolean);
  const regexQuery = searchTerms.map((term) => ({
    name: { $regex: term, $options: "i" },
  }));

  const query = {
    category: "skirts",
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
    res.status(500).json({ message: "Fetching Skirts failed." });
  }
});

router.get("/coords", async (req, res) => {
  const { search = "", page = 1, limit = 6, price = "" } = req.query;
  const normalizedSearch = search.toLowerCase().trim();

  const searchTerms = normalizedSearch.split(" ").filter(Boolean);
  const regexQuery = searchTerms.map((term) => ({
    name: { $regex: term, $options: "i" },
  }));

  const query = {
    category: "coords",
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
    res.status(500).json({ message: "Fetching Coords Dress failed." });
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
        new HttpError("Invalid inputs passed, please check your data.", 422)
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
  }
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
        new HttpError("Invalid inputs passed, please check your data.", 422)
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
          new HttpError("Could not find product for the provided id.", 404)
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
  }
);

router.patch("/:id/reduce-stock", async (req, res) => {
  try {
    const { quantity } = req.body; // quantity to reduce

    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity." });
    }

    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    if (product.stock < quantity) {
      return res.status(400).json({ message: "Not enough stock available." });
    }

    product.stock -= quantity;
    await product.save();

    res.json({ message: "Stock updated successfully.", stock: product.stock });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
});

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
      new HttpError("Could not delete product, please try again.", 500)
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

router.post("/add", async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Black Leggings",
        price: 999,
        originalPrice: 1499,
        discount: 33,
        image: "/newarrival/leggingsb.jpg",
        category: "newarrival",
        description:
          "Classic black leggings made from stretchable fabric. Perfect for workouts, lounging, or layering. Offers a snug fit for everyday comfort.",
        quantity: 20,
      },
      {
        name: "Long Olive Shrug",
        price: 1399,
        originalPrice: 2199,
        discount: 36,
        image: "/newarrival/longt.jpg",
        category: "newarrival",
        description:
          "Olive green long shrug with asymmetrical hem. Lightweight and breathable. Ideal for layering over crop tops or tanks.",
        quantity: 14,
      },
      {
        name: "Olive Oversized Tee",
        price: 1099,
        originalPrice: 1799,
        discount: 39,
        image: "/newarrival/oliveoversi.jpg",
        category: "newarrival",
        description:
          "Oversized olive t-shirt with a relaxed fit. Made from soft cotton for all-day comfort. Can be styled casually or for a streetwear vibe.",
        quantity: 17,
      },
      {
        name: "Off-Shoulder Grey Top",
        price: 1299,
        originalPrice: 2099,
        discount: 38,
        image: "/newarrival/os.jpg",
        category: "newarrival",
        description:
          "Chic off-shoulder top in slate grey. Body-hugging silhouette with ruched details. Great for parties or a stylish night out.",
        quantity: 12,
      },
      {
        name: "Pleated Blush Dress",
        price: 1799,
        originalPrice: 2999,
        discount: 40,
        image: "/newarrival/pian.jpg",
        category: "newarrival",
        description:
          "Elegant blush pink pleated dress. Features a soft flowy texture and V-neckline. Perfect for brunches and special occasions.",
        quantity: 10,
      },
      {
        name: "Pink Floral Ruched Top",
        price: 1199,
        originalPrice: 1899,
        discount: 37,
        image: "/newarrival/pinkflo.jpg",
        category: "newarrival",
        description:
          "Floral cropped top in pastel pink with flared sleeves. Ruched center adds a romantic touch. Pairs well with skirts or jeans.",
        quantity: 18,
      },
      {
        name: "Pink Lace Sleepwear Set",
        price: 1499,
        originalPrice: 2499,
        discount: 40,
        image: "/newarrival/pinklacepj.jpg",
        category: "newarrival",
        description:
          "Delicate lace nightwear in baby pink. Includes camisole top and shorts. Soft, breathable, and perfect for cozy evenings.",
        quantity: 13,
      },
      {
        name: "Polka Pajama Set",
        price: 1299,
        originalPrice: 2199,
        discount: 41,
        image: "/newarrival/pjw.jpg",
        category: "newarrival",
        description:
          "Charming polka-dotted pajama set with buttoned shirt. Made of soft fabric for restful nights. Comfortable and lightweight.",
        quantity: 15,
      },
      {
        name: "Printed Oversized T-Shirt",
        price: 999,
        originalPrice: 1599,
        discount: 38,
        image: "/newarrival/printedoversi.jpg",
        category: "newarrival",
        description:
          "Black oversized t-shirt with bold graphic print. Streetwear-ready and highly breathable. Pairs well with shorts or joggers.",
        quantity: 21,
      },
      {
        name: "Red Front-Tie Blouse",
        price: 1399,
        originalPrice: 2299,
        discount: 39,
        image: "/newarrival/redfb.jpg",
        category: "newarrival",
        description:
          "Vibrant red blouse with a front-tie design. Flowy sleeves and flattering neckline. A statement piece for semi-formal outings.",
        quantity: 11,
      },
      {
        name: "Red Printed Frock",
        price: 1699,
        originalPrice: 2799,
        discount: 39,
        image: "/newarrival/redfrock.jpg",
        category: "newarrival",
        description:
          "Bohemian-style red frock with traditional prints. Sleeveless and light for summer wear. Great for both casual and festive occasions.",
        quantity: 9,
      },
      {
        name: "Burgundy Maxi Dress",
        price: 1999,
        originalPrice: 3399,
        discount: 41,
        image: "/newarrival/redmaxi.jpg",
        category: "newarrival",
        description:
          "Deep burgundy maxi dress with spaghetti straps. Elegant flow with comfortable wear. Suitable for date nights or events.",
        quantity: 12,
      },
      {
        name: "Denim Shorts",
        price: 999,
        originalPrice: 1699,
        discount: 41,
        image: "/newarrival/shorts.jpg",
        category: "newarrival",
        description:
          "Classic dark blue denim shorts with frayed hems. Durable and trendy. A summer staple in any wardrobe.",
        quantity: 20,
      },
      {
        name: "Burgundy Crop Top",
        price: 1099,
        originalPrice: 1799,
        discount: 39,
        image: "/newarrival/shtop.jpg",
        category: "newarrival",
        description:
          "Trendy crop top in wine burgundy. Sleek design with side cut details. Great for pairing with high-waisted bottoms.",
        quantity: 14,
      },
      {
        name: "Black Silk Shirt",
        price: 1499,
        originalPrice: 2499,
        discount: 40,
        image: "/newarrival/sleetop.jpg",
        category: "newarrival",
        description:
          "Smooth black silk shirt with a soft drape. Versatile for formal or casual wear. Adds elegance to any outfit.",
        quantity: 10,
      },
      {
        name: "Sleeveless Anarkali Kurta",
        price: 1899,
        originalPrice: 3199,
        discount: 41,
        image: "/newarrival/sleeveless anarkali.jpg",
        category: "newarrival",
        description:
          "Graceful anarkali kurta with a sleeveless cut. Perfect for festive wear. Flowy fabric with traditional prints.",
        quantity: 8,
      },
      {
        name: "White Cropped Sweatshirt",
        price: 1299,
        originalPrice: 2099,
        discount: 38,
        image: "/newarrival/whcrop.jpg",
        category: "newarrival",
        description:
          "White sweatshirt cropped above the waist. Casual and sporty style. Ideal for winter layering or gym wear.",
        quantity: 19,
      },
      {
        name: "White Layered Gown",
        price: 2899,
        originalPrice: 4799,
        discount: 40,
        image: "/newarrival/whid.jpg",
        category: "newarrival",
        description:
          "Elegant white gown with layered ruffles. Feminine and graceful for events. Lightweight chiffon fabric for ease of wear.",
        quantity: 7,
      },
      {
        name: "White Turtleneck Sweater",
        price: 1199,
        originalPrice: 1999,
        discount: 40,
        image: "/newarrival/whineck.jpg",
        category: "newarrival",
        description:
          "Cozy ribbed turtleneck in soft white. Great as a winter essential. Pairs effortlessly with skirts, jeans, or pants.",
        quantity: 13,
      },
      {
        name: "White Lounge Shorts",
        price: 899,
        originalPrice: 1499,
        discount: 40,
        image: "/newarrival/whshorts.jpg",
        category: "newarrival",
        description:
          "Comfy white shorts with elastic waistband. Great for lounging or quick errands. Made of breathable cotton fabric.",
        quantity: 22,
      },
      {
        name: "White Sweatpants",
        price: 1299,
        originalPrice: 2199,
        discount: 41,
        image: "/newarrival/whsweats.jpg",
        category: "newarrival",
        description:
          "White sweatpants designed for comfort. Stretch waistband and cuffed ankles. Pairs well with crop tops or hoodies.",
        quantity: 18,
      },
      {
        name: "Beige Ribbed Sweater",
        price: 1399,
        originalPrice: 2399,
        discount: 41,
        image: "/newarrival/wht.jpg",
        category: "newarrival",
        description:
          "Neutral beige ribbed sweater with full sleeves. A wardrobe essential for layering. Adds warmth and minimal style.",
        quantity: 16,
      },
      {
        name: "Colorful Knit Tank",
        price: 1199,
        originalPrice: 1899,
        discount: 37,
        image: "/newarrival/wolf.jpg",
        category: "newarrival",
        description:
          "Striped multicolor knit tank top. Stretchable and cropped style. Perfect for warm weather or layered looks.",
        quantity: 14,
      },
      {
        name: "Cream Wool Pants",
        price: 1899,
        originalPrice: 3199,
        discount: 41,
        image: "/newarrival/wwoolpant.jpg",
        category: "newarrival",
        description:
          "Cream-toned wool pants with wide-leg fit. Elegant and cozy for colder months. Versatile enough for work or casual wear.",
        quantity: 12,
      },
    ];

    await Product.insertMany(sampleProducts);
    res.status(201).json({ message: "Products seeded" });
  } catch (err) {
    res.status(500).json({ message: "Seeding failed" });
    console.log(err);
  }
});

module.exports = router;
