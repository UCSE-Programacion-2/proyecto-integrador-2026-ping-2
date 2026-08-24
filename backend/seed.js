import mongoose from 'mongoose';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import Product from './models/product.model.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    console.log('Insertando 10 productos de prueba...');
    await Product.insertMany(mockProducts);

    console.log(`✨ ¡Seedeo completado! Se cargaron ${mockProducts.length} productos.`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error durante el seedeo:', error.message);
    process.exit(1);
  }
};

seedDatabase();