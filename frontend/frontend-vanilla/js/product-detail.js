// Detalle de producto: lee el ?id= de la URL y consulta /api/products/:id
import { getProductById, formatPrice, getImageUrl, escapeHtml } from './api.js';

const contenedor = document.getElementById('detalle-producto');

const mostrarError = (mensaje) => {
  contenedor.innerHTML = `
    <div class="col-12 text-center py-5">
      <p class="text-muted fs-5">${mensaje}</p>
      <a href="./catalogo.html" class="btn btn-warning fw-bold text-uppercase">Volver al Catálogo</a>
    </div>
  `;
};

const renderizarDetalle = (product) => {
  document.title = `TECNO X | ${product.name}`;
  const sinStock = product.stock <= 0;

  contenedor.innerHTML = `
    <!-- Columna Izquierda: Imagen -->
    <div class="col-12 col-md-6">
      <div class="card border-0 shadow-sm rounded-4 overflow-hidden p-4 bg-white text-center">
        <img
          src="${escapeHtml(getImageUrl(product))}"
          class="img-fluid rounded-3 object-fit-contain w-100"
          alt="${escapeHtml(product.name)}"
          style="max-height: 380px"
        />
      </div>
    </div>

    <!-- Columna Derecha: Datos de Compra -->
    <div class="col-12 col-md-6 d-flex flex-column justify-content-start">
      <h1 class="fw-extrabold display-6 text-dark text-uppercase mb-1">${escapeHtml(product.name)}</h1>
      <p class="text-muted small mb-3">
        Categoría: <span class="fw-semibold">${escapeHtml(product.category)}</span> |
        Código: TX-${escapeHtml(product._id.slice(-6).toUpperCase())}
      </p>

      <div class="p-3 rounded-4 mb-4 border" style="background-color: rgba(0, 0, 0, 0.02)">
        <span class="h2 fw-bold text-success mb-0">${formatPrice(product.price)}</span>
        <p class="small mt-2 mb-0 ${sinStock ? 'text-danger fw-semibold' : 'text-muted'}">
          ${sinStock ? 'Sin stock' : `Stock disponible: ${product.stock}`}
        </p>
      </div>

      <p class="text-secondary fs-5-custom mb-3">${escapeHtml(product.description)}</p>
    </div>
  `;
};

const cargarDetalle = async () => {
  const id = new URLSearchParams(window.location.search).get('id');

  if (!id) {
    mostrarError('No se indicó ningún producto.');
    return;
  }

  try {
    const product = await getProductById(id);
    renderizarDetalle(product);
  } catch (error) {
    console.error('Error al cargar el producto:', error);
    mostrarError('No encontramos el producto que buscás.');
  }
};

cargarDetalle();
