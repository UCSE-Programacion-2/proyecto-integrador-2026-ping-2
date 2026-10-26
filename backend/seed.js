const mongoose = require('mongoose');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const Product = require('./models/product.model.js');
const User = require('./models/user.model.js');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || process.env.DB_URI || process.env.DATABASE_URL;

    if (!mongoUri) {
      throw new Error('No se encontró la URL de conexión en el archivo .env');
    }

    console.log('Conectando a MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Conexión establecida.');

    const rawData = fs.readFileSync(path.join(__dirname, 'productsMock.json'), 'utf-8');
    const mockProducts = JSON.parse(rawData);

    console.log('Limpiando productos existentes...');
    await Product.deleteMany({});

    console.log(`Insertando ${mockProducts.length} productos de prueba...`);
    await Product.insertMany(mockProducts);

    console.log(`¡Seedeo completado! Se cargaron ${mockProducts.length} productos.`);

    // Usuario administrador (opcional): se crea o se promueve a admin sin borrar otros usuarios
    const { ADMIN_EMAIL, ADMIN_PASSWORD } = process.env;
    if (ADMIN_EMAIL && ADMIN_PASSWORD) {
      const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, 10);
      await User.findOneAndUpdate(
        { email: ADMIN_EMAIL.toLowerCase() },
        { email: ADMIN_EMAIL, password: hashedPassword, role: 'admin' },
        { upsert: true, runValidators: true, setDefaultsOnInsert: true },
      );
      console.log(`Usuario administrador listo: ${ADMIN_EMAIL}`);
    } else {
      console.log('ADMIN_EMAIL/ADMIN_PASSWORD no definidos: no se creó usuario administrador.');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error durante el seedeo:', error.message);
    process.exit(1);
  }
};

seedDatabase();