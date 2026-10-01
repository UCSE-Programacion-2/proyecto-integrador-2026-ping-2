// Navbar dinámico: muestra opciones distintas según haya sesión iniciada o no
import { ROOT, escapeHtml } from './api.js';
import { estaLogueado, cerrarSesion } from './auth.js';
import { contarItems } from './cart.js';

const menu = document.querySelector('#navbarNav .navbar-nav');

const itemAdmin = menu?.querySelector('a[href$="admin.html"]')?.closest('li');
const linkCarrito = menu?.querySelector('a[href$="carrito.html"]');

const crearItem = (html) => {
  const li = document.createElement('li');
  li.className = 'nav-item d-flex align-items-center justify-content-center';
  li.innerHTML = html;
  menu.appendChild(li);
  return li;
};

const renderizarSesion = () => {
  if (estaLogueado()) {
    const email = localStorage.getItem('userEmail') || '';
    crearItem(`<span class="small px-2" style="color: var(--color-texto-claro)">
      Hola, <strong>${escapeHtml(email.split('@')[0])}</strong></span>`);
    const salir = crearItem(
      '<button type="button" class="btn btn-sm btn-outline-light px-3 ms-lg-2">Cerrar sesión</button>',
    );
    salir.querySelector('button').addEventListener('click', () => {
      cerrarSesion();
      window.location.href = `${ROOT}/index.html`;
    });
  } else {
    // Sin sesión no se muestra el acceso al panel de administración
    itemAdmin?.remove();
    crearItem(`<a class="nav-link fw-semibold" href="${ROOT}/pages/login.html"
      style="color: var(--color-texto-claro)">Ingresar</a>`);
    crearItem(`<a class="btn btn-sm btn-warning fw-semibold text-dark px-3 ms-lg-2 mt-2 mt-lg-0"
      href="${ROOT}/pages/registro.html">Registrarse</a>`);
  }
};

// Contador de productos al lado del link "Carrito"
const badgeCarrito = document.createElement('span');
badgeCarrito.className = 'badge rounded-pill bg-warning text-dark ms-1';

const actualizarBadge = () => {
  const cantidad = contarItems();
  badgeCarrito.textContent = cantidad;
  badgeCarrito.classList.toggle('d-none', cantidad === 0);
};

if (menu) {
  renderizarSesion();
  if (linkCarrito) {
    linkCarrito.appendChild(badgeCarrito);
    actualizarBadge();
    window.addEventListener('carrito-actualizado', actualizarBadge);
    window.addEventListener('storage', actualizarBadge);
  }
}
