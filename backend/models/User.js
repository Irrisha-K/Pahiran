// models/User.js  — add khaltiBalance and khaltiPhone
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  number: { type: String },
  role: { type: String, enum: ["user", "admin"], default: "user" },

  // ── Demo Khalti wallet ────────────────────────────────────────────────────
  // Every new user gets Rs 10,000 demo balance to play with
  khaltiBalance: { type: Number, default: 10000 },
  // Stored when user first pays with Khalti — links wallet to account
  khaltiPhone: { type: String, default: null },
});

module.exports = mongoose.model("User", userSchema);
