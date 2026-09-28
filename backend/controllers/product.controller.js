const Product = require('../models/product.model');

// GET: Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// GET: Obtener un producto por su ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(400).json({ message: 'ID inválido', error: error.message });
    }
};

// POST: Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
};

// PUT: Actualizar un producto existente (NUEVO)
const updateProduct = async (req, res) => {
    try {
        // { new: true } es para que nos devuelva el producto ya modificado, no el viejo
        const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: 'Error al actualizar, ID inválido', error: error.message });
    }
};

// DELETE: Eliminar un producto (NUEVO)
const deleteProduct = async (req, res) => {
    try {
        const deletedProduct = await Product.findByIdAndDelete(req.params.id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(400).json({ message: 'Error al eliminar, ID inválido', error: error.message });
    }
};

// No olvides exportar las nuevas funciones al final:
module.exports = {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
};