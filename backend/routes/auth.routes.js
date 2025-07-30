const express = require("express");
const {
  signUp,
  signIn,
  logOut,
  me,
} = require("../controllers/auth.controller");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const authRouter = express.Router();

authRouter.route("/signup").post(signUp);
authRouter.route("/signin").post(signIn);
authRouter.route("/logout").post(logOut);
authRouter.route("/me").get(protect, me);

module.exports = authRouter;
