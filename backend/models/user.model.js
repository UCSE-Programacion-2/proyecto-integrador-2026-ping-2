const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'El correo electrónico es obligatorio'],
        unique: true, // no emails duplicados
        trim: true,
        lowercase: true,
        // Expresión para validar formato de email
        match: [/^\S+@\S+\.\S+$/, 'Por favor, ingresa un correo electrónico válido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria'],
        minlength: [8, 'La contraseña debe tener al menos 8 caracteres']
    }
}, {
    timestamps: true // agrega automáticamente campos createdAt y updatedAt
});

module.exports = mongoose.model('User', userSchema);