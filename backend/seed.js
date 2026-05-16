// seed.js
// Run with: node seed.js
// Make sure your .env has MONGODB_URI or update the connection string below

require("dotenv").config();
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Product = require("./models/Products"); // adjust path if needed

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY KEY:
//   "home"       → shows on Home page (featured section)
//   "newarrival" → shows on New Arrivals page
//   "bestseller" → shows on Best Seller page
//   "tops"       → Shop By → Tops
//   "pants"      → Shop By → Pants
//   "dresses"    → Shop By → Dresses
//   "skirts"     → Shop By → Skirts
//   "coords"     → Shop By → Co-ords
// ─────────────────────────────────────────────────────────────────────────────

const sampleProducts = [
  // ── HOME (Featured on homepage) ───────────────────────────────────────────
  {
    name: "Ivory Linen Blouse",
    description:
      "Effortlessly chic ivory linen blouse with relaxed sleeves. Perfect for casual days or dressed up with trousers.",
    price: 1299,
    originalPrice: 1899,
    discount: 32,
    image: "uploads/images/home/ivory-linen-blouse.jpg",
    category: "home",
    quantity: 30,
    isActive: true,
  },
  {
    name: "Sage Green Co-ord Set",
    description:
      "Matching crop top and wide-leg trouser set in a calming sage green. Lightweight and breathable fabric.",
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    image: "uploads/images/home/sage-coord-set.jpg",
    category: "home",
    quantity: 20,
    isActive: true,
  },
  {
    name: "Black Wrap Dress",
    description:
      "Classic wrap dress in solid black. Flattering V-neckline with a self-tie waist. Wear it anywhere.",
    price: 1799,
    originalPrice: 2499,
    discount: 28,
    image: "uploads/images/home/black-wrap-dress.jpg",
    category: "home",
    quantity: 25,
    isActive: true,
  },

  // ── NEW ARRIVALS ──────────────────────────────────────────────────────────
  {
    name: "Dusty Rose Puff Sleeve Top",
    description:
      "Romantic puff sleeve top in dusty rose. Features a smocked back for a comfortable fit.",
    price: 999,
    originalPrice: 1399,
    discount: 29,
    image: "uploads/images/newarrival/dusty-rose-puff-top.jpg",
    category: "newarrival",
    quantity: 40,
    isActive: true,
  },
  {
    name: "Camel Pleated Midi Skirt",
    description:
      "Elegant pleated midi skirt in warm camel. Sits at the waist and flows beautifully with every step.",
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    image: "uploads/images/newarrival/camel-pleated-midi-skirt.jpg",
    category: "newarrival",
    quantity: 18,
    isActive: true,
  },
  {
    name: "Stripe Knit Cardigan",
    description:
      "Cozy stripe knit cardigan with button-down front. Oversized fit in a warm cotton blend.",
    price: 1899,
    originalPrice: 2599,
    discount: 27,
    image: "uploads/images/newarrival/stripe-knit-cardigan.jpg",
    category: "newarrival",
    quantity: 22,
    isActive: true,
  },

  // ── BEST SELLERS ──────────────────────────────────────────────────────────
  {
    name: "White Cotton Shirt",
    description:
      "The perfect white shirt. Crisp cotton with a relaxed fit, slightly oversized silhouette.",
    price: 1199,
    originalPrice: 1699,
    discount: 29,
    image: "uploads/images/bestseller/white-cotton-shirt.jpg",
    category: "bestseller",
    quantity: 50,
    isActive: true,
  },
  {
    name: "High Waist Black Trousers",
    description:
      "Tailored high-waist trousers in classic black. Straight leg cut with a comfortable zip closure.",
    price: 1999,
    originalPrice: 2799,
    discount: 29,
    image: "uploads/images/bestseller/black-trousers.jpg",
    category: "bestseller",
    quantity: 35,
    isActive: true,
  },
  {
    name: "Floral Wrap Midi Dress",
    description:
      "Bestselling floral wrap dress with a deep V-neck and midi length. Available in a romantic print.",
    price: 2199,
    originalPrice: 2999,
    discount: 27,
    image: "uploads/images/bestseller/floral-wrap-midi-dress.jpg",
    category: "bestseller",
    quantity: 28,
    isActive: true,
  },

  // ── TOPS ─────────────────────────────────────────────────────────────────
  {
    name: "Ribbed Scoop Neck Tank",
    description:
      "Fitted ribbed tank top with a flattering scoop neckline. A wardrobe essential in soft stretch fabric.",
    price: 699,
    originalPrice: 999,
    discount: 30,
    image: "uploads/images/tops/ribbed-scoop-tank.jpg",
    category: "tops",
    quantity: 60,
    isActive: true,
  },
  {
    name: "Green Drop Shoulder Sweater",
    description:
      "Oversized sweater with dropped shoulders in earthy tones. Provides warmth without bulk.",
    price: 1649,
    originalPrice: 2549,
    discount: 35,
    image: "uploads/images/tops/gswea.jpg",
    category: "tops",
    quantity: 22,
    isActive: true,
  },
  {
    name: "Striped Cropped Tee",
    description:
      "Classic horizontal stripe cropped tee in navy and white. Pairs perfectly with high-waist bottoms.",
    price: 799,
    originalPrice: 1099,
    discount: 27,
    image: "uploads/images/tops/striped-crop-tee.jpg",
    category: "tops",
    quantity: 45,
    isActive: true,
  },
  {
    name: "Satin Cami Top",
    description:
      "Luxe satin cami with adjustable straps and a V-neckline. Wear it solo or layered under a blazer.",
    price: 899,
    originalPrice: 1299,
    discount: 31,
    image: "uploads/images/tops/satin-cami.jpg",
    category: "tops",
    quantity: 38,
    isActive: true,
  },

  // ── PANTS ─────────────────────────────────────────────────────────────────
  {
    name: "Wide Leg Linen Pants",
    description:
      "Breezy wide-leg pants in natural linen. Elastic waistband for all-day comfort.",
    price: 1799,
    originalPrice: 2399,
    discount: 25,
    image: "uploads/images/pants/wide-leg-linen-pants.jpg",
    category: "pants",
    quantity: 30,
    isActive: true,
  },
  {
    name: "Khaki Cargo Pants",
    description:
      "Relaxed cargo pants with functional pockets. A utility-inspired look in versatile khaki.",
    price: 2099,
    originalPrice: 2799,
    discount: 25,
    image: "uploads/images/pants/khaki-cargo-pants.jpg",
    category: "pants",
    quantity: 25,
    isActive: true,
  },
  {
    name: "Cream Straight Leg Jeans",
    description:
      "Clean straight-leg jeans in off-white. High-rise waist with a 5-pocket design.",
    price: 2299,
    originalPrice: 3099,
    discount: 26,
    image: "uploads/images/pants/cream-straight-jeans.jpg",
    category: "pants",
    quantity: 20,
    isActive: true,
  },

  // ── DRESSES ───────────────────────────────────────────────────────────────
  {
    name: "Lilac Ruffle Hem Dress",
    description:
      "Dreamy lilac dress with a ruffled hem and smocked bodice. Lightweight chiffon fabric.",
    price: 1999,
    originalPrice: 2799,
    discount: 29,
    image: "uploads/images/dresses/lilac-ruffle-dress.jpg",
    category: "dresses",
    quantity: 18,
    isActive: true,
  },
  {
    name: "Brown Shirt Dress",
    description:
      "Relaxed shirt dress in warm brown. Features a button-down front and a belted waist.",
    price: 2299,
    originalPrice: 3099,
    discount: 26,
    image: "uploads/images/dresses/brown-shirt-dress.jpg",
    category: "dresses",
    quantity: 22,
    isActive: true,
  },
  {
    name: "Navy Slip Dress",
    description:
      "Minimal slip dress in navy satin-finish fabric. Bias cut for a fluid, elegant drape.",
    price: 1699,
    originalPrice: 2299,
    discount: 26,
    image: "uploads/images/dresses/navy-slip-dress.jpg",
    category: "dresses",
    quantity: 16,
    isActive: true,
  },

  // ── SKIRTS ────────────────────────────────────────────────────────────────
  {
    name: "Cloud Satin Skirt",
    description:
      "Light as a cloud, this pale satin skirt glides with every step. The soft sheen adds quiet luxury.",
    price: 1799,
    originalPrice: 2899,
    discount: 38,
    image: "uploads/images/skirts/sil.jpg",
    category: "skirts",
    quantity: 28,
    isActive: true,
  },
  {
    name: "Denim Mini Skirt",
    description:
      "Classic denim mini skirt with a button-front closure. An off-duty staple in medium wash.",
    price: 1399,
    originalPrice: 1899,
    discount: 26,
    image: "uploads/images/skirts/denim-mini-skirt.jpg",
    category: "skirts",
    quantity: 32,
    isActive: true,
  },
  {
    name: "Flowy Maxi Skirt",
    description:
      "Romantic flowy maxi skirt in a soft chiffon blend. Elastic waist with a subtle A-line shape.",
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    image: "uploads/images/skirts/flowy-maxi-skirt.jpg",
    category: "skirts",
    quantity: 24,
    isActive: true,
  },

  // ── CO-ORDS ───────────────────────────────────────────────────────────────
  {
    name: "Terracotta Linen Co-ord",
    description:
      "Earthy terracotta linen set with a relaxed blazer and matching wide-leg trousers. Effortless and polished.",
    price: 3299,
    originalPrice: 4499,
    discount: 27,
    image: "uploads/images/coords/terracotta-linen-coord.jpg",
    category: "coords",
    quantity: 15,
    isActive: true,
  },
  {
    name: "White Knit Co-ord Set",
    description:
      "Matching knit bralette and midi skirt in crisp white. A fresh, minimal set for warm days.",
    price: 2799,
    originalPrice: 3799,
    discount: 26,
    image: "uploads/images/coords/white-knit-coord.jpg",
    category: "coords",
    quantity: 18,
    isActive: true,
  },
  {
    name: "Chocolate Brown Suit Set",
    description:
      "Power-dressing chocolate brown blazer and trouser co-ord. Structured shoulders with a tapered leg.",
    price: 3999,
    originalPrice: 5299,
    discount: 25,
    image: "uploads/images/coords/brown-suit-set.jpg",
    category: "coords",
    quantity: 12,
    isActive: true,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Ensure all upload folders exist
// ─────────────────────────────────────────────────────────────────────────────
const categories = [
  "home",
  "newarrival",
  "bestseller",
  "tops",
  "pants",
  "dresses",
  "skirts",
  "coords",
];

categories.forEach((cat) => {
  const dir = path.join(__dirname, "uploads", "images", cat);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created folder: uploads/images/${cat}`);
  }
});

// ─────────────────────────────────────────────────────────────────────────────
// Connect and seed
// ─────────────────────────────────────────────────────────────────────────────
const MONGO_URI =
  process.env.MONGODB_URI ||
  "mongodb+srv://irrishakayastha25:O5VBpxUljdz1SUEB@cluster0.c3ah54m.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0";

mongoose
  .connect(MONGO_URI)
  .then(async () => {
    console.log("✅ Connected to MongoDB");

    // Optional: clear existing products before seeding
    // Comment this out if you want to ADD to existing products instead of replacing
    await Product.deleteMany({});
    console.log("🗑️  Cleared existing products");

    const inserted = await Product.insertMany(sampleProducts);
    console.log(`\n✅ Inserted ${inserted.length} products successfully`);

    // Summary by category
    const summary = {};
    sampleProducts.forEach((p) => {
      summary[p.category] = (summary[p.category] || 0) + 1;
    });
    console.log("\n📊 Products by category:");
    Object.entries(summary).forEach(([cat, count]) => {
      console.log(`   ${cat.padEnd(12)} → ${count} products`);
    });

    console.log("\n⚠️  Remember to add your actual product images to:");
    categories.forEach((cat) => {
      console.log(`   uploads/images/${cat}/`);
    });

    mongoose.disconnect();
  })
  .catch((err) => {
    console.error("❌ Seeding failed:", err.message);
    mongoose.disconnect();
  });
