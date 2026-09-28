const Cart = require('../models/cart.model');

// GET: Ver el carrito del usuario logueado
const getCart = async (req, res) => {
    try {
        // Buscamos el carrito y con "populate" traemos los datos de los productos
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ message: 'El carrito está vacío', items: [] });
        }
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el carrito', error: error.message });
    }
};

// POST: Agregar un ítem al carrito
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const qty = quantity || 1;

        let cart = await Cart.findOne({ user: req.user.id });

        // Si el usuario no tiene carrito, se lo creamos
        if (!cart) {
            cart = new Cart({ user: req.user.id, items: [{ product: productId, quantity: qty }] });
        } else {
            // Si ya tiene, verificamos si el producto ya está en el carrito
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                // Si existe, le sumamos la cantidad
                cart.items[itemIndex].quantity += qty;
            } else {
                // Si no existe, lo agregamos a la lista
                cart.items.push({ product: productId, quantity: qty });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al agregar al carrito', error: error.message });
    }
};

// DELETE: Eliminar un ítem del carrito
const removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }

        // Filtramos para dejar todos los productos EXCEPTO el que queremos borrar
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar del carrito', error: error.message });
    }
};

module.exports = { getCart, addToCart, removeFromCart };