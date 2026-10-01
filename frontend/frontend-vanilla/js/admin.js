// Panel de administración: CRUD de productos contra la API
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  formatPrice,
  escapeHtml,
} from './api.js';
import { estaLogueado, cerrarSesion } from './auth.js';

const STOCK_BAJO = 3;

const tabla = document.getElementById('tabla-productos');
const buscador = document.getElementById('buscar-producto');
const form = document.getElementById('form-producto');
const tituloModal = document.getElementById('modalProductoLabel');
const selectCategoria = document.getElementById('categoriaProducto');
const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalProducto'));

let productos = [];

const estadoProducto = (stock) => {
  if (stock <= 0) return '<span class="badge text-bg-secondary">Sin stock</span>';
  if (stock <= STOCK_BAJO) return '<span class="badge text-bg-warning">Stock bajo</span>';
  return '<span class="badge text-bg-success">Activo</span>';
};

const filaProducto = (product) => `
  <tr>
    <td>
      <strong>${escapeHtml(product.name)}</strong>
      <p class="small text-muted mb-0 text-truncate" style="max-width: 280px">
        ${escapeHtml(product.description)}
      </p>
    </td>
    <td>${escapeHtml(product.category)}</td>
    <td>${formatPrice(product.price)}</td>
    <td>${product.stock}</td>
    <td>${estadoProducto(product.stock)}</td>
    <td class="text-end text-nowrap">
      <button class="btn btn-sm btn-outline-dark" type="button" data-editar="${escapeHtml(product._id)}">Editar</button>
      <button class="btn btn-sm btn-outline-danger" type="button" data-eliminar="${escapeHtml(product._id)}">Eliminar</button>
    </td>
  </tr>
`;

const renderizarTabla = () => {
  const texto = buscador.value.trim().toLowerCase();
  const filtrados = productos.filter(
    (p) => p.name.toLowerCase().includes(texto) || p.category.toLowerCase().includes(texto),
  );

  tabla.innerHTML =
    filtrados.length > 0
      ? filtrados.map(filaProducto).join('')
      : '<tr><td colspan="6" class="text-center text-muted py-4">No hay productos para mostrar.</td></tr>';
};

const renderizarResumen = () => {
  document.getElementById('stat-total').textContent = productos.length;
  document.getElementById('stat-stock-bajo').textContent = productos.filter(
    (p) => p.stock <= STOCK_BAJO,
  ).length;
  document.getElementById('stat-categorias').textContent = new Set(
    productos.map((p) => p.category),
  ).size;
};

const cargarProductos = async () => {
  try {
    productos = await getProducts();
    renderizarTabla();
    renderizarResumen();
  } catch (error) {
    tabla.innerHTML = `<tr><td colspan="6" class="text-center text-danger py-4">
      No se pudieron cargar los productos: ${escapeHtml(error.message)}</td></tr>`;
  }
};

// Si la categoría del producto no está en el select (ej. cargada por seed), la agrega
const asegurarCategoria = (categoria) => {
  const existe = [...selectCategoria.options].some((o) => o.value === categoria);
  if (!existe) selectCategoria.add(new Option(categoria, categoria));
};

const abrirParaCrear = () => {
  form.reset();
  form.productoId.value = '';
  tituloModal.textContent = 'Crear producto';
};

const abrirParaEditar = (id) => {
  const product = productos.find((p) => p._id === id);
  if (!product) return;

  form.reset();
  asegurarCategoria(product.category);
  form.productoId.value = product._id;
  form.nombreProducto.value = product.name;
  form.categoriaProducto.value = product.category;
  form.precioProducto.value = product.price;
  form.stockProducto.value = product.stock;
  form.descripcionProducto.value = product.description;
  form.imagenProducto.value = product.image || '';
  tituloModal.textContent = 'Editar producto';
  modal.show();
};

const leerFormulario = () => ({
  name: form.nombreProducto.value.trim(),
  category: form.categoriaProducto.value,
  price: Number(form.precioProducto.value),
  stock: Number(form.stockProducto.value) || 0,
  description: form.descripcionProducto.value.trim(),
  image: form.imagenProducto.value.trim(),
});

const validarProducto = (product) => {
  if (!product.name || !product.category || !product.description) {
    return 'Completá nombre, categoría y descripción.';
  }
  if (!(product.price > 0)) return 'El precio debe ser mayor a 0.';
  if (product.stock < 0) return 'El stock no puede ser negativo.';
  return null;
};

const guardarProducto = async (event) => {
  event.preventDefault();
  const product = leerFormulario();
  const error = validarProducto(product);

  if (error) {
    Swal.fire({ icon: 'warning', title: 'Revisá el formulario', text: error });
    return;
  }

  const id = form.productoId.value;
  try {
    if (id) {
      await updateProduct(id, product);
    } else {
      await createProduct(product);
    }
    modal.hide();
    Swal.fire({
      icon: 'success',
      title: id ? 'Producto actualizado' : 'Producto creado',
      timer: 1500,
      showConfirmButton: false,
    });
    await cargarProductos();
  } catch (err) {
    if (err.status === 401) {
      modal.hide();
      sesionExpirada();
      return;
    }
    Swal.fire({ icon: 'error', title: 'No se pudo guardar', text: err.message });
  }
};

// Token vencido o inválido: se cierra la sesión y se vuelve a pedir login
const sesionExpirada = async () => {
  cerrarSesion();
  await Swal.fire({
    icon: 'info',
    title: 'Tu sesión expiró',
    text: 'Volvé a iniciar sesión para seguir administrando productos.',
  });
  window.location.href = './login.html';
};

const confirmarEliminacion = async (id) => {
  const product = productos.find((p) => p._id === id);
  if (!product) return;

  const { isConfirmed } = await Swal.fire({
    icon: 'warning',
    title: '¿Eliminar producto?',
    text: `Se eliminará "${product.name}". Esta acción no se puede deshacer.`,
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#dc3545',
  });
  if (!isConfirmed) return;

  try {
    await deleteProduct(id);
    Swal.fire({ icon: 'success', title: 'Producto eliminado', timer: 1500, showConfirmButton: false });
    await cargarProductos();
  } catch (err) {
    if (err.status === 401) {
      sesionExpirada();
      return;
    }
    Swal.fire({ icon: 'error', title: 'No se pudo eliminar', text: err.message });
  }
};

const iniciarPanel = async () => {
  // El panel solo se usa con sesión iniciada
  if (!estaLogueado()) {
    await Swal.fire({
      icon: 'info',
      title: 'Iniciá sesión',
      text: 'Necesitás iniciar sesión para acceder al panel de administración.',
    });
    window.location.href = './login.html';
    return;
  }

  document.getElementById('btn-crear-producto').addEventListener('click', abrirParaCrear);
  form.addEventListener('submit', guardarProducto);
  buscador.addEventListener('input', renderizarTabla);
  tabla.addEventListener('click', (event) => {
    const editar = event.target.closest('[data-editar]');
    const eliminar = event.target.closest('[data-eliminar]');
    if (editar) abrirParaEditar(editar.dataset.editar);
    if (eliminar) confirmarEliminacion(eliminar.dataset.eliminar);
  });

  cargarProductos();
};

iniciarPanel();
