const Shop = require("../models/shop.model");
const CustomErrorHandler = require("../utils/AppError");
const catchAsyncHandler = require("../middlewares/asyncHandler");

// @desc    Create a new shop
exports.createShop = catchAsyncHandler(async (req, res, next) => {
    const { name, description } = req.body;

    const shop = await Shop.create({
        name,
        description,
        owner: req.user._id,
    });

    res.status(201).json({
        message: "Shop created successfully.",
        shop,
    });
});

// @desc    Get all shops
exports.getAllShops = catchAsyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 15;
    const skip = (page - 1) * limit;
    const totalShop = await Shop.countDocuments();
    const shops = await Shop.find()
        .populate("owner", "name email role")
        .skip(skip)
        .limit(limit);

    res.status(200).json({
        success: true,
        count: shops.length,
        totalShop,
        data: {
            shops,
        },
    });
});

// @desc    Get a single shop by ID
exports.getShopById = catchAsyncHandler(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id).populate(
        "owner",
        "name email role"
    );

    if (!shop) {
        return next(new CustomErrorHandler("Shop not found", 404));
    }

    res.status(200).json({ shop });
});

// @desc    Update a shop
exports.updateShop = catchAsyncHandler(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
        return next(new CustomErrorHandler("Shop not found", 404));
    }

    if (shop.owner.toString() !== req.user._id.toString()) {
        return next(
            new CustomErrorHandler("Not authorized to update this shop", 403)
        );
    }

    shop.name = req.body.name || shop.name;
    shop.description = req.body.description || shop.description;

    await shop.save();

    res.status(200).json({
        message: "Shop updated successfully.",
        shop,
    });
});

// @desc    Delete a shop
exports.deleteShop = catchAsyncHandler(async (req, res, next) => {
    const shop = await Shop.findById(req.params.id);

    if (!shop) {
        return next(new CustomErrorHandler("Shop not found", 404));
    }

    if (shop.owner.toString() !== req.user._id.toString()) {
        return next(
            new CustomErrorHandler("Not authorized to delete this shop", 403)
        );
    }

    await Shop.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Shop deleted successfully.", data: null });
});
