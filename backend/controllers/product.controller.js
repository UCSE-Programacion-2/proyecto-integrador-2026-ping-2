const Product = require('../models/product.model');

// GET: Obtener todos los productos
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        // 200 OK: Petición exitosa
        res.status(200).json(products);
    } catch (error) {
        // 500 Internal Server Error
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// GET: Obtener un producto por su ID
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            // 404 Not Found: El ID no existe
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        // 200 OK: Encontrado con éxito
        res.status(200).json(product);
    } catch (error) {
        // 400 Bad Request: ID con formato inválido
        res.status(400).json({ message: 'ID inválido', error: error.message });
    }
};

// POST: Crear un nuevo producto
const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        // 201 Created: Recurso creado exitosamente
        res.status(201).json(savedProduct);
    } catch (error) {
        // 400 Bad Request: Faltan datos o falló la validación
        res.status(400).json({ message: 'Datos inválidos', error: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    createProduct
};