import { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Cartel from '../components/Cartel';
import Message from '../components/Message';
import useProducts from '../hooks/useProducts';
import useAddToCart from '../hooks/useAddToCart';
import { formatPrice, getImageUrl, normalizar } from '../utils/format';

const PROMOS = [
  { src: '/img/banners/redmi15c.jpg', nombre: 'Redmi 15C' },
  { src: '/img/banners/motog86.jpg', nombre: 'Motorola G86' },
  { src: '/img/banners/iphone17proMax.jpg', nombre: 'iPhone 17 Pro Max' },
  { src: '/img/banners/lenovoslim3.jpg', nombre: 'Lenovo Ideapad Slim 3' },
  { src: '/img/banners/notebookHP15.jpg', nombre: 'Notebook HP 15' },
];

const DESTACADOS = 6;
const PROMO_MS = 3200;

const REDES = [
  { href: 'https://www.instagram.com/tecno_x', label: 'Instagram' },
  { href: 'https://www.facebook.com/share/1AwqrLMqFf/', label: 'Facebook' },
];

// Primero los productos con foto propia del local
const conFotoPrimero = products =>
  [...products].sort((a, b) => Boolean(b.image) - Boolean(a.image));

function Vitrina({ producto, onAdd, movil = false }) {
  const clase = movil ? 'vitrina vitrina-movil' : 'vitrina';
  if (!producto) {
    return (
      <aside className={clase} aria-hidden='true'>
        <div className='vitrina-foto esqueleto' />
      </aside>
    );
  }
  const hayStock = producto.stock > 0;
  return (
    <aside className={clase} aria-label='Producto destacado'>
      <Link to={`/producto/${producto._id}`} className='vitrina-foto' tabIndex={-1}>
        {/* La clave fuerza el fundido cada vez que cambia el producto en vista */}
        <img key={producto._id} src={getImageUrl(producto)} alt={producto.name} />
      </Link>
      <div className='vitrina-pie'>
        <div>
          <p className='vitrina-nombre'>{producto.name}</p>
          <span className='vitrina-precio precio'>{formatPrice(producto.price)}</span>
        </div>
        <button
          type='button'
          className='btn btn-negro'
          disabled={!hayStock}
          onClick={() => onAdd(producto)}
        >
          {hayStock ? 'Agregar al carrito' : 'Sin stock'}
        </button>
      </div>
    </aside>
  );
}

Vitrina.propTypes = {
  producto: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    stock: PropTypes.number,
    image: PropTypes.string,
  }),
  onAdd: PropTypes.func.isRequired,
  movil: PropTypes.bool,
};

