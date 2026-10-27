import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Message from '../components/Message';
import useAddToCart from '../hooks/useAddToCart';
import { getProductById } from '../services/api';
import { formatPrice, getImageUrl } from '../utils/format';

export default function ProductDetail() {
  const { id } = useParams();
  const agregar = useAddToCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);

  useEffect(() => {
    let activo = true;
    setLoading(true);
    setError(null);
    getProductById(id)
      .then(data => {
        if (!activo) return;
        setProduct(data);
        setCantidad(1);
        document.title = `TECNO X | ${data.name}`;
      })
      .catch(() => {
        if (activo) setError('No encontramos el producto que buscás.');
      })
      .finally(() => {
        if (activo) setLoading(false);
      });
    return () => {
      activo = false;
      document.title = 'TECNO X | E-commerce';
    };
  }, [id]);

  if (loading) return <Message>Cargando producto...</Message>;

  if (error) {
    return (
      <div className='text-center py-5'>
        <p className='text-muted fs-5'>{error}</p>
        <Link to='/catalogo' className='btn btn-warning fw-bold text-uppercase'>
          Volver al Catálogo
        </Link>
      </div>
    );
  }

  const sinStock = product.stock <= 0;

  return (
    <div className='row g-5'>
      <div className='col-12 col-md-6'>
        <div className='card border-0 shadow-sm rounded-4 overflow-hidden p-4 bg-white text-center'>
          <img
            src={getImageUrl(product)}
            className='img-fluid rounded-3 object-fit-contain w-100'
            alt={product.name}
            style={{ maxHeight: 380 }}
          />
        </div>
      </div>

      <div className='col-12 col-md-6 d-flex flex-column justify-content-start'>
        <h1 className='fw-bold display-6 text-dark text-uppercase mb-1'>{product.name}</h1>
        <p className='text-muted small mb-3'>
          Categoría: <span className='fw-semibold'>{product.category}</span> | Código: TX-
          {product._id.slice(-6).toUpperCase()}
        </p>

        <div className='p-3 rounded-4 mb-4 border'>
          <span className='h2 fw-bold text-success mb-0'>{formatPrice(product.price)}</span>
          <p className={`small mt-2 mb-0 ${sinStock ? 'text-danger fw-semibold' : 'text-muted'}`}>
            {sinStock ? 'Sin stock' : `Stock disponible: ${product.stock}`}
          </p>
        </div>

        <p className='text-secondary fs-5 mb-3'>{product.description}</p>

        <div className='row g-3 align-items-center'>
          <div className='col-4 col-sm-3'>
            <div className='input-group'>
              <span className='input-group-text bg-light text-muted small fw-bold'>Cant.</span>
              <input
                type='number'
                className='form-control text-center fw-semibold'
                value={cantidad}
                min='1'
                max={Math.max(product.stock, 1)}
                onChange={event => setCantidad(Math.max(1, Number(event.target.value) || 1))}
              />
            </div>
          </div>
          <div className='col-8 col-sm-9'>
            <button
              type='button'
              className='btn btn-warning btn-lg w-100 fw-bold text-uppercase shadow-sm py-2'
              disabled={sinStock}
              onClick={() => agregar(product, cantidad)}
            >
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
