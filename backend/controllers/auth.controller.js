const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// POST: Registrar usuario
const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Verificar si el usuario ya existe
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // 2. Encriptar la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear y guardar el nuevo usuario
        const newUser = new User({
            email,
            password: hashedPassword
        });
        await newUser.save();

        // 201 Created
        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        // 500 Internal Server Error
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

// POST: Login de usuario
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email y contraseña son obligatorios' });
        }

        // 1. Buscar al usuario
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 2. Verificar la contraseña
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // 3. Generar el Token JWT
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // El token expira en 2 horas
        );

        // 200 OK
        res.status(200).json({ message: 'Login exitoso', token });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor', error: error.message });
    }
};

module.exports = { register, login };