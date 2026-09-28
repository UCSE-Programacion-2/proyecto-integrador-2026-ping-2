const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Se conecta usando la variable de entorno
    await mongoose.connect(process.env.MONGO_URI);
    
    // Criterio de aceptación cumplido:
    console.log('Conexión exitosa a MongoDB');
  } catch (error) {
    console.error('Error al conectar a MongoDB:', error.message);
    // Detiene el proceso si hay un error grave de conexión
    process.exit(1); 
  }
};

module.exports = connectDB;