const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Name is required."],
    trim: true,
    minlength: [3, "Name should be at least 3 characters."],
    maxlength: [20, "Name should not exceed 20 characters."],
  },

  email: {
    type: String,
    required: [true, "Email is required."],
    unique: true,
    lowercase: true,
    validate: {
      validator: validator.isEmail,
      message: "Please provide a valid email address.",
    },
  },

  password: {
    type: String,
    select : false,
    required: [true, "Password is required."],
    validate: {
      validator: function (val) {
        return val.length >= 8 && val.length <= 15;
      },
      message: "Password should be between 8 and 15 characters.",
    },
  },

  role: {
    type: String,
    enum: {
      values: ["admin", "vendor", "customer"],
      message: "Role must be either admin, vendor, or customer.",
    },
    default: "customer",
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.generateJWTToken = function () {
  return jwt.sign({id : this._id}, process.env.JWT_SECRET_KEY, {
    expiresIn : process.env.JWT_EXPIRE_IN
  })
}

userSchema.methods.comparePasswordInDB = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
