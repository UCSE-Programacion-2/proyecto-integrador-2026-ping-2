import { useEffect, useState } from 'react';
import { getProducts } from '../services/api';

// Trae el listado de productos al montar el componente
export default function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let activo = true;
    getProducts()
      .then(data => {
        if (activo) setProducts(data);
      })
      .catch(err => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
    };
  }, []);

  return { products, loading, error };
}
