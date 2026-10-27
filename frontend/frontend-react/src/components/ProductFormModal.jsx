import { useState } from 'react';
import PropTypes from 'prop-types';

const CATEGORIAS_BASE = ['Celulares', 'Auriculares', 'Parlantes', 'Accesorios'];

const aFormulario = product => ({
  name: product?.name ?? '',
  category: product?.category ?? CATEGORIAS_BASE[0],
  price: product?.price ?? '',
  stock: product?.stock ?? 0,
  description: product?.description ?? '',
  image: product?.image ?? '',
});

// Modal controlado: crea (product = null) o edita un producto. Se monta solo mientras está abierto.
export default function ProductFormModal({ product, onSave, onClose }) {
  const [form, setForm] = useState(() => aFormulario(product));
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  // Si la categoría del producto no está en la lista base (ej. cargada por seed), se agrega
  const categorias = CATEGORIAS_BASE.includes(form.category)
    ? CATEGORIAS_BASE
    : [...CATEGORIAS_BASE, form.category];

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(actual => ({ ...actual, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const datos = {
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock) || 0,
      description: form.description.trim(),
      image: form.image.trim(),
    };

    if (!datos.name || !datos.category || !datos.description) {
      setError('Completá nombre, categoría y descripción.');
      return;
    }
    if (!(datos.price > 0)) {
      setError('El precio debe ser mayor a 0.');
      return;
    }
    if (datos.stock < 0) {
      setError('El stock no puede ser negativo.');
      return;
    }

    setSaving(true);
    setError('');
    try {
      await onSave(datos);
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <>
      <div className='modal d-block' tabIndex='-1' role='dialog' aria-modal='true'>
        <div className='modal-dialog modal-dialog-centered modal-dialog-scrollable'>
          <form className='modal-content' onSubmit={handleSubmit} noValidate>
            <div className='modal-header'>
              <h2 className='modal-title h5'>{product ? 'Editar producto' : 'Crear producto'}</h2>
              <button type='button' className='btn-close' aria-label='Cerrar' onClick={onClose} />
            </div>
            <div className='modal-body'>
              <div className='mb-3'>
                <label htmlFor='name' className='form-label'>
                  Nombre
                </label>
                <input
                  id='name'
                  name='name'
                  className='form-control'
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='category' className='form-label'>
                  Categoría
                </label>
                <select
                  id='category'
                  name='category'
                  className='form-select'
                  value={form.category}
                  onChange={handleChange}
                >
                  {categorias.map(categoria => (
                    <option key={categoria} value={categoria}>
                      {categoria}
                    </option>
                  ))}
                </select>
              </div>
              <div className='row g-3 mb-3'>
                <div className='col-6'>
                  <label htmlFor='price' className='form-label'>
                    Precio
                  </label>
                  <input
                    id='price'
                    name='price'
                    type='number'
                    min='0'
                    className='form-control'
                    value={form.price}
                    onChange={handleChange}
                  />
                </div>
                <div className='col-6'>
                  <label htmlFor='stock' className='form-label'>
                    Stock
                  </label>
                  <input
                    id='stock'
                    name='stock'
                    type='number'
                    min='0'
                    className='form-control'
                    value={form.stock}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className='mb-3'>
                <label htmlFor='description' className='form-label'>
                  Descripción
                </label>
                <textarea
                  id='description'
                  name='description'
                  rows='3'
                  className='form-control'
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
              <div className='mb-3'>
                <label htmlFor='image' className='form-label'>
                  Imagen (URL o ruta, opcional)
                </label>
                <input
                  id='image'
                  name='image'
                  className='form-control'
                  placeholder='https://... o img/archivo.jpg'
                  value={form.image}
                  onChange={handleChange}
                />
              </div>
              {error && (
                <div className='alert alert-danger mb-0' role='alert'>
                  {error}
                </div>
              )}
            </div>
            <div className='modal-footer'>
              <button type='button' className='btn btn-outline-secondary' onClick={onClose}>
                Cancelar
              </button>
              <button type='submit' className='btn btn-warning fw-bold' disabled={saving}>
                {saving ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className='modal-backdrop show' />
    </>
  );
}

ProductFormModal.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string,
    category: PropTypes.string,
    price: PropTypes.number,
    stock: PropTypes.number,
    description: PropTypes.string,
    image: PropTypes.string,
  }),
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
