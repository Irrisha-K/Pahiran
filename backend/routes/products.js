const express = require("express");
const Product = require("../models/Products");
const productControllers = require("../controllers/Products-controllers");

const router = express.Router();

router.get("/best-seller", async (req, res) => {
  try {
    const bestSellers = await Product.find({ category: "bestseller" });
    res.json(bestSellers);
  } catch (err) {
    res.status(500).json({ message: "Fetching best sellers failed." });
  }
});

router.get("/pant", async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Fetching products failed." });
  }
});

router.post("/add", async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Brown Jeans",
        price: 1899,
        originalPrice: 3226,
        discount: 41,
        image: "/pants/bjeans.jpg",
        category: "pants",
      },
      {
        name: "White Silk Pajama Set",
        price: 1899,
        originalPrice: 2847,
        discount: 33,
        image: "/bestseller/whsilkpj.jpg",
        category: "bestseller",
      },
      {
        name: "White Long Coat",
        price: 2199,
        image: "/bestseller/wcoat.jpg",
        category: "bestseller",
      },
      {
        name: "Polka Pajama Set",
        price: 2299,
        image: "/bestseller/polkapj.jpg",
        category: "bestseller",
      },
      {
        name: "White Tshirt",
        price: 2399,
        image: "/bestseller/whi.jpg",
        category: "bestseller",
      },
      {
        name: "Black Silk Pajama Set",
        price: 1234,
        image: "/bestseller/blsipj.jpg",
        category: "bestseller",
      },
      {
        name: "Red Leather Coat",
        price: 4312,
        image: "/bestseller/redlejacket.jpg",
        category: "bestseller",
      },
      {
        name: "Floral Print Satin Skirt",
        price: 3999,
        image: "/bestseller/silskirt.jpg",
        category: "bestseller",
      },
      {
        name: "High Waist Jeans",
        price: 1499,
        image: "/bestseller/highj.jpg",
        category: "bestseller",
      },
      {
        name: "Wool co-ord set",
        price: 5999,
        image: "/bestseller/wollset.jpg",
        category: "bestseller",
      },
      {
        name: "Minimal Pastel Pink Lehenga",
        price: 1299,
        image: "/bestseller/pinleh.jpg",
        category: "bestseller",
      },
      {
        name: "Floral Print Crop Top",
        price: 999,
        image: "/bestseller/redt.jpg",
        category: "bestseller",
      },
      {
        name: "Full Set pj",
        price: 1900,
        image: "/bestseller/bwpj.jpg",
        category: "bestseller",
      },
      {
        name: "Black Skinny Jeans",
        price: 2341,
        image: "/bestseller/blskinny.jpg",
        category: "bestseller",
      },
      // ... other products
    ];
    await Product.insertMany(sampleProducts);
    res.status(201).json({ message: "Products seeded" });
  } catch (err) {
    res.status(500).json({ message: "Seeding failed" });
    console.log(err);
  }
});

module.exports = router;
