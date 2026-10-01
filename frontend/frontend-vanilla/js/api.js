// Configuración central de la API: baseURL, headers y funciones de fetch reutilizables
export const API_URL = 'http://localhost:3000/api';

// Ruta raíz del front según la página actual (index.html está en la raíz, el resto en /pages)
export const ROOT = window.location.pathname.includes('/pages/') ? '..' : '.';

const IMAGEN_POR_DEFECTO = 'img/logo.jpg';

// Fetch genérico: agrega headers y maneja errores HTTP
export const apiFetch = async (endpoint, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };

  const response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || `Error ${response.status}`);
  }
  return data;
};

// Productos
export const getProducts = () => apiFetch('/products');
export const getProductById = (id) => apiFetch(`/products/${id}`);

// Helpers de presentación
export const formatPrice = (price) => `$${Number(price).toLocaleString('es-AR')}`;

export const getImageUrl = (product) => {
  if (product.image?.startsWith('http')) return product.image;
  return `${ROOT}/${product.image || IMAGEN_POR_DEFECTO}`;
};

// Evita inyectar HTML al renderizar datos que vienen de la BD
export const escapeHtml = (text = '') =>
  String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
