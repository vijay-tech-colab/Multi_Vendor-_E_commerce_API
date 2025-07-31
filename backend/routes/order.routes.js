const express = require("express");
const orderRouter = express.Router();
const { authorizeRoles, protect } = require("../middlewares/auth.middleware");
const {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrder,
  updateOrderStatus,
  deleteOrder,
} = require("../controllers/order.controller");

// Customer: Place an order
orderRouter.post(
  "/create-order",
  protect,
  authorizeRoles("customer"),
  createOrder
);

// Admin: Get all orders
orderRouter.get("/get-orders", protect, getAllOrders);

// Customer: Get my orders
orderRouter.get("/my-orders", protect, authorizeRoles("customer"), getMyOrders);

// Customer/Admin: Get single order
orderRouter.get(
  "/get-order/:id",
  protect,
  authorizeRoles("admin", "vendor"),
  getOrder
);

// Vendor/Admin: Update order status
orderRouter.patch(
  "/update-order/:id/status",
  protect,
  authorizeRoles("admin", "vendor"),
  updateOrderStatus
);

// Customer/Admin: Delete order
orderRouter.delete("/delete-order/:id", protect, deleteOrder);

module.exports = orderRouter;
