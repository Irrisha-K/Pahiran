// models/Order.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: {
    _id: false,
    id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String },
  },
  items: [
    {
      _id: false,
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true },
    },
  ],
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true, default: "COD" },

  status: {
    type: String,
    enum: [
      "pending",
      "processing",
      "shipped",
      "out_for_delivery",
      "delivered",
      "cancelled",
    ],
    default: "pending",
  },

  // ✅ tracks who cancelled — "user" or "admin"
  cancelledBy: { type: String, enum: ["user", "admin"], default: null },

  refundStatus: {
    type: String,
    enum: ["none", "requested", "processing", "refunded"],
    default: "none",
  },
  refundNote: { type: String, default: "" },
  khaltiPhone: { type: String, default: null },
  refundScheduledAt: { type: Date, default: null },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Order", orderSchema);
