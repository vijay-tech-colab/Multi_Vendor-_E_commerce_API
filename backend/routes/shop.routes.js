const express = require("express");
const { protect, authorizeRoles } = require("../middlewares/auth.middleware");
const {
    createShop,
    getAllShops,
    getShopById,
    updateShop,
    deleteShop,
} = require("../controllers/shop.controller");
const shopRouter = express.Router();

shopRouter.post(
    "/post-shop",
    protect,
    authorizeRoles("admin", "vendor"),
    createShop
);
shopRouter.get("/get-shopes", getAllShops);
shopRouter.get("/get-shop/:id", getShopById);
shopRouter.put(
    "/update-shop/:id",
    protect,
    authorizeRoles("admin", "vendor"),
    updateShop
);
shopRouter.delete(
    "/delete-shop/:id",
    protect,
    authorizeRoles("admin", "vendor"),
    deleteShop
);

module.exports = shopRouter;
