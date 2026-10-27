import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../utils/format';

export default function ProductCard({ product, onAdd }) {
  const hayStock = product.stock > 0;

  return (
    <div className='col'>
      <div className='card h-100 border-0 shadow-sm rounded-4 overflow-hidden'>
        <img
          src={getImageUrl(product)}
          className='card-img-top object-fit-cover bg-light'
          alt={product.name}
          style={{ height: 200 }}
        />
        <div className='card-body d-flex flex-column justify-content-between'>
          <div>
            <span className='text-muted small text-uppercase'>{product.category}</span>
            <h3 className='card-title h6 fw-bold text-dark mt-1'>{product.name}</h3>
            <p className='card-text text-success fw-bold fs-5 mb-0'>{formatPrice(product.price)}</p>
          </div>
          <Link
            to={`/producto/${product._id}`}
            className='btn btn-outline-dark btn-sm w-100 rounded-3 mt-3'
          >
            Ver Detalle
          </Link>
          <button
            type='button'
            className='btn btn-warning btn-sm w-100 rounded-3 mt-2 fw-semibold'
            disabled={!hayStock}
            onClick={() => onAdd(product)}
          >
            {hayStock ? 'Agregar al carrito' : 'Sin stock'}
          </button>
        </div>
      </div>
    </div>
  );
}

ProductCard.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    category: PropTypes.string,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number,
    image: PropTypes.string,
  }).isRequired,
  onAdd: PropTypes.func.isRequired,
};
