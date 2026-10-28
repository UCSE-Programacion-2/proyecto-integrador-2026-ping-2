import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import Message from '../components/Message';
import ProductGridLoading from '../components/ProductGridLoading';
import useProducts from '../hooks/useProducts';
import useAddToCart from '../hooks/useAddToCart';
import { formatPrice, normalizar } from '../utils/format';

export default function Catalog() {
  const { products, loading, lento, error } = useProducts();
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
    if (loading) return <ProductGridLoading cantidad={6} lento={lento} />;
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
    <div className='contenedor pagina'>
      <h1 className='titulo-pagina'>Catálogo</h1>

      <div className='buscador'>
        <label htmlFor='buscar' className='visually-hidden'>
          Buscar productos
        </label>
        <i className='bi bi-search buscador-icono' aria-hidden='true' />
        <input
          id='buscar'
          type='search'
          className='form-control'
          placeholder='Buscá por nombre o categoría'
          value={busqueda}
          onChange={event => setBusqueda(event.target.value)}
        />
      </div>

      <div className='filtros' role='group' aria-label='Filtrar por categoría'>
        {categorias.map(categoria => (
          <button
            key={categoria}
            type='button'
            className='chip'
            aria-pressed={categoriasActivas.includes(categoria)}
            onClick={() => alternarCategoria(categoria)}
          >
            {categoria}
          </button>
        ))}
        <button type='button' className='btn btn-sm btn-link link-subrayado' onClick={limpiar}>
          Limpiar filtros
        </button>
      </div>

      <div className='barra-resultados'>
        <p className='texto-suave mb-0' aria-live='polite'>
          {loading || error
            ? ''
            : `${visibles.length} ${visibles.length === 1 ? 'producto' : 'productos'}`}
        </p>
        <div className='d-flex flex-wrap align-items-center gap-3'>
          <div className='rango'>
            <label htmlFor='rango-precio' className='form-label mb-0 text-nowrap'>
              Hasta {formatPrice(precioActivo)}
            </label>
            <input
              id='rango-precio'
              type='range'
              className='form-range'
              min='0'
              max={tope}
              step='1000'
              value={precioActivo}
              onChange={event => setPrecioMaximo(Number(event.target.value))}
            />
          </div>
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
      </div>

      <div className='row row-cols-2 row-cols-md-3 row-cols-xl-4 g-3 g-md-4'>
        {renderProductos()}
      </div>
    </div>
  );
}
