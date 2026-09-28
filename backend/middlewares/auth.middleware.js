const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // El token suele venir en el header de 'Authorization' como 'Bearer <token>'
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        // 401 Unauthorized
        return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado o formato inválido.' });
    }

    const token = authHeader.split(' ')[1]; // Extraemos solo el token, quitando la palabra 'Bearer'

    try {
        // Verificamos si el token es real y no ha expirado
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        req.user = verified; // Guardamos los datos del usuario en la request
        next(); // Todo está bien, dejamos que la petición continúe
    } catch (error) {
        // 401 Unauthorized
        res.status(401).json({ message: 'Token no válido o expirado' });
    }
};

module.exports = { verifyToken };