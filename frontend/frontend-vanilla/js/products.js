// Listado de productos (Home y Catálogo): trae los productos de la API y genera las tarjetas
import { ROOT, getProducts, formatPrice, getImageUrl, escapeHtml } from './api.js';

const contenedor = document.getElementById('lista-productos');
const contador = document.getElementById('contador-productos');

const crearTarjeta = (product) => `
  <div class="col">
    <div class="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
      <img
        src="${escapeHtml(getImageUrl(product))}"
        class="card-img-top object-fit-cover bg-light"
        alt="${escapeHtml(product.name)}"
        style="height: 200px"
      />
      <div class="card-body d-flex flex-column justify-content-between">
        <div>
          <span class="text-muted small text-uppercase">${escapeHtml(product.category)}</span>
          <h3 class="card-title h6 fw-bold text-dark mt-1">${escapeHtml(product.name)}</h3>
          <p class="card-text text-success fw-bold fs-5 mb-0">${formatPrice(product.price)}</p>
        </div>
        <a
          href="${ROOT}/pages/detalle-producto.html?id=${encodeURIComponent(product._id)}"
          class="btn btn-outline-dark btn-sm w-100 rounded-3 mt-3"
          >Ver Detalle</a
        >
      </div>
    </div>
  </div>
`;

const mostrarMensaje = (mensaje) => {
  contenedor.innerHTML = `<p class="text-muted text-center w-100 py-5">${mensaje}</p>`;
};

let productos = [];

/* ---------- Filtros del catálogo (solo existen en catalogo.html) ---------- */

const filtroCategorias = document.getElementById('filtro-categorias');
const rangoPrecio = document.getElementById('rango-precio');
const labelPrecio = document.getElementById('label-precio');
const ordenProductos = document.getElementById('orden-productos');
const btnLimpiar = document.getElementById('btn-limpiar-filtros');

const normalizar = (texto = '') =>
  texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

const categoriasSeleccionadas = () =>
  [...filtroCategorias.querySelectorAll('input:checked')].map((input) => input.value);

const aplicarFiltros = (lista) => {
  if (!filtroCategorias) return lista;

  const categorias = categoriasSeleccionadas();
  const precioMaximo = Number(rangoPrecio.value);

  const filtrados = lista.filter(
    (p) =>
      (categorias.length === 0 || categorias.includes(p.category)) && p.price <= precioMaximo,
  );

  if (ordenProductos.value === 'precio-asc') filtrados.sort((a, b) => a.price - b.price);
  if (ordenProductos.value === 'precio-desc') filtrados.sort((a, b) => b.price - a.price);
  return filtrados;
};

const actualizarLabelPrecio = () => {
  labelPrecio.textContent = `Hasta: ${formatPrice(rangoPrecio.value)}`;
};

// Genera un checkbox por cada categoría que exista en la BD
const renderizarCategorias = () => {
  const categorias = [...new Set(productos.map((p) => p.category))].sort();
  // ?cat=celulares viene de los accesos por categoría del Home
  const catUrl = normalizar(new URLSearchParams(window.location.search).get('cat') || '');

  filtroCategorias.innerHTML = categorias
    .map(
      (categoria, i) => `
      <div class="form-check mb-2">
        <input class="form-check-input" type="checkbox" id="cat-${i}" value="${escapeHtml(categoria)}"
          ${normalizar(categoria) === catUrl ? 'checked' : ''} />
        <label class="form-check-label text-dark" for="cat-${i}">${escapeHtml(categoria)}</label>
      </div>`,
    )
    .join('');
};

// Ajusta el rango de precio al producto más caro
const configurarRangoPrecio = () => {
  const maximo = Math.max(...productos.map((p) => p.price), 0);
  const tope = Math.ceil(maximo / 10000) * 10000 || 1000000;
  rangoPrecio.max = tope;
  rangoPrecio.value = tope;
  actualizarLabelPrecio();
};

const limpiarFiltros = () => {
  filtroCategorias.querySelectorAll('input').forEach((input) => {
    input.checked = false;
  });
  rangoPrecio.value = rangoPrecio.max;
  ordenProductos.value = 'destacados';
  actualizarLabelPrecio();
  mostrarProductos();
};

/* ---------- Renderizado de la grilla ---------- */

function mostrarProductos() {
  // data-limit permite mostrar solo algunos (ej. destacados en el Home)
  const limite = Number(contenedor.dataset.limit) || productos.length;
  const visibles = aplicarFiltros(productos).slice(0, limite);

  if (contador) {
    contador.textContent = `Mostrando ${visibles.length} ${visibles.length === 1 ? 'producto' : 'productos'}`;
  }

  if (visibles.length === 0) {
    mostrarMensaje(
      productos.length === 0
        ? 'No hay productos disponibles por el momento.'
        : 'No hay productos que coincidan con los filtros.',
    );
    return;
  }

  contenedor.innerHTML = '';
  visibles.forEach((product) => {
    contenedor.insertAdjacentHTML('beforeend', crearTarjeta(product));
  });
}

const renderizarProductos = async () => {
  if (!contenedor) return;

  try {
    productos = await getProducts();
  } catch (error) {
    console.error('Error al cargar productos:', error);
    if (contador) contador.textContent = '';
    mostrarMensaje('No se pudieron cargar los productos. Intentá de nuevo más tarde.');
    return;
  }

  if (filtroCategorias) {
    renderizarCategorias();
    configurarRangoPrecio();
    filtroCategorias.addEventListener('change', mostrarProductos);
    rangoPrecio.addEventListener('input', () => {
      actualizarLabelPrecio();
      mostrarProductos();
    });
    ordenProductos.addEventListener('change', mostrarProductos);
    btnLimpiar.addEventListener('click', limpiarFiltros);
  }

  mostrarProductos();
};

renderizarProductos();
