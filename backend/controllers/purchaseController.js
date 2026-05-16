// controllers/purchaseController.js
const Product = require("../models/Products");
const Order = require("../models/Order");
const User = require("../models/User");

const fmt = (n) => Number(n).toLocaleString("en-IN");
const ONE_HOUR = 60 * 60 * 1000;

// ── POST /api/purchase/add ────────────────────────────────────────────────────
const handlePurchase = async (req, res) => {
  try {
    const { items, user, paymentMethod, khaltiPhone } = req.body;
    if (!items?.length || !user?.name || !user?.phone)
      return res.status(400).json({ message: "Missing required fields." });

    let total = 0;
    const errors = [],
      snappedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.id);
      if (!product || !product.isActive) {
        errors.push(`Not available: ${item.name}`);
        continue;
      }
      if (product.quantity < item.quantity) {
        errors.push(`Low stock: ${product.name}`);
        continue;
      }
      product.quantity -= item.quantity;
      await product.save();
      total += product.price * item.quantity;
      snappedItems.push({
        id: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });
    }

    if (errors.length)
      return res.status(400).json({ message: errors.join(", ") });

    const newOrder = new Order({
      user,
      items: snappedItems,
      total,
      paymentMethod: paymentMethod || "COD",
      khaltiPhone: paymentMethod === "Khalti" ? khaltiPhone || null : null,
    });
    await newOrder.save();
    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// ── GET /api/purchase/all  (admin) ────────────────────────────────────────────
const getPurchases = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch orders" });
  }
};

// ── GET /api/purchase/orders/me  (user) ───────────────────────────────────────
const getUserPurchases = async (req, res) => {
  try {
    const orders = await Order.find({ "user.id": req.user.id }).sort({
      createdAt: -1,
    });
    return res.status(200).json({ orders });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch orders for user" });
  }
};

// ── PATCH /api/purchase/orders/:id/status  (admin) ────────────────────────────
// When admin changes status to "cancelled":
//   • Sets cancelledBy: "admin"
//   • Restores stock
//   • For Khalti orders → schedules refund in 1 hour with "product unavailable" note
const updateStatus = async (req, res) => {
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
    if (!allowed.includes(status))
      return res.status(400).json({ message: "Invalid status value" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // ── Admin cancellation logic ─────────────────────────────────────────────
    if (status === "cancelled" && order.status !== "cancelled") {
      order.cancelledBy = "admin";

      // Restore stock for each item
      for (const item of order.items)
        await Product.findByIdAndUpdate(item.id, {
          $inc: { quantity: item.quantity },
        });

      // Schedule Khalti refund with a meaningful message
      if (order.paymentMethod === "Khalti" && order.refundStatus === "none") {
        const refundAt = new Date(Date.now() + ONE_HOUR);
        order.refundStatus = "processing";
        order.refundScheduledAt = refundAt;
        order.refundNote = `One or more items in your order are no longer available. Rs ${fmt(order.total)} will be refunded to your Khalti wallet within 1 hour.`;
      } else if (order.paymentMethod === "COD") {
        order.refundNote =
          "This order was cancelled by the store. One or more items are no longer available. No payment was collected (COD).";
      }
    }

    order.status = status;
    await order.save();
    return res.json({ order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── PATCH /api/purchase/orders/:id/cancel  (user) ────────────────────────────
// User cancels — only pending/processing. Khalti → schedules refund 1 hour out.
const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.user.id.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorised" });
    if (!["pending", "processing"].includes(order.status))
      return res
        .status(400)
        .json({
          message: `Cannot cancel — order is "${order.status}". Contact support.`,
        });

    for (const item of order.items)
      await Product.findByIdAndUpdate(item.id, {
        $inc: { quantity: item.quantity },
      });

    order.status = "cancelled";
    order.cancelledBy = "user";

    let message = "Order cancelled successfully.";

    if (order.paymentMethod === "Khalti") {
      const refundAt = new Date(Date.now() + ONE_HOUR);
      order.refundStatus = "processing";
      order.refundScheduledAt = refundAt;
      order.refundNote = `Rs ${fmt(order.total)} will be refunded to your Khalti wallet within 1 hour.`;
      message = `Order cancelled. Rs ${fmt(order.total)} will be refunded to your Khalti wallet within 1 hour.`;
    } else {
      order.refundNote = "COD order — no monetary refund applicable.";
    }

    await order.save();
    return res.json({ message, order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ── PATCH /api/purchase/orders/:id/refund  (admin + user request) ─────────────
const updateRefundStatus = async (req, res) => {
  try {
    const { refundStatus, refundNote } = req.body;
    const allowed = ["none", "requested", "processing", "refunded"];
    if (!allowed.includes(refundStatus))
      return res.status(400).json({ message: "Invalid refund status" });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Admin manually marking as refunded → pay out immediately
    if (
      refundStatus === "refunded" &&
      order.refundStatus !== "refunded" &&
      order.paymentMethod === "Khalti"
    ) {
      const user = await User.findById(order.user.id);
      if (user) {
        user.khaltiBalance += order.total;
        await user.save();
      }
      order.refundScheduledAt = null;
    }

    // Admin setting to processing → schedule 1 hour if not already scheduled
    if (
      refundStatus === "processing" &&
      order.paymentMethod === "Khalti" &&
      !order.refundScheduledAt
    ) {
      order.refundScheduledAt = new Date(Date.now() + ONE_HOUR);
    }

    order.refundStatus = refundStatus;
    if (refundNote !== undefined) order.refundNote = refundNote;
    await order.save();
    return res.json({ order });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  handlePurchase,
  getPurchases,
  getUserPurchases,
  updateStatus,
  cancelOrder,
  updateRefundStatus,
};
