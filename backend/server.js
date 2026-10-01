require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const productRoutes = require('./routes/product.routes');
const authRoutes = require('./routes/auth.routes');
const cartRoutes = require('./routes/cart.routes');

const app = express();

// Permite usar el puerto 3000
const PORT = process.env.PORT || 3000;

connectDB();

// middleware
// CORS: permite peticiones del frontend local (Live Server u otro puerto de localhost)
app.use(cors({
    origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/]
}));
app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);

// Ruta principal que responde "Hello World"
app.get('/', (req, res) => {
    res.send('Hello World');
});

// Levantar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});