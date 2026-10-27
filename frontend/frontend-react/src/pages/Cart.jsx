import { Link } from 'react-router-dom';
import CartItem from '../components/CartItem';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/format';

export default function Cart() {
  const { items, count, total, setQuantity, removeItem } = useCart();

  return (
    <>
      <h1 className='h2 fw-bold text-uppercase mb-4'>Tu Carrito</h1>
      <div className='row g-4'>
        <div className='col-12 col-lg-8'>
          {items.length === 0 ? (
            <div className='text-center py-5'>
              <p className='text-muted'>Tu carrito está vacío.</p>
              <Link to='/catalogo' className='btn btn-warning fw-bold text-uppercase'>
                Ir al Catálogo
              </Link>
            </div>
          ) : (
            items.map(item => (
              <CartItem
                key={item.id}
                item={item}
                onQuantityChange={setQuantity}
                onRemove={removeItem}
              />
            ))
          )}
        </div>

        <div className='col-12 col-lg-4'>
          <div className='card border-0 shadow-sm rounded-4 p-4 bg-white'>
            <h2 className='h5 fw-bold text-uppercase mb-3 border-bottom pb-2'>Resumen</h2>
            <div className='d-flex justify-content-between mb-2 small text-secondary'>
              <span>
                Subtotal ({count} {count === 1 ? 'producto' : 'productos'})
              </span>
              <span>{formatPrice(total)}</span>
            </div>
            <hr className='my-2' />
            <div className='d-flex justify-content-between mb-4'>
              <span className='fw-bold text-dark text-uppercase'>Total</span>
              <strong className='h4 mb-0'>{formatPrice(total)}</strong>
            </div>
            <Link
              to='/checkout'
              className={`btn btn-warning btn-lg w-100 fw-bold text-uppercase ${
                items.length === 0 ? 'disabled' : ''
              }`}
              aria-disabled={items.length === 0}
            >
              Continuar compra
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
