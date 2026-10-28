import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import Cartel from '../components/Cartel';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { items, count, total, setQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <div className='contenedor pagina'>
        <h1 className='titulo-pagina'>Tu carrito</h1>
        <div className='vacio'>
          <Cartel lema={false} />
          <p className='fs-4 fw-bold mb-0'>Tu carrito está vacío</p>
          <p className='texto-suave mb-3'>Sumá productos desde el catálogo y aparecen acá.</p>
          <Link to='/catalogo' className='btn btn-warning'>
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='contenedor pagina'>
      <h1 className='titulo-pagina'>Tu carrito</h1>
      <div className='compra'>
        <div>
          {items.map(item => (
            <CartItem
              key={item.id}
              item={item}
              onQuantityChange={setQuantity}
              onRemove={removeItem}
            />
          ))}
        </div>

        <aside className='panel-negro resumen' aria-labelledby='titulo-resumen'>
          <h2 id='titulo-resumen' className='fs-4 fw-bold mb-4'>
            Resumen
          </h2>
          <div className='resumen-fila'>
            <span>
              Subtotal ({count} {count === 1 ? 'producto' : 'productos'})
            </span>
            <span className='precio'>{formatPrice(total)}</span>
          </div>
          <div className='resumen-total'>
            <span className='fw-bold'>Total</span>
            <strong className='precio'>{formatPrice(total)}</strong>
          </div>
          <Link to='/checkout' className='btn btn-warning w-100'>
            Continuar compra
          </Link>
          <Link to='/catalogo' className='d-block text-center mt-3 link-subrayado'>
            Seguir comprando
          </Link>
        </aside>
      </div>
    </div>
  );
}
