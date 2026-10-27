// Cliente HTTP central: baseURL desde variable de entorno, token y manejo de errores
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').replace(
  /\/$/,
  '',
);

export const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const apiFetch = async (endpoint, options = {}) => {
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(`${API_URL}${endpoint}`, { ...options, headers });
  } catch {
    throw new Error('No se pudo conectar con el servidor. Intentá de nuevo más tarde.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const error = new Error(data?.message || `Error ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return data;
};

// Productos
export const getProducts = () => apiFetch('/products');
export const getProductById = id => apiFetch(`/products/${id}`);
export const createProduct = product =>
  apiFetch('/products', { method: 'POST', body: JSON.stringify(product) });
export const updateProduct = (id, product) =>
  apiFetch(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) });
export const deleteProduct = id => apiFetch(`/products/${id}`, { method: 'DELETE' });

// Autenticación
export const loginUser = (email, password) =>
  apiFetch('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
export const registerUser = (email, password) =>
  apiFetch('/auth/register', { method: 'POST', body: JSON.stringify({ email, password }) });
