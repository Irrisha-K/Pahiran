// controllers/purchaseController.js
const Product = require("../models/Products");
const Order = require("../models/Order");

const handlePurchase = async (req, res) => {
  try {
    const { items, user, paymentMethod } = req.body;

    if (!items?.length || !user?.name || !user?.phone) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    let total = 0;
    const errors = [];

    for (const item of items) {
      const product = await Product.findById(item.id);

      if (!product) {
        errors.push(`Product not found: ${item.name}`);
        continue;
      }

      if (product.quantity < item.quantity) {
        errors.push(`Insufficient stock for ${product.name}`);
        continue;
      }

      product.quantity -= item.quantity;
      await product.save();

      total += product.price * item.quantity;
    }

    if (errors.length > 0) {
      return res.status(400).json({ message: errors.join(", ") });
    }

    const newOrder = new Order({
      user,
      items,
      total,
      paymentMethod: paymentMethod || "COD",
    });

    await newOrder.save();

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error("Error placing order:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const getPurchases = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("items.id", "name price")
      .populate("user.id", "name email");

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const getUserPurchases = async (req, res) => {
  try {
    const userId = req.user.id; // user ID from the decoded JWT

    const orders = await Order.find({ "user.id": userId }).sort({
      createdAt: -1,
    });

    return res.status(200).json({ orders });
  } catch (err) {
    console.error("Error fetching user's orders:", err);
    return res.status(500).json({ message: "Failed to fetch orders for user" });
  }
};

module.exports = handlePurchase;
module.exports = getPurchases;
module.exports = getUserPurchases;
