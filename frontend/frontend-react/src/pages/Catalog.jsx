import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Message from '../components/Message';
import useProducts from '../hooks/useProducts';
import useAddToCart from '../hooks/useAddToCart';
import { formatPrice, normalizar } from '../utils/format';

export default function Catalog() {
  const { products, loading, error } = useProducts();
  const agregar = useAddToCart();
  const [searchParams] = useSearchParams();

  // ?cat=celulares viene de los accesos por categoría del Home
  const catUrl = normalizar(searchParams.get('cat') || '');

  const [busqueda, setBusqueda] = useState('');
  const [seleccionadas, setSeleccionadas] = useState(null);
  const [precioMaximo, setPrecioMaximo] = useState(null);
  const [orden, setOrden] = useState('destacados');

  const categorias = useMemo(() => [...new Set(products.map(p => p.category))].sort(), [products]);
  const tope = useMemo(() => {
    const maximo = Math.max(...products.map(p => p.price), 0);
    return Math.ceil(maximo / 10000) * 10000 || 1000000;
  }, [products]);

  // Mientras el usuario no toque los filtros se usan los valores por defecto
  const categoriasActivas =
    seleccionadas ?? categorias.filter(categoria => normalizar(categoria) === catUrl);
  const precioActivo = precioMaximo ?? tope;

  const visibles = useMemo(() => {
    const texto = normalizar(busqueda.trim());
    const filtrados = products.filter(
      p =>
        (categoriasActivas.length === 0 || categoriasActivas.includes(p.category)) &&
        p.price <= precioActivo &&
        (!texto || normalizar(`${p.name} ${p.category}`).includes(texto)),
    );
    if (orden === 'precio-asc') filtrados.sort((a, b) => a.price - b.price);
    if (orden === 'precio-desc') filtrados.sort((a, b) => b.price - a.price);
    return filtrados;
  }, [products, categoriasActivas, precioActivo, busqueda, orden]);

  const alternarCategoria = categoria =>
    setSeleccionadas(
      categoriasActivas.includes(categoria)
        ? categoriasActivas.filter(c => c !== categoria)
        : [...categoriasActivas, categoria],
    );

  const limpiar = () => {
    setBusqueda('');
    setSeleccionadas([]);
    setPrecioMaximo(null);
    setOrden('destacados');
  };

  const renderProductos = () => {
    if (loading) return <Message>Cargando productos...</Message>;
    if (error) return <Message variant='danger'>{error}</Message>;
    if (visibles.length === 0) {
      return (
        <Message>
          {products.length === 0
            ? 'No hay productos disponibles por el momento.'
            : 'No hay productos que coincidan con los filtros.'}
        </Message>
      );
    }
    return visibles.map(product => (
      <ProductCard key={product._id} product={product} onAdd={agregar} />
    ));
  };

  return (
    <>
      <h1 className='h2 fw-bold text-uppercase mb-4'>Catálogo</h1>
      <div className='row g-4'>
        <aside className='col-12 col-lg-3'>
          <div className='card border-0 shadow-sm rounded-4 p-4 bg-white'>
            <h2 className='h6 fw-bold text-uppercase mb-3'>Buscar</h2>
            <input
              type='search'
              className='form-control mb-4'
              placeholder='Nombre o categoría'
              value={busqueda}
              onChange={event => setBusqueda(event.target.value)}
            />

            <h2 className='h6 fw-bold text-uppercase mb-3'>Categorías</h2>
            {categorias.map(categoria => (
              <div className='form-check mb-2' key={categoria}>
                <input
                  className='form-check-input'
                  type='checkbox'
                  id={`cat-${categoria}`}
                  checked={categoriasActivas.includes(categoria)}
                  onChange={() => alternarCategoria(categoria)}
                />
                <label className='form-check-label text-dark' htmlFor={`cat-${categoria}`}>
                  {categoria}
                </label>
              </div>
            ))}

            <label htmlFor='rango-precio' className='form-label small text-muted mt-3'>
              Hasta: {formatPrice(precioActivo)}
            </label>
            <input
              id='rango-precio'
              type='range'
              className='form-range mb-3'
              min='0'
              max={tope}
              step='1000'
              value={precioActivo}
              onChange={event => setPrecioMaximo(Number(event.target.value))}
            />
            <button
              type='button'
              className='btn btn-outline-dark btn-sm w-100 rounded-3'
              onClick={limpiar}
            >
              Limpiar filtros
            </button>
          </div>
        </aside>

        <section className='col-12 col-lg-9'>
          <div className='d-flex justify-content-between align-items-center mb-3 gap-3'>
            <p className='text-muted mb-0'>
              {loading || error
                ? ''
                : `Mostrando ${visibles.length} ${visibles.length === 1 ? 'producto' : 'productos'}`}
            </p>
            <select
              className='form-select w-auto'
              aria-label='Ordenar productos'
              value={orden}
              onChange={event => setOrden(event.target.value)}
            >
              <option value='destacados'>Destacados</option>
              <option value='precio-asc'>Precio: menor a mayor</option>
              <option value='precio-desc'>Precio: mayor a menor</option>
            </select>
          </div>
          <div className='row row-cols-1 row-cols-sm-2 row-cols-xl-3 g-4'>{renderProductos()}</div>
        </section>
      </div>
    </>
  );
}
