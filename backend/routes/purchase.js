// routes/purchaseRoutes.js
const express = require("express");
const router = express.Router();
const {
  handlePurchase,
  getPurchases,
  getUserPurchases,
  updateStatus,
  cancelOrder,
  updateRefundStatus,
} = require("../controllers/purchaseController");
const authenticate = require("../middleware/auth");

router.patch("/orders/:id/status", updateStatus); // admin
router.patch("/orders/:id/refund", updateRefundStatus); // admin + user
router.patch("/orders/:id/cancel", authenticate, cancelOrder); // user
router.get("/orders/me", authenticate, getUserPurchases);
router.post("/add", handlePurchase);
router.get("/all", getPurchases);

module.exports = router;
