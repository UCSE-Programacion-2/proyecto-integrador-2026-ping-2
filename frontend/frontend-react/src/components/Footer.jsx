import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className='pie-sitio mt-auto py-4 shadow-lg border-top border-dark'>
      <div
        className='container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3'
        style={{ maxWidth: 'var(--ancho-contenedor)' }}
      >
        <p className='mb-0 fw-medium'>
          &copy; 2026{' '}
          <span className='fw-bold text-uppercase' style={{ color: 'var(--color-acento)' }}>
            TECNO X
          </span>{' '}
          - Tecnología en Jujuy
        </p>

        <div className='d-flex gap-3 fs-6'>
          <Link to='/catalogo'>Tienda</Link>
          <span className='text-secondary'>|</span>
          <Link to='/carrito'>Mi Carrito</Link>
        </div>
      </div>
    </footer>
  );
}
