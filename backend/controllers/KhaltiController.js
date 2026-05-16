// controllers/khaltiController.js
const User = require("../models/User");
const Order = require("../models/Order");

// ── POST /api/khalti/pay ──────────────────────────────────────────────────────
// Called by KhaltiPaymentPage BEFORE creating the order.
// 1. Find the user by userId from JWT
// 2. Validate the phone they entered matches their saved khaltiPhone
//    (or save it if they're paying for the first time)
// 3. Check they have enough balance
// 4. Deduct amount and return new balance
// The actual order creation still goes through /api/purchase/add
const pay = async (req, res) => {
  try {
    const { userId, phone, amount } = req.body;

    if (!userId || !phone || !amount) {
      return res
        .status(400)
        .json({ message: "userId, phone and amount are required" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // First-time Khalti use: register the phone to this account
    if (!user.khaltiPhone) {
      user.khaltiPhone = phone;
    } else if (user.khaltiPhone !== phone) {
      // Phone doesn't match the one registered to this account
      return res.status(400).json({
        message: "Phone number does not match your registered Khalti wallet",
      });
    }

    if (user.khaltiBalance < amount) {
      return res.status(402).json({
        message: `Insufficient balance. Your wallet has Rs ${user.khaltiBalance.toLocaleString("en-IN")} but order is Rs ${Number(amount).toLocaleString("en-IN")}`,
        balance: user.khaltiBalance,
      });
    }

    user.khaltiBalance -= amount;
    await user.save();

    return res.json({
      message: "Payment successful",
      newBalance: user.khaltiBalance,
    });
  } catch (err) {
    console.error("Khalti pay error:", err);
    return res.status(500).json({ message: "Payment processing failed" });
  }
};

// ── GET /api/khalti/balance ───────────────────────────────────────────────────
// Returns the current demo wallet balance for the logged-in user
const getBalance = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "khaltiBalance khaltiPhone",
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({
      balance: user.khaltiBalance,
      khaltiPhone: user.khaltiPhone,
    });
  } catch (err) {
    return res.status(500).json({ message: "Failed to fetch balance" });
  }
};

// ── POST /api/khalti/refund ───────────────────────────────────────────────────
// Called internally (from purchaseController) when admin marks refund as "refunded"
// or when user cancels a Khalti-paid order that's still pending/processing
// Adds the amount back to the user's wallet
const refundToWallet = async (userId, amount) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found for refund");
  user.khaltiBalance += amount;
  await user.save();
  return user.khaltiBalance;
};

module.exports = { pay, getBalance, refundToWallet };
