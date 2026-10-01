// Carrito: array de productos persistido en localStorage
import { formatPrice, getImageUrl, escapeHtml } from './api.js';

const CLAVE_CARRITO = 'carrito';

export const getCarrito = () => {
  try {
    return JSON.parse(localStorage.getItem(CLAVE_CARRITO)) || [];
  } catch {
    return [];
  }
};

const guardarCarrito = (carrito) => {
  localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
  // Avisa al resto de la página (ej. el contador del navbar) que el carrito cambió
  window.dispatchEvent(new CustomEvent('carrito-actualizado'));
};

export const contarItems = () => getCarrito().reduce((total, item) => total + item.cantidad, 0);

export const calcularTotal = (carrito = getCarrito()) =>
  carrito.reduce((total, item) => total + item.price * item.cantidad, 0);

// Agrega un producto (o suma cantidad si ya estaba), sin superar el stock disponible
export const agregarAlCarrito = (product, cantidad = 1) => {
  const carrito = getCarrito();
  const existente = carrito.find((item) => item.id === product._id);
  const actual = existente ? existente.cantidad : 0;
  const nuevaCantidad = Math.min(actual + cantidad, product.stock);

  if (nuevaCantidad <= actual) return false;

  if (existente) {
    existente.cantidad = nuevaCantidad;
  } else {
    carrito.push({
      id: product._id,
      name: product.name,
      price: product.price,
      category: product.category,
      image: product.image,
      stock: product.stock,
      cantidad: nuevaCantidad,
    });
  }
  guardarCarrito(carrito);
  return true;
};

export const cambiarCantidad = (id, cantidad) => {
  const carrito = getCarrito();
  const item = carrito.find((i) => i.id === id);
  if (!item) return;
  item.cantidad = Math.max(1, Math.min(cantidad, item.stock || cantidad));
  guardarCarrito(carrito);
};

export const eliminarDelCarrito = (id) => {
  guardarCarrito(getCarrito().filter((item) => item.id !== id));
};

export const vaciarCarrito = () => guardarCarrito([]);

// Muestra un aviso al agregar (usa SweetAlert2 si la página lo incluye)
export const avisarAgregado = (agregado, nombre) => {
  const titulo = agregado ? `${nombre} agregado al carrito` : 'No hay más stock disponible';
  if (window.Swal) {
    window.Swal.fire({
      toast: true,
      position: 'top-end',
      icon: agregado ? 'success' : 'warning',
      title: titulo,
      showConfirmButton: false,
      timer: 2000,
    });
  }
};

/* ---------- Renderizado de la página del carrito (carrito.html) ---------- */

const tablaItems = document.getElementById('carrito-items');
const listaMobile = document.getElementById('carrito-items-mobile');
const resumenCantidad = document.getElementById('resumen-cantidad');
const resumenSubtotal = document.getElementById('resumen-subtotal');
const resumenTotal = document.getElementById('resumen-total');
const btnContinuar = document.getElementById('btn-continuar-compra');

const selectorCantidad = (item) => `
  <div class="input-group input-group-sm justify-content-center flex-nowrap" style="width: 110px">
    <button class="btn btn-outline-secondary" type="button" data-accion="restar" data-id="${escapeHtml(item.id)}">-</button>
    <span class="input-group-text bg-white fw-semibold">${item.cantidad}</span>
    <button class="btn btn-outline-secondary" type="button" data-accion="sumar" data-id="${escapeHtml(item.id)}">+</button>
  </div>
`;

const botonEliminar = (item) => `
  <button class="btn btn-sm btn-link text-danger" type="button" data-accion="eliminar"
    data-id="${escapeHtml(item.id)}" aria-label="Eliminar ${escapeHtml(item.name)}">
    <i class="bi bi-trash3-fill fs-5"></i>
  </button>
`;

const filaTabla = (item) => `
  <tr>
    <td class="p-3">
      <div class="d-flex align-items-center gap-3">
        <img src="${escapeHtml(getImageUrl(item))}" alt="${escapeHtml(item.name)}"
          class="rounded-3 object-fit-cover" style="width: 60px; height: 60px" />
        <div>
          <h2 class="h6 fw-bold mb-0 text-dark">${escapeHtml(item.name)}</h2>
          <small class="text-muted text-uppercase">${escapeHtml(item.category)}</small>
        </div>
      </div>
    </td>
    <td class="text-center fw-medium">${formatPrice(item.price)}</td>
    <td class="text-center"><div class="d-flex justify-content-center">${selectorCantidad(item)}</div></td>
    <td class="text-center fw-bold text-success">${formatPrice(item.price * item.cantidad)}</td>
    <td class="text-end pe-3">${botonEliminar(item)}</td>
  </tr>
`;

