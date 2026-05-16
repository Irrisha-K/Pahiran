// routes/khaltiRoutes.js
const express = require("express");
const router = express.Router();
const { pay, getBalance } = require("../controllers/khaltiController");
const authenticate = require("../middleware/auth");

// POST /api/khalti/pay  — deduct from wallet (called before order creation)
router.post("/pay", pay);

// GET /api/khalti/balance  — get current balance (shown on Khalti page)
router.get("/balance", authenticate, getBalance);

module.exports = router;
