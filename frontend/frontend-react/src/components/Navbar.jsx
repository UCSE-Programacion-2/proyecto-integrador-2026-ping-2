import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const LINKS = [
  { to: '/', label: 'Inicio', end: true },
  { to: '/catalogo', label: 'Catálogo' },
  { to: '/carrito', label: 'Carrito' },
  { to: '/checkout', label: 'Checkout' },
];

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { count } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const cerrar = () => setAbierto(false);

  return (
    <header className='encabezado-sitio sticky-top shadow-sm'>
      <nav
        className='navbar navbar-expand-lg navbar-dark bg-transparent container-fluid px-4'
        style={{ maxWidth: 'var(--ancho-contenedor)' }}
      >
        <Link
          className='navbar-brand fw-bold fs-3 text-uppercase'
          to='/'
          onClick={cerrar}
          style={{ color: 'var(--color-acento)' }}
        >
          TECNO X
        </Link>

        <button
          className='navbar-toggler border-0'
          type='button'
          aria-controls='navbarNav'
          aria-expanded={abierto}
          aria-label='Toggle navigation'
          onClick={() => setAbierto(a => !a)}
        >
          <span className='navbar-toggler-icon' />
        </button>

        <div
          className={`collapse navbar-collapse justify-content-end ${abierto ? 'show' : ''}`}
          id='navbarNav'
        >
          <ul className='navbar-nav gap-2 py-2 py-lg-0 text-center'>
            {LINKS.map(({ to, label, end }) => (
              <li className='nav-item' key={to}>
                <NavLink className='nav-link fw-semibold' to={to} end={end} onClick={cerrar}>
                  {label}
                  {to === '/carrito' && count > 0 && (
                    <span className='badge rounded-pill bg-warning text-dark ms-1'>{count}</span>
                  )}
                </NavLink>
              </li>
            ))}
            {isAdmin && (
              <li className='nav-item'>
                <NavLink
                  className='nav-link fw-semibold btn btn-sm btn-outline px-3 ms-lg-2 mt-2 mt-lg-0'
                  to='/admin'
                  onClick={cerrar}
                >
                  Admin
                </NavLink>
              </li>
            )}
            {user ? (
              <>
                <li className='nav-item d-flex align-items-center justify-content-center'>
                  <span className='small px-2' style={{ color: 'var(--color-texto-claro)' }}>
                    Hola, <strong>{user.email.split('@')[0]}</strong>
                  </span>
                </li>
                <li className='nav-item d-flex align-items-center justify-content-center'>
                  <button
                    type='button'
                    className='btn btn-sm btn-outline-light px-3 ms-lg-2'
                    onClick={() => {
                      logout();
                      cerrar();
                    }}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className='nav-item'>
                  <NavLink className='nav-link fw-semibold' to='/login' onClick={cerrar}>
                    Ingresar
                  </NavLink>
                </li>
                <li className='nav-item'>
                  <Link
                    className='btn btn-sm btn-warning fw-semibold text-dark px-3 ms-lg-2 mt-2 mt-lg-0'
                    to='/registro'
                    onClick={cerrar}
                  >
                    Registrarse
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>
    </header>
  );
}
