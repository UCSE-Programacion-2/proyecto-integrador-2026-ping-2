import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import BannerCarousel from '../components/BannerCarousel';
import Message from '../components/Message';
import useProducts from '../hooks/useProducts';
import useAddToCart from '../hooks/useAddToCart';

const CATEGORIAS = ['Celulares', 'Auriculares', 'Parlantes', 'Accesorios'];

const BANNERS = [
  { src: '/img/banners/redmi15c.jpg', alt: 'Promoción Redmi 15C' },
  { src: '/img/banners/motog86.jpg', alt: 'Promoción Motorola G86' },
  { src: '/img/banners/lenovoslim3.jpg', alt: 'Promoción Lenovo Ideapad Slim 3' },
  { src: '/img/banners/notebookHP15.jpg', alt: 'Promoción Notebook HP 15' },
  { src: '/img/banners/iphone17proMax.jpg', alt: 'Promoción iPhone 17 Pro Max' },
];

const DESTACADOS = 4;

export default function Home() {
  const { products, loading, error } = useProducts();
  const agregar = useAddToCart();

  const renderDestacados = () => {
    if (loading) return <Message>Cargando productos...</Message>;
    if (error) return <Message variant='danger'>{error}</Message>;
    if (products.length === 0)
      return <Message>No hay productos disponibles por el momento.</Message>;
    return products
      .slice(0, DESTACADOS)
      .map(product => <ProductCard key={product._id} product={product} onAdd={agregar} />);
  };

  return (
    <>
      <section
        className='banner-principal text-white rounded-4 shadow-sm p-4 p-md-5 mb-5'
        style={{
          background: 'linear-gradient(135deg, #0f0f11 0%, #1c1d24 100%)',
          border: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div className='row align-items-center g-4'>
          <div className='col-12 col-md-7 text-center text-md-start order-2 order-md-1'>
            <h1 className='display-4 fw-bold text-uppercase'>Tecno X</h1>
            <p className='fs-5 my-3'>Tu tienda de celulares en Jujuy.</p>
            <Link to='/catalogo' className='btn btn-warning btn-lg fw-bold px-4 py-2 mt-2'>
              Ver Catálogo
            </Link>
          </div>
          <div className='col-12 col-md-5 text-center order-1 order-md-2'>
            <img
              src='/img/logo.jpg'
              alt='Logo TECNO X'
              className='img-fluid rounded-4 shadow mx-auto'
              style={{ maxHeight: 220, width: 'auto', objectFit: 'contain' }}
            />
          </div>
        </div>
      </section>

      <section className='mb-5'>
        <h2 className='h4 fw-bold text-uppercase mb-4 text-center text-md-start'>
          Explorá por Categorías
        </h2>
        <div className='row row-cols-2 row-cols-md-4 g-3 text-center'>
          {CATEGORIAS.map(categoria => (
            <div className='col' key={categoria}>
              <Link
                to={`/catalogo?cat=${categoria.toLowerCase()}`}
                className='card h-100 border-0 shadow-sm bg-light p-3'
              >
                <h3 className='card-title h6 fw-bold text-dark mb-0'>{categoria}</h3>
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className='mb-5'>
        <h2 className='h4 fw-bold text-uppercase mb-1'>Promociones</h2>
        <p className='text-muted mb-4'>Novedades y productos destacados de TECNO X.</p>
        <BannerCarousel banners={BANNERS} />
      </section>

      <section className='mb-5'>
        <div className='d-flex justify-content-between align-items-center mb-4'>
          <h2 className='h4 fw-bold text-uppercase mb-0'>Productos Destacados</h2>
          <Link to='/catalogo' className='fw-semibold btn btn-sm btn-link'>
            Ver todo &rarr;
          </Link>
        </div>
        <div className='row row-cols-1 row-cols-sm-2 row-cols-lg-4 g-4'>{renderDestacados()}</div>
      </section>
    </>
  );
}
