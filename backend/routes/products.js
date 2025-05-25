const express = require("express");
const Product = require("../models/Products");
const productControllers = require("../controllers/Products-controllers");

const router = express.Router();

router.get("/pants", async (req, res) => {
  try {
    const pants = await Product.find({ category: "pants" });
    res.json(pants);
  } catch (err) {
    res.status(500).json({ message: "Fetching Pants failed." });
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

        description:
          "These brown jeans offer a vintage vibe with a soft, muted tone. They’re great for everyday wear, pairing effortlessly with both dark and light tops. The fit is relaxed with a structured design for durability.",
        quantity: 12,
      },
      {
        name: "Blue Jeans",
        price: 2099,
        originalPrice: 3499,
        discount: 40,
        image: "/pants/bjes.jpg",
        category: "pants",
        description:
          "Classic blue denim jeans that never go out of style. These jeans feature a mid-rise waist and wide-leg cut. Perfect for casual outings or dressed up with a blazer.",
        quantity: 32,
      },
      {
        name: "Blue Jean Shorts",
        price: 1399,
        originalPrice: 2499,
        discount: 44,
        image: "/pants/bjsho.jpg",
        category: "pants",
        description:
          "These classic blue jean shorts are a summer essential. With a raw hem and casual vibe, they offer comfort and breathability. Style them with crop tops or loose tees for a laid-back look.",
        quantity: 23,
      },
      {
        name: "Black Button Trousers",
        price: 2299,
        originalPrice: 3899,
        discount: 41,
        image: "/pants/blbo.jpg",
        category: "pants",
        description:
          "These wide-leg black trousers feature a stylish button detail at the waist. Great for formal or semi-formal occasions. The fabric drapes beautifully for an elegant look.",
        quantity: 14,
      },
      {
        name: "Black Leather Pants",
        price: 2599,
        originalPrice: 4199,
        discount: 38,
        image: "/pants/bleather.jpg",
        category: "pants",
        description:
          "Make a bold statement with these sleek black faux leather pants. The high-waist and flare design add drama to any outfit. Perfect for night outs and concerts.",
        quantity: 17,
      },
      {
        name: "Blue Line Shorts",
        price: 999,
        originalPrice: 1799,
        discount: 44,
        image: "/pants/blinesho.jpg",
        category: "pants",
        description:
          "Sporty and functional, these blue line shorts are great for workouts or lounging. The white side stripes add a classic athletic touch. Breathable and lightweight material for all-day comfort.",
        quantity: 22,
      },
      {
        name: "Black Joggers",
        price: 1499,
        originalPrice: 2699,
        discount: 44,
        image: "/pants/bljo.jpg",
        category: "pants",
        description:
          "Comfort meets style with these black joggers. Featuring an elastic waistband and ankle cuffs. Ideal for athleisure looks or cozy days at home.",
        quantity: 18,
      },
      {
        name: "Black Midi Skirt Pants",
        price: 1899,
        originalPrice: 3199,
        discount: 41,
        image: "/pants/blmid.jpg",
        category: "pants",
        description:
          "These black midi skirt-pants blend skirt aesthetics with pant comfort. Great for professional or evening wear. Offers ease of movement while keeping your look chic.",
        quantity: 25,
      },
      {
        name: "Black Track Pants",
        price: 1599,
        originalPrice: 2799,
        discount: 43,
        image: "/pants/bltrack.jpg",
        category: "pants",
        description:
          "Athletic-inspired black track pants with white stripes. Ideal for daily workouts or sporty casual looks. The elasticated waist provides maximum flexibility.",
        quantity: 30,
      },
      {
        name: "Brown Midi Shorts",
        price: 1299,
        originalPrice: 2199,
        discount: 41,
        image: "/pants/bmid.jpg",
        category: "pants",
        description:
          "Earthy-toned brown midi shorts that offer a structured fit. Designed for both casual and smart-casual wear. Comfortable and breathable fabric for warm days.",
        quantity: 30,
      },
      {
        name: "Bow Tie Jeans",
        price: 2299,
        originalPrice: 3999,
        discount: 43,
        image: "/pants/bow.jpg",
        category: "pants",
        description:
          "Unique bow-tie style denim jeans that stand out from the crowd. A perfect piece for fashion-forward individuals. The high waist and wide legs enhance comfort and trendiness.",
        quantity: 28,
      },
      {
        name: "Beige Shorts",
        price: 1199,
        originalPrice: 1999,
        discount: 40,
        image: "/pants/brsho.jpg",
        category: "pants",
        description:
          "Light beige shorts perfect for spring and summer. These mid-thigh shorts bring a tailored yet relaxed vibe. Pair well with tucked-in tops or flowy blouses.",
        quantity: 19,
      },
      {
        name: "Black Sports Shorts",
        price: 999,
        originalPrice: 1599,
        discount: 37,
        image: "/pants/bsho.jpg",
        category: "pants",
        description:
          "These black sports shorts are lightweight and flexible. With white piping detail, they offer a retro athletic feel. Great for gym sessions or casual home wear.",
        quantity: 15,
      },
      {
        name: "Blue Pleated Skirt Shorts",
        price: 1399,
        originalPrice: 2399,
        discount: 42,
        image: "/pants/bushort.jpg",
        category: "pants",
        description:
          "Tennis-inspired pleated skirt shorts in a deep blue shade. Offers the femininity of a skirt with the comfort of shorts. A great addition to sporty or casual outfits.",
        quantity: 23,
      },
      {
        name: "Checkered Pants",
        price: 1899,
        originalPrice: 3099,
        discount: 39,
        image: "/pants/chp.jpg",
        category: "pants",
        description:
          "These green-brown checkered pants bring vintage charm with a modern fit. Perfect for coffee dates, museums, or chill days. Soft material with a relaxed leg fit.",
        quantity: 26,
      },
      {
        name: "Dark Blue Wide Jeans",
        price: 1999,
        originalPrice: 3399,
        discount: 41,
        image: "/pants/dbwin.jpg",
        category: "pants",
        description:
          "These dark blue jeans have a wide-leg silhouette that’s flattering and trendy. Made with quality denim for durability. A versatile piece for casual or dressed-up outfits.",
        quantity: 35,
      },
      {
        name: "Floral Jean Shorts",
        price: 1099,
        originalPrice: 1999,
        discount: 45,
        image: "/pants/flojsho.jpg",
        category: "pants",
        description:
          "Cute and whimsical, these floral jean shorts add a pop of color. Ideal for beach days or picnics. Made with soft denim and playful prints.",
        quantity: 30,
      },
      {
        name: "Green Denim Shorts",
        price: 1199,
        originalPrice: 2099,
        discount: 43,
        image: "/pants/gdenim.jpg",
        category: "pants",
        description:
          "Tough yet breathable, these army green denim shorts are edgy and bold. Perfect for street style or festival wear. Rugged with a hint of military influence.",
        quantity: 28,
      },
      {
        name: "Green Parachute Pants",
        price: 1599,
        originalPrice: 2699,
        discount: 41,
        image: "/pants/gp.jpg",
        category: "pants",
        description:
          "Trendy green parachute pants with adjustable drawstrings. Lightweight and perfect for an urban aesthetic. The loose fit and side pockets add both style and functionality.",
        quantity: 20,
      },
      {
        name: "Grey Cotton Shorts",
        price: 1099,
        originalPrice: 1899,
        discount: 42,
        image: "/pants/gsho.jpg",
        category: "pants",
        description:
          "Soft and breathable grey cotton shorts ideal for lounging or light activity. The relaxed fit provides maximum comfort. A wardrobe staple for cozy days.",
        quantity: 24,
      },
      {
        name: "Black Utility Cargo Pants",
        price: 1899,
        originalPrice: 3199,
        discount: 41,
        image: "/pants/jeans.jpg",
        category: "pants",
        description:
          "These black cargo pants are designed for utility and comfort. With multiple pockets and a durable fabric. Ideal for edgy streetwear looks or daily wear.",
        quantity: 34,
      },
      {
        name: "Light Blue Jeans",
        price: 1999,
        originalPrice: 3499,
        discount: 43,
        image: "/pants/llj.jpg",
        category: "pants",
        description:
          "Timeless light blue jeans with a casual aesthetic. Straight-leg fit for all-day ease. Great for summer looks and relaxed weekends.",
        quantity: 23,
      },
      {
        name: "Orange Pleated Skirt",
        price: 1399,
        originalPrice: 2299,
        discount: 39,
        image: "/pants/orp.jpg",
        category: "pants",
        description:
          "This coral-orange pleated skirt flows with elegance. Great for brunch or casual strolls. Lightweight and perfect for warm weather.",
        quantity: 33,
      },
      {
        name: "Pink Check Pants",
        price: 1499,
        originalPrice: 2599,
        discount: 42,
        image: "/pants/pcheck.jpg",
        category: "pants",
        description:
          "These pink check pants are fun and expressive. Light fabric with a loose fit makes them ideal for lounging or casual outings. Add color to your daily fits!",
        quantity: 18,
      },
      {
        name: "Pink Shorts",
        price: 1199,
        originalPrice: 1999,
        discount: 40,
        image: "/pants/pish.jpg",
        category: "pants",
        description:
          "Soft pink shorts made from cotton blend for ultra comfort. Feminine and casual, perfect for warm sunny days. Elastic waistband ensures a great fit.",
        quantity: 26,
      },
      {
        name: "White Lounge Pants",
        price: 1399,
        originalPrice: 2399,
        discount: 41,
        image: "/pants/whst.jpg",
        category: "pants",
        description:
          "These white pants are perfect for lounging or relaxed weekend looks. Made from breathable material for softness and comfort. Easy to match with neutral or bold tops.",
        quantity: 40,
      },
      {
        name: "White Sweatpants",
        price: 1499,
        originalPrice: 2599,
        discount: 42,
        image: "/pants/wst.jpg",
        category: "pants",
        description:
          "Basic white sweatpants with a comfy, relaxed vibe. Ideal for gym warm-ups or at-home chill. Features elastic cuffs and waistband.",
        quantity: 37,
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
