const User = require("../models/user.model");
const CustomErrorHandler = require("../utils/AppError");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
    try {
        const { token } = req.cookies;
        if (!token) {
            return next(new CustomErrorHandler("Token not found", 401));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);
        if (!user) {
            return next(new CustomErrorHandler("User not found", 404));
        }
        req.user = user;
        next();
    } catch (err) {
        return next(new CustomErrorHandler("Invalid or expired token", 401));
    }
};

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(
                new CustomErrorHandler(
                    `Role '${req.user.role}' is not allowed to access this resource`,
                    403
                )
            );
        }
        next();
    };
};


