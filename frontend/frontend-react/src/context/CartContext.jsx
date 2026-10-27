import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

const CLAVE_CARRITO = 'carrito';

const CartContext = createContext(null);

const leerCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
};

export function CartProvider({ children }) {
  const [items, setItems] = useState(leerCarrito);

  // Persistencia: el carrito sobrevive a cerrar y abrir el navegador
  useEffect(() => {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(items));
  }, [items]);

  // Mantiene sincronizadas varias pestañas abiertas
  useEffect(() => {
    const sincronizar = event => {
      if (event.key === CLAVE_CARRITO) setItems(leerCarrito());
    };
    window.addEventListener('storage', sincronizar);
    return () => window.removeEventListener('storage', sincronizar);
  }, []);

  // Agrega un producto (o suma cantidad) sin superar el stock. Devuelve false si no pudo agregar.
  const addItem = useCallback(
    (product, cantidad = 1) => {
      const existente = items.find(item => item.id === product._id);
      const actual = existente ? existente.cantidad : 0;
      const nuevaCantidad = Math.min(actual + cantidad, product.stock);

      if (nuevaCantidad <= actual) return false;

      if (existente) {
        setItems(
          items.map(item =>
            item.id === product._id ? { ...item, cantidad: nuevaCantidad } : item,
          ),
        );
      } else {
        setItems([
          ...items,
          {
            id: product._id,
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            stock: product.stock,
            cantidad: nuevaCantidad,
          },
        ]);
      }
      return true;
    },
    [items],
  );

  const setQuantity = useCallback((id, cantidad) => {
    setItems(actuales =>
      actuales.map(item =>
        item.id === id
          ? { ...item, cantidad: Math.max(1, Math.min(cantidad, item.stock || cantidad)) }
          : item,
      ),
    );
  }, []);

  const removeItem = useCallback(id => {
    setItems(actuales => actuales.filter(item => item.id !== id));
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const value = useMemo(
    () => ({
      items,
      count: items.reduce((suma, item) => suma + item.cantidad, 0),
      total: items.reduce((suma, item) => suma + item.price * item.cantidad, 0),
      addItem,
      setQuantity,
      removeItem,
      clearCart,
    }),
    [items, addItem, setQuantity, removeItem, clearCart],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

CartProvider.propTypes = { children: PropTypes.node.isRequired };

// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart debe usarse dentro de <CartProvider>');
  return context;
};
