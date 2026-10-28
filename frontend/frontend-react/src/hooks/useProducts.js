import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

// Si la API tarda más que esto, avisamos que el servidor gratuito se está despertando
const ESPERA_LENTA_MS = 4000;

// Trae el listado de productos al montar el componente
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lento, setLento] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    const aviso = setTimeout(() => setLento(true), ESPERA_LENTA_MS);
    getProducts()
      .then(data => {
        if (activo) setProducts(data);
      })
      .catch(err => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        clearTimeout(aviso);
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
      clearTimeout(aviso);
    };
  }, []);

  return { products, loading, lento, error };
}
