import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { formatPrice, getImageUrl } from '../utils/format';

export default function ProductCard({ product, onAdd }) {
  const hayStock = product.stock > 0;
  const detalle = `/producto/${product._id}`;

  return (
    <div className='col'>
      <article className='tarjeta'>
        {/* La foto y el nombre llevan al detalle; el botón es la única acción */}
        <Link to={detalle} className='tarjeta-foto' tabIndex={-1} aria-hidden='true'>
          <img src={getImageUrl(product)} alt='' loading='lazy' />
        </Link>
        <div className='tarjeta-cuerpo'>
          <h3 className='tarjeta-nombre'>
            <Link to={detalle}>{product.name}</Link>
          </h3>
          <span className='chico texto-suave'>{product.category}</span>
          <div className='tarjeta-fila'>
            <span className='tarjeta-precio precio'>{formatPrice(product.price)}</span>
            <button
              type='button'
              className='btn btn-negro btn-sm'
              disabled={!hayStock}
              onClick={() => onAdd(product)}
            >
              {hayStock ? 'Agregar' : 'Sin stock'}
              {hayStock && <span className='visually-hidden'> {product.name} al carrito</span>}
            </button>
          </div>
        </div>
      </article>
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
