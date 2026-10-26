import PropTypes from 'prop-types';
import QuantitySelector from './QuantitySelector';
import { formatPrice, getImageUrl } from '../utils/format';

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className='card border-0 shadow-sm rounded-4 overflow-hidden mb-3 p-3 bg-white'>
      <div className='d-flex gap-3 align-items-center'>
        <img
          src={getImageUrl(item)}
          alt={item.name}
          className='rounded-3 object-fit-cover'
          style={{ width: 70, height: 70 }}
        />
        <div className='flex-grow-1'>
          <span className='text-muted small text-uppercase'>{item.category}</span>
          <h2 className='h6 fw-bold text-dark mb-1'>{item.name}</h2>
          <span className='small text-muted'>{formatPrice(item.price)} c/u</span>
          <div className='d-flex justify-content-between align-items-center mt-2'>
            <QuantitySelector
              cantidad={item.cantidad}
              onChange={cantidad => onQuantityChange(item.id, cantidad)}
            />
            <span className='fw-bold text-success'>{formatPrice(item.price * item.cantidad)}</span>
          </div>
        </div>
        <button
          className='btn btn-sm btn-link text-danger'
          type='button'
          aria-label={`Eliminar ${item.name}`}
          onClick={() => onRemove(item.id)}
        >
          <i className='bi bi-trash3-fill fs-5' />
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
    image: PropTypes.string,
  }).isRequired,
  onQuantityChange: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
};
