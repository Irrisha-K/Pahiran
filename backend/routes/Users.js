const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const JWT_SECRET = process.env.JWT_SECRET;

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

    console.log("New User Role:", role);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
    console.log({ err });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const users = await User.find().select("-role"); // exclude 'role'
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
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
