const express = require('express');
const router = express.Router();
// Importamos las nuevas funciones del controlador
const { 
    getProducts, 
    getProductById, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} = require('../controllers/product.controller');
const { validateProduct } = require('../middlewares/product.validator');

// GET /api/products (acepta ?category=<categoria>)
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// POST /api/products
router.post('/', validateProduct, createProduct);

// PUT /api/products/:id (NUEVO)
router.put('/:id', updateProduct);

// DELETE /api/products/:id (NUEVO)
router.delete('/:id', deleteProduct);

module.exports = router;