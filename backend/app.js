const express = require("express");
const app = express();
const rateLimit = require("express-rate-limit");
require("dotenv").config({ path: "./config/config.env" });
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const morgan = require("morgan");
const CustomErrorHandler = require("./utils/AppError");
const cookieParser = require("cookie-parser");
const { globleErrorHandler } = require("./middlewares/error.middleware");

// import router
const authRouter = require("./routes/auth.routes");
const shopRouter = require("./routes/shop.routes");
const productRouter = require("./routes/product.routes");
const orderRouter = require("./routes/order.routes");

app.use(
  rateLimit({
    limit: 100,
    windowMs: 15 * 60 * 1000,
    message: "You have many request with this IP address.",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(helmet());
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/shop", shopRouter);
app.use("/api/v1/product", productRouter);
app.use("/api/v1/order", orderRouter);

app.use((req, res, next) => {
  next(new CustomErrorHandler("path not found ", 404));
});

app.use(globleErrorHandler);

module.exports = app;
