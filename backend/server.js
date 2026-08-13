const express = require('express');
const app = express();

// Permite usar el puerto 3000
const PORT = process.env.PORT || 3000;

// Ruta principal que responde "Hello World"
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});