function Promociones() {
  const [actual, setActual] = useState(0);
  const siguiente = () => setActual(i => (i + 1) % PROMOS.length);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = setTimeout(() => setActual(i => (i + 1) % PROMOS.length), PROMO_MS);
    return () => clearTimeout(timer);
  }, [actual]);

  return (
    <section className='contenedor promos' aria-labelledby='titulo-promos'>
      <div>
        <h2 id='titulo-promos' className='titulo-seccion'>
          Promociones del local
        </h2>
        <p className='texto-suave mt-2 mb-0'>Las mismas que publicamos en nuestras historias.</p>
        <ul className='promos-lista'>
          {PROMOS.map((promo, i) => (
            <li key={promo.src}>
              <button
                type='button'
                className={`promos-opcion ${i === actual ? 'promos-opcion-activa' : ''}`}
                aria-pressed={i === actual}
                onClick={() => setActual(i)}
              >
                {promo.nombre}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <button
          type='button'
          className='marco border-0 p-0'
          onClick={siguiente}
          aria-label={`Promoción ${PROMOS[actual].nombre}. Ver la siguiente`}
        >
          {PROMOS.map((promo, i) => (
            <img
              key={promo.src}
              src={promo.src}
              alt=''
              loading='lazy'
              className={i === actual ? 'visible' : ''}
            />
          ))}
        </button>
        <p className='marco-pie' aria-live='polite'>
          {PROMOS[actual].nombre}
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  const { products, loading, lento, error } = useProducts();
  const agregar = useAddToCart();
  const [activo, setActivo] = useState(0);
  const renglones = useRef([]);

  const ordenados = useMemo(() => conFotoPrimero(products), [products]);
  const destacados = ordenados.slice(0, DESTACADOS);
  const campos = ordenados.filter(p => p.image && p.category === 'Computación').slice(0, 2);
  const parCampos = campos.length === 2 ? campos : ordenados.slice(DESTACADOS - 2, DESTACADOS);

  const categorias = useMemo(() => {
    const cuenta = {};
    products.forEach(p => {
      cuenta[p.category] = (cuenta[p.category] || 0) + 1;
    });
    return Object.entries(cuenta).sort(([a], [b]) => a.localeCompare(b));
  }, [products]);

  // Historia fijada: el renglón que cruza el centro de la pantalla manda en la vitrina amarilla
  useEffect(() => {
    if (destacados.length === 0) return undefined;
    const observador = new IntersectionObserver(
      entradas => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) setActivo(Number(entrada.target.dataset.indice));
        });
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    renglones.current.forEach(renglon => renglon && observador.observe(renglon));
    return () => observador.disconnect();
  }, [destacados.length]);

  const renderDestacados = () => {
    if (loading) {
      return (
        <>
          {lento && (
            <p className='aviso-carga' role='status'>
              Estamos despertando el servidor. La primera carga puede tardar hasta un minuto.
            </p>
          )}
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className='esqueleto mb-3' style={{ height: 96 }} aria-hidden='true' />
          ))}
        </>
      );
    }
    if (error) return <Message variant='danger'>{error}</Message>;
    if (destacados.length === 0)
      return <Message>No hay productos disponibles por el momento.</Message>;
    return (
      <ol className='list-unstyled m-0'>
        {destacados.map((producto, i) => (
          <li
            key={producto._id}
            ref={nodo => {
              renglones.current[i] = nodo;
            }}
            data-indice={i}
            className={`renglon ${i === activo ? 'renglon-activo' : ''}`}
          >
            <img className='renglon-foto' src={getImageUrl(producto)} alt='' loading='lazy' />
            <div>
              <Link to={`/producto/${producto._id}`} className='renglon-nombre'>
                {producto.name}
              </Link>
              <span className='renglon-categoria'>{producto.category}</span>
            </div>
            <div className='renglon-fin'>
              <span className='precio'>{formatPrice(producto.price)}</span>
              <button
                type='button'
                className='btn btn-outline-dark btn-sm'
                disabled={producto.stock <= 0}
                onClick={() => agregar(producto)}
              >
                {producto.stock > 0 ? 'Agregar' : 'Sin stock'}
                <span className='visually-hidden'> {producto.name}</span>
              </button>
            </div>
          </li>
        ))}
      </ol>
    );
  };

  return (
    <>
      <div className='escaparate'>
        <div className='escaparate-texto'>
          <section className='portada' aria-labelledby='titulo-portada'>
            <Cartel />
            <div className='portada-bajada'>
              <h1 id='titulo-portada' className='portada-titulo'>
                Tu tienda de celulares en Jujuy
              </h1>
              <p className='portada-frase'>
                Celulares, parlantes, auriculares y accesorios del local, con precio y stock a la
                vista.
              </p>
              <Link to='/catalogo' className='btn btn-negro'>
                Ver catálogo
              </Link>
            </div>
            <Vitrina movil producto={destacados[0]} onAdd={agregar} />
          </section>

          <section className='destacados' aria-labelledby='titulo-destacados'>
            <div className='destacados-cabecera'>
              <h2 id='titulo-destacados' className='titulo-seccion'>
                Destacados del local
              </h2>
              <Link to='/catalogo' className='link-subrayado'>
                Ver todo
              </Link>
            </div>
            {renderDestacados()}
          </section>
        </div>

        <Vitrina producto={destacados[activo]} onAdd={agregar} />
      </div>

      {categorias.length > 0 && (
        <section className='contenedor categorias' aria-labelledby='titulo-categorias'>
          <h2 id='titulo-categorias' className='titulo-seccion'>
            Explorá por categoría
          </h2>
          <ul className='categorias-lista'>
            {categorias.map(([categoria, cantidad], i) => (
              <li key={categoria}>
                <Link to={`/catalogo?cat=${normalizar(categoria)}`} className='categoria'>
                  {categoria}
                  <span className='categoria-cantidad'>
                    {cantidad}
                    <span className='visually-hidden'>
                      {cantidad === 1 ? ' producto' : ' productos'}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <Promociones />

      {parCampos.length === 2 && (
        <section className='dos-campos' aria-labelledby='titulo-campos'>
          {parCampos.map((producto, i) => (
            <div
              key={producto._id}
              className={`campo ${i === 0 ? 'campo-negro' : 'campo-amarillo'}`}
            >
              {i === 0 && (
                <h2 id='titulo-campos' className='titulo-seccion campo-titulo'>
                  Para estudiar y trabajar
                </h2>
              )}
              <img
                className='campo-foto'
                src={getImageUrl(producto)}
                alt={producto.name}
                loading='lazy'
              />
              <div className='campo-fila'>
                <div>
                  <p className='campo-nombre'>{producto.name}</p>
                  <span className='precio fs-5'>{formatPrice(producto.price)}</span>
                </div>
                <div className='d-flex flex-wrap gap-2 justify-content-end'>
                  <button
                    type='button'
                    className={`btn ${i === 0 ? 'btn-warning' : 'btn-negro'}`}
                    disabled={producto.stock <= 0}
                    onClick={() => agregar(producto)}
                  >
                    Agregar
                  </button>
                  <Link to={`/producto/${producto._id}`} className='btn btn-papel'>
                    Ver detalle
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>
      )}

      <section className='nosotros' aria-labelledby='titulo-nosotros'>
        <div>
          <h2 id='titulo-nosotros' className='nosotros-titulo'>
            Un local real, en Jujuy
          </h2>
          <img
            className='nosotros-foto'
            src='/img/Parlante.jpeg'
            alt='Un parlante JBL en la mano, frente al cartel de Tecno X en el local'
            loading='lazy'
          />
        </div>
        <div className='nosotros-bloques'>
          <div>
            <h3>Fotos del local</h3>
            <p>Cada producto lo fotografiamos en el local, en la mano y frente a nuestro cartel.</p>
          </div>
          <div>
            <h3>Seguinos</h3>
            <p>
              Novedades y promociones en{' '}
              {REDES.map(({ href, label }, i) => (
                <span key={href}>
                  {i > 0 && ' y '}
                  <a href={href} target='_blank' rel='noreferrer'>
                    {label}
                  </a>
                </span>
              ))}
              .
            </p>
          </div>
          <div>
            <Link to='/catalogo' className='btn btn-warning'>
              Ver catálogo
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