const tarjetaMobile = (item) => `
  <div class="card border-0 shadow-sm rounded-4 overflow-hidden mb-3 p-3 bg-white">
    <div class="d-flex gap-3 align-items-center">
      <img src="${escapeHtml(getImageUrl(item))}" alt="${escapeHtml(item.name)}"
        class="rounded-3 object-fit-cover" style="width: 70px; height: 70px" />
      <div class="flex-grow-1">
        <span class="text-muted small text-uppercase">${escapeHtml(item.category)}</span>
        <h2 class="h6 fw-bold text-dark mb-1">${escapeHtml(item.name)}</h2>
        <div class="d-flex justify-content-between align-items-center mt-2">
          ${selectorCantidad(item)}
          <span class="fw-bold text-success">${formatPrice(item.price * item.cantidad)}</span>
        </div>
      </div>
      ${botonEliminar(item)}
    </div>
  </div>
`;

const renderizarCarrito = () => {
  const carrito = getCarrito();
  const total = calcularTotal(carrito);
  const cantidad = carrito.reduce((suma, item) => suma + item.cantidad, 0);

  if (carrito.length === 0) {
    tablaItems.innerHTML = `
      <tr><td colspan="5" class="text-center text-muted py-5">Tu carrito está vacío.</td></tr>`;
    listaMobile.innerHTML = '<p class="text-center text-muted py-5">Tu carrito está vacío.</p>';
  } else {
    tablaItems.innerHTML = carrito.map(filaTabla).join('');
    listaMobile.innerHTML = carrito.map(tarjetaMobile).join('');
  }

  resumenCantidad.textContent = `Subtotal (${cantidad} ${cantidad === 1 ? 'producto' : 'productos'})`;
  resumenSubtotal.textContent = formatPrice(total);
  resumenTotal.textContent = formatPrice(total);
  btnContinuar.classList.toggle('disabled', carrito.length === 0);
};

const manejarAccion = (event) => {
  const boton = event.target.closest('[data-accion]');
  if (!boton) return;

  const { accion, id } = boton.dataset;
  const item = getCarrito().find((i) => i.id === id);
  if (!item) return;

  if (accion === 'sumar') cambiarCantidad(id, item.cantidad + 1);
  if (accion === 'restar') cambiarCantidad(id, item.cantidad - 1);
  if (accion === 'eliminar') eliminarDelCarrito(id);
  renderizarCarrito();
};

if (tablaItems) {
  tablaItems.addEventListener('click', manejarAccion);
  listaMobile.addEventListener('click', manejarAccion);
  renderizarCarrito();
}

/* ---------- Resumen del pedido en checkout.html ---------- */

const resumenCheckout = document.getElementById('checkout-items');

if (resumenCheckout) {
  const carrito = getCarrito();
  const total = formatPrice(calcularTotal(carrito));

  resumenCheckout.innerHTML =
    carrito.length === 0
      ? '<li class="list-group-item px-0 py-3 bg-transparent text-muted small">Tu carrito está vacío.</li>'
      : carrito
          .map(
            (item) => `
      <li class="list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-transparent">
        <div class="d-flex align-items-center gap-3">
          <img src="${escapeHtml(getImageUrl(item))}" alt="${escapeHtml(item.name)}"
            class="rounded-3 border bg-light object-fit-cover" style="width: 50px; height: 50px" />
          <div>
            <h6 class="my-0 fw-bold small text-dark text-uppercase">${escapeHtml(item.name)}</h6>
            <small class="text-muted">Cantidad: ${item.cantidad}</small>
          </div>
        </div>
        <span class="text-dark fw-semibold small">${formatPrice(item.price * item.cantidad)}</span>
      </li>`,
          )
          .join('');

  document.getElementById('checkout-subtotal').textContent = total;
  document.getElementById('checkout-total').textContent = total;
}

/* ---------- Confirmación de compra en checkout.html ---------- */

const formCheckout = document.getElementById('form-checkout');

if (formCheckout) {
  formCheckout.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (getCarrito().length === 0) {
      Swal.fire({ icon: 'info', title: 'Tu carrito está vacío', text: 'Agregá productos antes de pagar.' });
      return;
    }

    if (!formCheckout.checkValidity()) {
      formCheckout.classList.add('was-validated');
      Swal.fire({ icon: 'warning', title: 'Revisá el formulario', text: 'Completá los datos de envío.' });
      return;
    }

    const total = formatPrice(calcularTotal());
    await Swal.fire({
      icon: 'success',
      title: '¡Compra confirmada!',
      text: `Gracias ${formCheckout.nombre.value.trim()}, tu pedido por ${total} está en camino.`,
    });
    vaciarCarrito();
    window.location.href = '../index.html';
  });
}
