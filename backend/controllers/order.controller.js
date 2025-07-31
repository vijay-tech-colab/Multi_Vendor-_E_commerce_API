const Order = require("../models/order.model");
const Product = require("../models/product.model");
const asyncHandler = require("../middlewares/asyncHandler");
const AppError = require("../utils/AppError");


exports.createOrder = asyncHandler(async (req, res, next) => {
  const  products  = req.body.products;

  if (!products || products.length === 0) {
    return next(new AppError("At least one product is required.", 400));
  }

  let totalPrice = 0;
  for (const item of products) {
    const product = await Product.findById(item.product);
    if (!product) {
      return next(new AppError(`Product not found: ${item.product}`, 404));
    }
    totalPrice += product.price * item.quantity;
  }

  const order = await Order.create({
    customer: req.user.id,
    products,
    totalPrice
  });

  res.status(201).json({
    status: "success",
    data: {
      order
    }
  });
});



exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate("customer", "name email")
    .populate("products.product", "name price");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders
    }
  });
});


exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ customer: req.user.id }).populate("products.product", "name price");

  res.status(200).json({
    status: "success",
    results: orders.length,
    data: {
      orders
    }
  });
});


exports.getOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("customer", "name email")
    .populate("products.product", "name price");

  if (!order) {
    return next(new AppError("Order not found", 404));
  }

  // Allow owner or admin only
  if (order.customer._id.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("Not authorized to view this order", 403));
  }

  res.status(200).json({
    status: "success",
    data: {
      order
    }
  });
});


exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("Order not found", 404));

  if (req.user.role !== "admin" && req.user.role !== "vendor") {
    return next(new AppError("Not authorized to update order status", 403));
  }

  if (!["pending", "processing", "shipped", "delivered"].includes(status)) {
    return next(new AppError("Invalid status", 400));
  }

  order.status = status;
  await order.save();

  res.status(200).json({
    status: "success",
    data: {
      order
    }
  });
});


exports.deleteOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) return next(new AppError("Order not found", 404));

  if (order.customer.toString() !== req.user.id && req.user.role !== "admin") {
    return next(new AppError("Not authorized to delete this order", 403));
  }

  await order.deleteOne();

  res.status(200).json({
    status: "success",
    message: "Order deleted"
  });
});
