const express = require('express');
const router = express.Router();
const { getCart, addToCart, removeFromCart } = require('../controllers/cart.controller');
const { verifyToken } = require('../middlewares/auth.middleware');

// Protegemos TODAS las rutas del carrito usando verifyToken
router.use(verifyToken);

// GET /api/cart
router.get('/', getCart);

// POST /api/cart
router.post('/', addToCart);

// DELETE /api/cart/:productId
router.delete('/:productId', removeFromCart);

module.exports = router;