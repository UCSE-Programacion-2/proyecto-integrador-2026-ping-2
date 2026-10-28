import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import QuantitySelector from './QuantitySelector';
import { formatPrice, getImageUrl } from '../utils/format';

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className='item-carrito'>
      <img src={getImageUrl(item)} alt='' />
      <div>
        <span className='chico texto-suave'>{item.category}</span>
        <h2 className='fs-6 fw-bold mb-1'>
          <Link to={`/producto/${item.id}`}>{item.name}</Link>
        </h2>
        <span className='chico texto-suave'>{formatPrice(item.price)} c/u</span>
      </div>
      <div className='d-flex align-items-center justify-content-between gap-3'>
        <QuantitySelector
          cantidad={item.cantidad}
          maximo={item.stock}
          onChange={cantidad => onQuantityChange(item.id, cantidad)}
        />
        <span className='precio fs-5 text-nowrap'>{formatPrice(item.price * item.cantidad)}</span>
        <button
          className='btn btn-sm btn-link text-danger px-2'
          type='button'
          aria-label={`Eliminar ${item.name}`}
          onClick={() => onRemove(item.id)}
        >
          <i className='bi bi-trash3 fs-5' aria-hidden='true' />
        </button>
      </div>
    </div>
  );
}

CartItem.propTypes = {
  item: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    price: PropTypes.number.isRequired,
    cantidad: PropTypes.number.isRequired,
    stock: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
