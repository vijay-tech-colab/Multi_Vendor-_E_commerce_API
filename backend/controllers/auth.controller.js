const catchAsyncHandler = require("../middlewares/asyncHandler");
const User = require("../models/user.model");
const CustomErrorHandler = require("../utils/AppError");
const cookieOption = require("../utils/sendCookie");

// Helper: Check if an admin already exists (if trying to create one)
const isAdminAvailable = async (role) => {
    if (role !== "admin") return false;
    const admin = await User.findOne({ role: "admin" });
    return !!admin;
};

// @desc   Register new user
exports.signUp = catchAsyncHandler(async (req, res, next) => {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password) {
        return next(new CustomErrorHandler("All fields are required.", 400));
    }

    if (await isAdminAvailable(role)) {
        return next(new CustomErrorHandler("Admin already exists.", 400));
    }

    const user = await User.create({ name, email, password, role });
    const token = user.generateJWTToken();

    res.status(201).cookie("token", token, cookieOption()).json({
        message: "Registration successful.",
        user,
    });
});

// @desc   User login
exports.signIn = catchAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(
            new CustomErrorHandler("Email and password are required.", 400)
        );
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePasswordInDB(password))) {
        return next(new CustomErrorHandler("Invalid email or password.", 401));
    }

    const token = user.generateJWTToken();

    res.status(200).cookie("token", token, cookieOption()).json({
        message: "Login successful.",
        user,
    });
});

// @desc   Logout user
exports.logOut = catchAsyncHandler(async (req, res, next) => {
    res
        .status(200)
        .cookie("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "Strict",
            maxAge: 0,
        })
        .json({
            message: "Logout successful.",
        });
});

// @desc   Get user by ID
exports.me = catchAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) {
        return next(new CustomErrorHandler("User not found.", 404));
    }

    res.status(200).json({
        user,
    });
});
