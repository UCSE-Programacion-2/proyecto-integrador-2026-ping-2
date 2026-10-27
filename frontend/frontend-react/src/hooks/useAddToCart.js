import { useCart } from '../context/CartContext';
import { toast } from '../utils/alerts';

// Agrega al carrito y avisa al usuario con un toast
export default function useAddToCart() {
  const { addItem } = useCart();

  return (product, cantidad = 1) => {
    const agregado = addItem(product, cantidad);
    toast(
      agregado ? 'success' : 'warning',
      agregado ? `${product.name} agregado al carrito` : 'No hay más stock disponible',
    );
    return agregado;
  };
}
