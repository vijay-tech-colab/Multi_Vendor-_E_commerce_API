const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required."],
    trim: true
  },
  price: {
    type: Number,
    required: [true, "Product price is required."],
    min: [0, "Price cannot be negative."]
  },
  category: {
    type: String,
    trim: true
  },
  stock: {
    type: Number,
    default: 0,
    min: [0, "Stock cannot be negative."]
  },
  description: {
    type: String,
    trim: true
  },
  ratings: {
    type: Number,
    default: 0,
    min: [0, "Rating cannot be less than 0."],
    max: [5, "Rating cannot be more than 5."]
  },
  shop: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: [true, "Shop reference is required."]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Product", productSchema);
