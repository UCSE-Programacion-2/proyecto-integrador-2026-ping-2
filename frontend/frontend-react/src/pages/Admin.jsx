import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductFormModal from '../components/ProductFormModal';
import Message from '../components/Message';
import { useAuth } from '../context/AuthContext';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../services/api';
import { alerta, confirmar, toast } from '../utils/alerts';
import { formatPrice } from '../utils/format';

const STOCK_BAJO = 3;

const estadoProducto = stock => {
  if (stock <= 0) return <span className='badge text-bg-secondary'>Sin stock</span>;
  if (stock <= STOCK_BAJO) return <span className='badge text-bg-warning'>Stock bajo</span>;
  return <span className='badge text-bg-success'>Activo</span>;
};

export default function Admin() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busqueda, setBusqueda] = useState('');
  // undefined = modal cerrado, null = creando, objeto = editando
  const [editando, setEditando] = useState(undefined);

  const cargar = useCallback(async () => {
    try {
      setProductos(await getProducts());
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Token vencido o rol insuficiente: se informa y se vuelve al login
  const manejarAuth = async err => {
    if (err.status !== 401 && err.status !== 403) return false;
    setEditando(undefined);
    logout();
    await alerta('info', 'Tu sesión expiró', 'Volvé a iniciar sesión para seguir administrando.');
    navigate('/login', { state: { from: '/admin' } });
    return true;
  };

  const guardar = async datos => {
    const esEdicion = Boolean(editando);
    try {
      if (esEdicion) await updateProduct(editando._id, datos);
      else await createProduct(datos);
    } catch (err) {
      if (await manejarAuth(err)) return;
      throw err;
    }
    setEditando(undefined);
    toast('success', esEdicion ? 'Producto actualizado' : 'Producto creado');
    await cargar();
  };

  const eliminar = async producto => {
    const ok = await confirmar(
      '¿Eliminar producto?',
      `Se eliminará "${producto.name}". Esta acción no se puede deshacer.`,
      'Sí, eliminar',
    );
    if (!ok) return;

    try {
      await deleteProduct(producto._id);
      toast('success', 'Producto eliminado');
      await cargar();
    } catch (err) {
      if (await manejarAuth(err)) return;
      alerta('error', 'No se pudo eliminar', err.message);
    }
  };

  const texto = busqueda.trim().toLowerCase();
  const filtrados = productos.filter(
    p => p.name.toLowerCase().includes(texto) || p.category.toLowerCase().includes(texto),
  );

  const stats = [
    ['Productos', productos.length],
    ['Stock bajo', productos.filter(p => p.stock <= STOCK_BAJO).length],
    ['Categorías', new Set(productos.map(p => p.category)).size],
  ];

  const renderTabla = () => {
    if (loading) return <Message>Cargando productos...</Message>;
    if (error)
      return <Message variant='danger'>No se pudieron cargar los productos: {error}</Message>;

    return (
      <div className='table-responsive'>
        <table className='table table-hover align-middle mb-0'>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Estado</th>
              <th>
                <span className='visually-hidden'>Acciones</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtrados.length === 0 ? (
              <tr>
                <td colSpan='6' className='text-center text-muted py-4'>
                  No hay productos para mostrar.
                </td>
              </tr>
            ) : (
              filtrados.map(producto => (
                <tr key={producto._id}>
                  <td>
                    <strong>{producto.name}</strong>
                    <p className='small text-muted mb-0 text-truncate' style={{ maxWidth: 280 }}>
                      {producto.description}
                    </p>
                  </td>
                  <td>{producto.category}</td>
                  <td>{formatPrice(producto.price)}</td>
                  <td>{producto.stock}</td>
                  <td>{estadoProducto(producto.stock)}</td>
                  <td className='text-end text-nowrap'>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-dark me-2'
                      onClick={() => setEditando(producto)}
                    >
                      Editar
                    </button>
                    <button
                      type='button'
                      className='btn btn-sm btn-outline-danger'
                      onClick={() => eliminar(producto)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className='contenedor pagina'>
      <div className='d-flex flex-wrap justify-content-between align-items-center gap-3 mb-4'>
        <h1 className='titulo-pagina mb-0'>Panel de administración</h1>
        <button type='button' className='btn btn-warning fw-bold' onClick={() => setEditando(null)}>
          Crear producto
        </button>
      </div>

      <div className='row g-3 mb-4'>
        {stats.map(([label, valor]) => (
          <div className='col-12 col-md-4' key={label}>
            <div className='card border-0 rounded-4 p-3 bg-white text-center'>
              <span className='text-secondary small'>{label}</span>
              <strong className='h3 mb-0'>{valor}</strong>
            </div>
          </div>
        ))}
      </div>

      <div className='card border-0 rounded-4 p-3 bg-white'>
        <input
          type='search'
          className='form-control mb-3'
          placeholder='Buscar por nombre o categoría'
          aria-label='Buscar producto'
          value={busqueda}
          onChange={event => setBusqueda(event.target.value)}
        />
        {renderTabla()}
      </div>

      {editando !== undefined && (
        <ProductFormModal
          product={editando}
          onSave={guardar}
          onClose={() => setEditando(undefined)}
        />
      )}
    </div>
  );
}
