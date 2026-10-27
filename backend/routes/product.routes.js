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
const { verifyToken, isAdmin } = require('../middlewares/auth.middleware');

// GET /api/products (acepta ?category=<categoria>)
router.get('/', getProducts);

// GET /api/products/:id
router.get('/:id', getProductById);

// Rutas de escritura: requieren token (Authorization: Bearer <token>) y rol admin

// POST /api/products
router.post('/', verifyToken, isAdmin, validateProduct, createProduct);

// PUT /api/products/:id (NUEVO)
router.put('/:id', verifyToken, isAdmin, updateProduct);

// DELETE /api/products/:id (NUEVO)
router.delete('/:id', verifyToken, isAdmin, deleteProduct);

module.exports = router;