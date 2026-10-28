import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Cartel from '../components/Cartel';
import QuantitySelector from '../components/QuantitySelector';
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

  if (loading) {
    return (
      <div className='contenedor pagina detalle' aria-busy='true'>
        <div className='esqueleto' style={{ aspectRatio: '3 / 4' }} />
        <div>
          <div className='esqueleto mb-3' style={{ height: 48, width: '80%' }} />
          <div className='esqueleto mb-3' style={{ height: 40, width: '40%' }} />
          <div className='esqueleto' style={{ height: 96 }} />
          <span className='visually-hidden' role='status'>
            Cargando producto...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='contenedor pagina'>
        <div className='vacio'>
          <Cartel lema={false} />
          <p className='fs-5 fw-bold mb-1'>{error}</p>
          <Link to='/catalogo' className='btn btn-warning mt-3'>
            Volver al catálogo
          </Link>
        </div>
      </div>
    );
  }

  const sinStock = product.stock <= 0;
  const maximo = Math.max(product.stock, 1);

  return (
    <div className='contenedor pagina'>
      <Link to='/catalogo' className='link-subrayado d-inline-block mb-4'>
        Volver al catálogo
      </Link>
      <div className='detalle'>
        <div className='detalle-foto'>
          <img src={getImageUrl(product)} alt={product.name} />
        </div>

        <div className='detalle-info'>
          <span className='texto-suave'>
            {product.category} · Código TX-{product._id.slice(-6).toUpperCase()}
          </span>
          <h1 className='titulo-pagina mt-2 mb-0'>{product.name}</h1>
          <p className='detalle-precio precio'>{formatPrice(product.price)}</p>
          <p className={sinStock ? 'text-danger fw-bold' : 'texto-suave'}>
            {sinStock ? 'Sin stock' : `${product.stock} disponibles en el local`}
          </p>
          <p className='fs-5 mt-4' style={{ maxWidth: '52ch' }}>
            {product.description}
          </p>

          <div className='detalle-compra'>
            <QuantitySelector
              cantidad={cantidad}
              maximo={sinStock ? 1 : maximo}
              onChange={n => setCantidad(Math.min(maximo, Math.max(1, n)))}
            />
            <button
              type='button'
              className='btn btn-warning px-5'
              disabled={sinStock}
              onClick={() => agregar(product, cantidad)}
            >
              {sinStock ? 'Sin stock' : 'Agregar al carrito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
