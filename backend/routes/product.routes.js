const express = require('express');
const { createProduct, getAllProducts, updateProduct, getProduct, deleteProduct } = require('../controllers/product.controller');
const { protect, authorizeRoles } = require('../middlewares/auth.middleware');
const productRouter = express.Router();


// CRUD routes
productRouter.post('/create-product', protect, authorizeRoles('admin', 'vendor'), createProduct);
productRouter.get('/get-products', getAllProducts);
productRouter.get('/get-product/:id', getProduct);
productRouter.put('/update-product/:id', protect, authorizeRoles('admin', 'vendor'), updateProduct);
productRouter.delete('/delete-product/:id', protect, authorizeRoles('admin', 'vendor'), deleteProduct);

module.exports = productRouter;
