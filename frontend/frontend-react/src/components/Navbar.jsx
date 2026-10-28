import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const [abierto, setAbierto] = useState(false);
  const { count } = useCart();
  const { user, isAdmin, logout } = useAuth();
  const cerrar = () => setAbierto(false);

  return (
    <header className='barra'>
      <nav className='contenedor barra-fila' aria-label='Principal'>
        <Link className='barra-marca marca' to='/' onClick={cerrar}>
          Tecno X
        </Link>

        <button
          className='barra-menu'
          type='button'
          aria-controls='barra-nav'
          aria-expanded={abierto}
          onClick={() => setAbierto(a => !a)}
        >
          {abierto ? 'Cerrar' : 'Menú'}
        </button>

        <div id='barra-nav' className={`barra-nav ${abierto ? 'barra-nav-abierta' : ''}`}>
          <ul className='barra-links'>
            <li>
              <NavLink className='barra-link' to='/' end onClick={cerrar}>
                Inicio
              </NavLink>
            </li>
            <li>
              <NavLink className='barra-link' to='/catalogo' onClick={cerrar}>
                Catálogo
              </NavLink>
            </li>
            {isAdmin && (
              <li>
                <NavLink className='barra-link' to='/admin' onClick={cerrar}>
                  Admin
                </NavLink>
              </li>
            )}
            {user ? (
              <>
                <li className='barra-usuario'>
                  Hola, <strong>{user.email.split('@')[0]}</strong>
                </li>
                <li>
                  <button
                    type='button'
                    className='barra-link border-0 bg-transparent'
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
                <li>
                  <NavLink className='barra-link' to='/login' onClick={cerrar}>
                    Ingresar
                  </NavLink>
                </li>
                <li>
                  <NavLink className='barra-link' to='/registro' onClick={cerrar}>
                    Crear cuenta
                  </NavLink>
                </li>
              </>
            )}
            <li>
              <NavLink className='barra-link' to='/carrito' onClick={cerrar}>
                Carrito
                {/* La clave cambia con la cantidad para que la insignia salte en cada cambio */}
                <span key={count} className={`insignia ${count > 0 ? 'insignia-salta' : ''}`}>
                  {count}
                  <span className='visually-hidden'> {count === 1 ? 'producto' : 'productos'}</span>
                </span>
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </header>
  );
}
