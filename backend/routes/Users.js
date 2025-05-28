const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const nodemailer = require("nodemailer");
const otpStore = new Map();

const JWT_SECRET = process.env.JWT_SECRET;

router.get("/", async (req, res, next) => {
  try {
    const { email, name } = req.query;

    // Build dynamic filter
    const filter = {};
    if (email) filter.email = email;
    if (name) filter.name = new RegExp(name, "i"); // case-insensitive match

    // Fetch users with selected filters, excluding 'password' and 'role'
    const users = await User.find(filter).select("-password -role");

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Sign Up
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const role = email === "admin@example.com" ? "admin" : "user"; // optional logic

    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();

    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // res.json({ token, role: user.role, name: user.name });
    res.json({ token, role: user.role, userId: user._id, name: user.name });

    console.log("New User Role:", user.role);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    console.log({ err });
  }
});

router.post("/send-otp", async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore.set(email, otp);

  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: "irrishakayastha@gmail.com",
      // pass: "liwj nsii czpx cybs", // Use App Password here
      pass: "liwjnsiiczpxcybs", // Use App Password here
    },
  });

  const mailOptions = {
    from: "your_email@gmail.com",
    to: email,
    subject: "Your OTP for Email Verification",
    text: `Your OTP is ${otp}. It is valid for 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent" });

    // Optional: expire OTP in 5 minutes
    setTimeout(() => otpStore.delete(email), 5 * 60 * 1000);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send OTP" });
  }
});

// router.post("/verify-otp", (req, res) => {
//   const { email, otp } = req.body;
//   if (otpStore.get(email) === otp) {
//     otpStore.delete(email); // remove after success
//     return res.status(200).json({ message: "OTP verified" });
//   } else {
//     return res.status(400).json({ message: "Invalid OTP" });
//   }
// });

router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const storedOtp = otpStore.get(email);

  if (!storedOtp) {
    return res.status(400).json({ message: "OTP has expired or was not sent" });
  }

  if (storedOtp !== otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  // OTP is valid
  otpStore.delete(email); // Clean up after verification
  return res.status(200).json({ message: "OTP verified" });
});

// router.get("/:id", async (req, res, next) => {
//   const userId = req.params.id;

//   // Validate ObjectId
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ error: "Invalid user ID format" });
//   }

//   try {
//     const user = await User.findById(userId).select("-password -role");

//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     res.status(200).json(user);
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     res.status(500).json({ error: "Something went wrong" });
//   }
// });

router.get("/:id", async (req, res, next) => {
  const userId = req.params.id;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);

    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    } else {
      next(error); // ✅ now works as expected
    }
  }
});

module.exports = router;
