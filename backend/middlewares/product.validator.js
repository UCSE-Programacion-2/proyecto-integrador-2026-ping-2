const validateProduct = (req, res, next) => {
    const { name, price, description, category } = req.body;

    // Si falta algún dato obligatorio, cortamos la petición acá y devolvemos 400
    if (!name || !price || !description || !category) {
        return res.status(400).json({ 
            message: 'Faltan datos obligatorios para crear el producto' 
        });
    }

    // Si todo está bien, next() le dice a Express que continúe hacia el controlador
    next();
};

module.exports = { validateProduct };