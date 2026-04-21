const express = require("express");
const router = express.Router();
const {
  handlePurchase,
  getPurchases,
  getUserPurchases,
} = require("../controllers/purchaseController");
const authenticate = require("../middleware/auth");

// ⚠️  Import your Order model — adjust path to match your project
const Order = require("../models/Order");

// ── PATCH: Update order status (Admin only) ──────────────────────────────────
// Called by AdminOrdersPage when admin changes the dropdown
router.patch("/orders/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    const allowed = [
      "pending",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ];
    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ order });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ── GET: Orders for the logged-in user ───────────────────────────────────────
router.get("/orders/me", authenticate, getUserPurchases);

// ── POST: Create a new order ─────────────────────────────────────────────────
router.post("/add", handlePurchase);

// ── GET: All orders (Admin) ───────────────────────────────────────────────────
router.get("/all", getPurchases);

module.exports = router;
