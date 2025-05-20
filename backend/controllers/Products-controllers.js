const Product = require("../models/Products");
const HttpError = require("../models/http-error");

const getProducts = async (req, res, next) => {
  let products;

  try {
    products = await Product.find({});
  } catch (err) {
    const error = new HttpError(
      "Fetching users failed, please try again later",
      500
    );
    return next(error);
  }
  res.json({
    products: products.map((product) => product.toObject({ getters: true })),
  });
};

exports.getProducts = getProducts;
