const express = require("express");
const router = express.Router();
// const handlePurchase = require("../controllers/purchaseController");
// const getPurchases = require("../controllers/purchaseController");
// const getUserPurchases = require("../controllers/purchaseController");
const {
  handlePurchase,
  getPurchases,
  getUserPurchases,
} = require("../controllers/purchaseController");

const authenticate = require("../middleware/auth");

router.get("/orders/me", authenticate, getUserPurchases);

router.post("/add", handlePurchase);

// Get all orders
router.get("/all", getPurchases);

// Get orders by user ID
// router.get("/user/:userId", getUserPurchases);

module.exports = router;
