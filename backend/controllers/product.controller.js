const Product = require("../models/product.model");
const Shop = require("../models/shop.model");
const asyncHandler = require("../middlewares/asyncHandler");
const CustomErrorHandler = require("../utils/AppError");
const Features = require("../utils/apiFeatures");

exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, price, category, stock, description } = req.body;
  const shopId = req.body.shop;

  const shop = await Shop.findById(shopId);
  if (!shop) {
    return next(new CustomErrorHandler("Shop not found", 404));
  }

  // Only the owner of the shop can create products for it
  if (shop.owner.toString() !== req.user.id) {
    return next(
      new CustomErrorHandler(
        "You are not authorized to add products to this shop",
        403
      )
    );
  }

  const product = await Product.create({
    name,
    price,
    category,
    stock,
    description,
    shop: shopId,
  });

  res.status(201).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.getAllProducts = asyncHandler(async (req, res, next) => {
  let products = Product.find();
  const paginate = new Features(products, req.query)
    .paginate()
    .filter()
    .sort()
    .limitFields();
    
  products = await products;
  res.status(200).json({
    status: "success",
    results: products.length,
    data: {
      products,
    },
  });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate(
    "shop",
    "name"
  );

  if (!product) {
    return next(new CustomErrorHandler("Product not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("shop");

  if (!product) {
    return next(new CustomErrorHandler("Product not found", 404));
  }

  if (product.shop.owner.toString() !== req.user.id) {
    return next(
      new CustomErrorHandler(
        "You are not authorized to update this product",
        403
      )
    );
  }

  Object.assign(product, req.body); // Apply changes
  await product.save();

  res.status(200).json({
    status: "success",
    data: {
      product,
    },
  });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate("shop");

  if (!product) {
    return next(new CustomErrorHandler("Product not found", 404));
  }

  // Check ownership or admin
  if (product.shop.owner.toString() !== req.user.id) {
    return next(
      new CustomErrorHandler(
        "You are not authorized to delete this product",
        403
      )
    );
  }

  await Product.findByIdAndDelete(req.params.id);

  res.status(200).json({
    status: "success",
    message: "Product deleted successfully",
  });
});
