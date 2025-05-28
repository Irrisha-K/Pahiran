/* eslint-disable no-undef */

/* eslint-disable no-unused-vars */
require("dotenv").config();
const express = require("express");
const fs = require("fs");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/Users");
const HttpError = require("./models/http-error");
const cors = require("cors");

const app = express();
app.use(cors());

app.use(bodyParser.json());

app.use("/uploads/images", express.static(path.join("uploads", "images")));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

// app.use(
//   cors({
//     origin: "http://localhost:5173", // Allow your frontend origin
//     methods: ["GET", "POST", "PATCH", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (req.file) {
    fs.unlink(req.file.path, (err) => {
      console.log(err);
    });
  }

  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknown error occured!" });
});

mongoose
  .connect(
    "mongodb+srv://irrishakayastha25:O5VBpxUljdz1SUEB@cluster0.c3ah54m.mongodb.net/products?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    app.listen(5001);
    console.log("Connected");
  })
  .catch((err) => {
    console.log(err);
  });
