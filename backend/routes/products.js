const express = require("express");
const Product = require("../models/Products");
const productControllers = require("../controllers/Products-controllers");

const router = express.Router();

// GET /api/products?category=...&exclude=...
router.get("/", async (req, res) => {
  const { category, exclude } = req.query;
  try {
    let query = {};
    if (category) {
      query.category = category;
    }
    if (exclude) {
      query._id = { $ne: exclude }; // exclude current product
    }

    const products = await Product.find(query);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: "Fetching products failed." });
  }
});

router.get("/pants", async (req, res) => {
  try {
    const pants = await Product.find({ category: "pants" });
    res.json(pants);
  } catch (err) {
    res.status(500).json({ message: "Fetching Pants failed." });
  }
});

router.get("/tops", async (req, res) => {
  try {
    const tops = await Product.find({ category: "tops" });
    res.json(tops);
  } catch (err) {
    res.status(500).json({ message: "Fetching Pants failed." });
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

router.post("/add", async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: "Navy Collar Crop Top",
        price: 1899,
        originalPrice: 3226,
        discount: 41,
        image: "/tops/bc.jpg",
        category: "tops",
        description:
          "This navy blue crop top features a smart collar design and a fitted cut that flatters any silhouette. Ideal for semi-casual settings and daily wear. Comfortable fabric ensures ease throughout the day.",
        quantity: 23,
      },
      {
        name: "Black Wool Coat",
        price: 2899,
        originalPrice: 4299,
        discount: 33,
        image: "/tops/bcoat.jpg",
        category: "tops",
        description:
          "This black wool coat offers timeless elegance with a cozy inner lining. Great for layering in colder seasons. Structured for a polished yet comfortable look.",
        quantity: 17,
      },
      {
        name: "Blue Floral Oversized Tee",
        price: 999,
        originalPrice: 1499,
        discount: 33,
        image: "/tops/bflo.jpg",
        category: "tops",
        description:
          "Stay fresh and stylish with this blue oversized tee featuring a floral print. Loose fit ensures breathability. Ideal for warm-weather days and layering over jeans.",
        quantity: 34,
      },
      {
        name: "Striped Black Blouse",
        price: 1349,
        originalPrice: 1999,
        discount: 33,
        image: "/tops/bgstrip.jpg",
        category: "tops",
        description:
          "A timeless striped blouse in monochrome black. It pairs perfectly with formal and casual bottoms. Soft and breathable material makes it an everyday essential.",
        quantity: 20,
      },
      {
        name: "Leather Hoodie Jacket",
        price: 2499,
        originalPrice: 3899,
        discount: 36,
        image: "/tops/blethj.jpg",
        category: "tops",
        description:
          "This leather-look hoodie jacket adds an urban edge to your look. Includes a zipper and hood for functionality. Stylish and perfect for transitional weather.",
        quantity: 18,
      },
      {
        name: "Black High Neck Cape",
        price: 1799,
        originalPrice: 2799,
        discount: 36,
        image: "/tops/blhi.jpg",
        category: "tops",
        description:
          "An elegant high-neck cape in black that drapes beautifully. Great for layering over formal wear. Keeps you warm while maintaining a clean silhouette.",
        quantity: 25,
      },
      {
        name: "Button-Up Peplum Top",
        price: 1599,
        originalPrice: 2449,
        discount: 35,
        image: "/tops/bltop.jpg",
        category: "tops",
        description:
          "Peplum cut top with button accents for a structured, flattering fit. Adds a touch of sophistication to casual outings. Soft fabric ensures all-day wearability.",
        quantity: 27,
      },
      {
        name: "Blue Graphic Tee",
        price: 899,
        originalPrice: 1399,
        discount: 36,
        image: "/tops/bluet.jpg",
        category: "tops",
        description:
          "A casual graphic tee in faded blue, perfect for everyday wear. Unique print adds personality to any look. Pairs well with joggers or denim.",
        quantity: 40,
      },
      {
        name: "Baseball Sleeve T-Shirt",
        price: 1099,
        originalPrice: 1749,
        discount: 37,
        image: "/tops/bt.jpg",
        category: "tops",
        description:
          "Retro-inspired t-shirt with contrasting baseball sleeves. Made of breathable cotton for comfort. Ideal for laid-back and sporty looks.",
        quantity: 21,
      },
      {
        name: "Blue Half-Zip Hoodie",
        price: 1799,
        originalPrice: 2899,
        discount: 38,
        image: "/tops/buhook.jpg",
        category: "tops",
        description:
          "Cozy half-zip hoodie in cool navy tone. Great for layering during fall and winter. Offers a snug fit and functional zip closure.",
        quantity: 22,
      },
      {
        name: "Sky Blue Cardigan",
        price: 1399,
        originalPrice: 2099,
        discount: 33,
        image: "/tops/buswea.jpg",
        category: "tops",
        description:
          "Soft and stylish, this cardigan features a pastel blue tone perfect for spring. Lightweight knit material adds layering options. Great over tanks or tees.",
        quantity: 30,
      },
      {
        name: "Teal Shoulder-Knit Sweater",
        price: 1699,
        originalPrice: 2599,
        discount: 35,
        image: "/tops/busweat.jpg",
        category: "tops",
        description:
          "This open-shoulder sweater in teal green adds playful charm to cozy fashion. Chunky knit design offers warmth. Great with jeans or skirts.",
        quantity: 26,
      },
      {
        name: "Layered Shirt Vest Combo",
        price: 1599,
        originalPrice: 2399,
        discount: 33,
        image: "/tops/bwshirt.jpg",
        category: "tops",
        description:
          "This chic layered top combines a crisp white shirt with a black sweater vest. Ideal for smart-casual occasions. Stylish and functional in cooler weather.",
        quantity: 28,
      },
      {
        name: "Beige Pleated Blouse",
        price: 1449,
        originalPrice: 2199,
        discount: 34,
        image: "/tops/cbl.jpg",
        category: "tops",
        description:
          "Elegant beige blouse with soft pleats. Perfect for workwear or elegant evenings. Pairs beautifully with formal trousers or skirts.",
        quantity: 20,
      },
      {
        name: "Checked Overcoat",
        price: 2699,
        originalPrice: 4299,
        discount: 37,
        image: "/tops/checkcoat.jpg",
        category: "tops",
        description:
          "A check-patterned overcoat that adds texture and charm to winter outfits. Medium length for extra coverage. Blends warmth with professional flair.",
        quantity: 19,
      },
      {
        name: "Cream Knit Sweater Coat",
        price: 1799,
        originalPrice: 2849,
        discount: 37,
        image: "/tops/creamswe.jpg",
        category: "tops",
        description:
          "Thick and cozy, this cream sweater coat feels like a warm hug. Ideal for chilly mornings or layered winter outfits. Features soft-textured fabric.",
        quantity: 24,
      },
      {
        name: "Floral Embroidered Crop Top",
        price: 1349,
        originalPrice: 2099,
        discount: 36,
        image: "/tops/etop.jpg",
        category: "tops",
        description:
          "A soft and feminine crop top with floral embroidery. Flowy hem for added charm. Ideal for spring and summer events.",
        quantity: 15,
      },
      {
        name: "Olive Formal Blazer",
        price: 2199,
        originalPrice: 3499,
        discount: 37,
        image: "/tops/forcr.jpg",
        category: "tops",
        description:
          "Classic olive green blazer for smart and professional looks. Tailored fit ensures a sharp silhouette. Great for office or interviews.",
        quantity: 14,
      },
      {
        name: "Green Cable-Knit Sweater",
        price: 1699,
        originalPrice: 2599,
        discount: 35,
        image: "/tops/grhinech.jpg",
        category: "tops",
        description:
          "This vibrant green sweater features a traditional cable-knit design. Cozy, durable, and eye-catching. Perfect for cold seasons.",
        quantity: 22,
      },
      {
        name: "Olive Military Jacket",
        price: 1899,
        originalPrice: 2999,
        discount: 37,
        image: "/tops/grja.jpg",
        category: "tops",
        description:
          "Military-style jacket with utility pockets. Lightweight yet warm. Ideal for layering over casual outfits.",
        quantity: 25,
      },
      {
        name: "Olive Ribbed Sweater",
        price: 1599,
        originalPrice: 2399,
        discount: 33,
        image: "/tops/grsweat.jpg",
        category: "tops",
        description:
          "Chunky rib-knit sweater in an earthy olive green. Relaxed fit makes it perfect for layering. Cozy and timeless for fall and winter.",
        quantity: 21,
      },
      {
        name: "Button-Up Sage Cardigan",
        price: 1449,
        originalPrice: 2149,
        discount: 33,
        image: "/tops/gsewater.jpg",
        category: "tops",
        description:
          "A lightweight sage cardigan perfect for breezy days. Features classic buttons and a casual fit. Pairs well with both dresses and jeans.",
        quantity: 24,
      },
      {
        name: "Green Plaid Shirt",
        price: 1199,
        originalPrice: 1849,
        discount: 35,
        image: "/tops/gshi.jpg",
        category: "shirts",
        description:
          "Classic plaid button-up shirt with a rustic green palette. Great for layering or wearing solo. A staple for any casual wardrobe.",
        quantity: 30,
      },
      {
        name: "Green Striped Tee",
        price: 849,
        originalPrice: 1349,
        discount: 37,
        image: "/tops/gstri.jpg",
        category: "tops",
        description:
          "Relaxed green striped t-shirt for everyday comfort. Soft cotton fabric keeps it breathable. Ideal for laid-back weekends or under a jacket.",
        quantity: 28,
      },
      {
        name: "Green Drop Shoulder Sweater",
        price: 1649,
        originalPrice: 2549,
        discount: 35,
        image: "/tops/gswea.jpg",
        category: "tops",
        description:
          "Oversized sweater with dropped shoulders in earthy tones. Provides warmth without bulk. Perfect for cozy days at home or casual outings.",
        quantity: 22,
      },
      {
        name: "Grey Half-Zip Hoodie Vest",
        price: 1199,
        originalPrice: 1899,
        discount: 37,
        image: "/tops/half.jpg",
        category: "tops",
        description:
          "Versatile sleeveless hoodie vest in heather grey. Half-zip design adds edge to a minimal silhouette. Great for layering with long-sleeves.",
        quantity: 20,
      },
      {
        name: "Black Lace Tank Top",
        price: 999,
        originalPrice: 1599,
        discount: 38,
        image: "/tops/lacy.jpg",
        category: "tops",
        description:
          "This elegant black tank top features delicate lace trim. Feminine and flattering, perfect for date nights or under a blazer. Stretchy and soft material.",
        quantity: 18,
      },
      {
        name: "Lavender Knit Sweater",
        price: 1549,
        originalPrice: 2399,
        discount: 35,
        image: "/tops/lavswea.jpg",
        category: "tops",
        description:
          "Soft lavender knit sweater with a cozy and relaxed fit. Great for transitioning between seasons. Adds a pastel pop to your wardrobe.",
        quantity: 26,
      },
      {
        name: "Orange Loose Fit Pullover",
        price: 1499,
        originalPrice: 2249,
        discount: 33,
        image: "/tops/orcar.jpg",
        category: "tops",
        description:
          "Bright orange sweater with a loose, slouchy fit. Vibrant and cozy, perfect for adding energy to cold days. Great with jeans or leggings.",
        quantity: 23,
      },
      {
        name: "Lilac Wrap Crop Blouse",
        price: 1399,
        originalPrice: 2149,
        discount: 35,
        image: "/tops/pcross.jpg",
        category: "tops",
        description:
          "Chic wrap-style blouse in a soft lilac shade. Cropped cut and lightweight fabric make it perfect for spring outings. Great with high-rise bottoms.",
        quantity: 19,
      },
      {
        name: "Olive Skeleton Print Tee",
        price: 949,
        originalPrice: 1499,
        discount: 37,
        image: "/tops/pt.jpg",
        category: "tops",
        description:
          "Edgy skeleton-print tee in a muted olive tone. Adds a punk twist to your casual look. Great for casual hangouts or concerts.",
        quantity: 30,
      },
      {
        name: "Red Button Cardigan",
        price: 1599,
        originalPrice: 2449,
        discount: 35,
        image: "/tops/rswea.jpg",
        category: "tops",
        description:
          "Deep red cardigan with bold front buttons. A classic piece to elevate your winter wardrobe. Warm and easy to layer with any outfit.",
        quantity: 21,
      },
      {
        name: "Red Knit Cardigan with Lace Trim",
        price: 1749,
        originalPrice: 2649,
        discount: 34,
        image: "/tops/rlwaceswe.jpg",
        category: "tops",
        description:
          "Unique knit cardigan with lace-trimmed neckline. Vintage aesthetic with cozy functionality. Ideal for pairing with skirts or dresses.",
        quantity: 20,
      },
      {
        name: "Black Bell Sleeve Top",
        price: 1399,
        originalPrice: 2149,
        discount: 35,
        image: "/tops/sleetop.jpg",
        category: "tops",
        description:
          "Dramatic bell sleeves and a form-fitting cut define this black top. Ideal for parties and dressy evenings. Elegant, sleek, and eye-catching.",
        quantity: 17,
      },
      {
        name: "Beige Shirred Blouse",
        price: 1449,
        originalPrice: 2199,
        discount: 34,
        image: "/tops/stripsh.jpg",
        category: "tops",
        description:
          "Beige blouse with soft shirring details for a romantic feel. Lightweight and flowy for warm-weather wear. Easy to dress up or down.",
        quantity: 22,
      },
      {
        name: "Brown Striped Sweater",
        price: 1649,
        originalPrice: 2499,
        discount: 34,
        image: "/tops/stripswea.jpg",
        category: "tops",
        description:
          "Neutral-toned sweater with horizontal beige and brown stripes. Great for layering or wearing solo. Perfect for fall fashion lovers.",
        quantity: 24,
      },
      {
        name: "Ivory Cable Knit Sweater",
        price: 1749,
        originalPrice: 2649,
        discount: 34,
        image: "/tops/whswea.jpg",
        category: "tops",
        description:
          "Classic ivory cable knit sweater with a cozy texture. Warm, elegant, and timeless. Perfectly pairs with jeans or skirts.",
        quantity: 26,
      },
      {
        name: "Yellow Textured Sweater",
        price: 1549,
        originalPrice: 2399,
        discount: 35,
        image: "/tops/yswea.jpg",
        category: "tops",
        description:
          "Bright and cheerful yellow knit sweater. Adds a splash of sunshine to cold days. Soft texture and relaxed fit for maximum comfort.",
        quantity: 25,
      },
      {
        name: "Grey Zip-Up Hoodie",
        price: 1299,
        originalPrice: 1999,
        discount: 35,
        image: "/tops/zipup.jpg",
        category: "tops",
        description:
          "Classic grey zip-up hoodie with a soft fleece lining. Ideal for workouts, errands, or cozy lounging. Includes hood and front pockets.",
        quantity: 32,
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
