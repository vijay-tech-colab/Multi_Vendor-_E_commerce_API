const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "Customer reference is required."]
  },
  products: [
    {
      product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: [true, "Product reference is required."]
      },
      quantity: {
        type: Number,
        default: 1,
        min: [1, "Quantity must be at least 1."]
      }
    }
  ],
  totalPrice: {
    type: Number,
    required: [true, "Total price is required."],
    min: [0, "Total price cannot be negative."]
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'processing', 'shipped', 'delivered'],
      message: "Status must be one of: pending, processing, shipped, delivered."
    },
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
