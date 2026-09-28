const express = require('express');
const router = express.Router();
const { getProducts, getProductById, createProduct } = require('../controllers/product.controller');

const { validateProduct } = require('../middlewares/product.validator');

// GET /api/products
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products
router.post('/', validateProduct, createProduct);

module.exports = router;