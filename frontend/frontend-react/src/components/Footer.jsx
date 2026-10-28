import { Link } from 'react-router-dom';

const REDES = [
  { href: 'https://www.instagram.com/tecno_x', label: 'Instagram' },
  { href: 'https://www.facebook.com/share/1AwqrLMqFf/', label: 'Facebook' },
];

export default function Footer() {
  return (
    <footer className='pie'>
      <div className='contenedor'>
        <div className='pie-fila'>
          <ul className='pie-links'>
            <li>
              <Link to='/catalogo'>Catálogo</Link>
            </li>
            <li>
              <Link to='/carrito'>Mi carrito</Link>
            </li>
          </ul>
          <ul className='pie-links'>
            {REDES.map(({ href, label }) => (
              <li key={href}>
                <a href={href} target='_blank' rel='noreferrer'>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <p className='pie-nombre marca' aria-hidden='true'>
        Tecno X
      </p>
      <div className='contenedor pie-legal'>© 2026 Tecno X · Tecnología en Jujuy</div>
    </footer>
  );
}
