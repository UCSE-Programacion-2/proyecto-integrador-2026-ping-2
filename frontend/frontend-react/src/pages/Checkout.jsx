import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice, getImageUrl } from '../utils/format';
import { alerta } from '../utils/alerts';
import { PROVINCIAS } from '../utils/provincias';

const FORM_INICIAL = {
  nombre: '',
  apellido: '',
  email: '',
  telefono: '',
  direccion: '',
  piso: '',
  ciudad: '',
  provincia: 'Jujuy',
  codigoPostal: '',
  metodoPago: 'mercadopago',
};

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const [form, setForm] = useState(FORM_INICIAL);
  const [validado, setValidado] = useState(false);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(actual => ({ ...actual, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();

    if (items.length === 0) {
      alerta('info', 'Tu carrito está vacío', 'Agregá productos antes de pagar.');
      return;
    }

    if (!event.currentTarget.checkValidity()) {
      setValidado(true);
      alerta('warning', 'Revisá el formulario', 'Completá los datos de envío.');
      return;
    }

    await alerta(
      'success',
      '¡Compra confirmada!',
      `Gracias ${form.nombre.trim()}, tu pedido por ${formatPrice(total)} está en camino.`,
    );
    clearCart();
    navigate('/');
  };

  const campo = (name, label, props = {}, columnas = 'col-12 col-sm-6') => (
    <div className={columnas}>
      <label htmlFor={name} className='form-label small fw-semibold text-secondary'>
        {label}
      </label>
      <input
        id={name}
        name={name}
        className='form-control'
        value={form[name]}
        onChange={handleChange}
        {...props}
      />
    </div>
  );

  return (
    <>
      <h1 className='h2 fw-bold text-uppercase mb-4'>Finalizar Compra</h1>
      <form className={validado ? 'was-validated' : ''} noValidate onSubmit={handleSubmit}>
        <div className='row g-4'>
          <div className='col-12 col-lg-8'>
            <div className='card border-0 shadow-sm rounded-4 p-4 bg-white mb-4'>
              <h2 className='h5 fw-bold text-uppercase mb-3 border-bottom pb-2'>
                1. Datos de Envío
              </h2>
              <div className='row g-3'>
                {campo('nombre', 'Nombre', { required: true })}
                {campo('apellido', 'Apellido', { required: true })}
                {campo('email', 'Correo Electrónico', {
                  type: 'email',
                  placeholder: 'nombre@ejemplo.com',
                  required: true,
                })}
                {campo('telefono', 'Teléfono / Celular', {
                  type: 'tel',
                  placeholder: '388-1234567',
                  required: true,
                })}
                {campo(
                  'direccion',
                  'Dirección (Calle y Número)',
                  { placeholder: 'Av. Fascio 100', required: true },
                  'col-12 col-sm-8',
                )}
                {campo('piso', 'Piso / Dpto (Opcional)', {}, 'col-12 col-sm-4')}
                {campo(
                  'ciudad',
                  'Ciudad',
                  { placeholder: 'San Salvador de Jujuy', required: true },
                  'col-12 col-sm-5',
                )}
                <div className='col-12 col-sm-4'>
                  <label
                    htmlFor='provincia'
                    className='form-label small fw-semibold text-secondary'
                  >
                    Provincia
                  </label>
                  <select
                    id='provincia'
                    name='provincia'
                    className='form-select'
                    value={form.provincia}
                    onChange={handleChange}
                    required
                  >
                    {PROVINCIAS.map(provincia => (
                      <option key={provincia} value={provincia}>
                        {provincia}
                      </option>
                    ))}
                  </select>
                </div>
                {campo(
                  'codigoPostal',
                  'Código Postal',
                  { placeholder: '4600', required: true },
                  'col-12 col-sm-3',
                )}
              </div>
            </div>

            <div className='card border-0 shadow-sm rounded-4 p-4 bg-white'>
              <h2 className='h5 fw-bold text-uppercase mb-3 border-bottom pb-2'>
                2. Método de Pago
              </h2>
              {[
                ['mercadopago', 'Mercado Pago / Tarjetas de Crédito y Débito'],
                ['transferencia', 'Transferencia Bancaria'],
              ].map(([valor, etiqueta]) => (
                <div className='form-check mb-3 p-3 border rounded-3 bg-light' key={valor}>
                  <input
                    id={valor}
                    name='metodoPago'
                    type='radio'
                    className='form-check-input ms-0 me-3'
                    value={valor}
                    checked={form.metodoPago === valor}
                    onChange={handleChange}
                  />
                  <label className='form-check-label fw-bold text-dark' htmlFor={valor}>
                    {etiqueta}
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className='col-12 col-lg-4'>
            <div
              className='card border-0 shadow-sm rounded-4 p-4 bg-white sticky-lg-top'
              style={{ top: 100, zIndex: 10 }}
            >
              <h2 className='h5 fw-bold text-uppercase mb-3 border-bottom pb-2'>
                Resumen del Pedido
              </h2>
              <ul className='list-group list-group-flush mb-3'>
                {items.length === 0 ? (
                  <li className='list-group-item px-0 py-3 bg-transparent text-muted small'>
                    Tu carrito está vacío.
                  </li>
                ) : (
                  items.map(item => (
                    <li
                      key={item.id}
                      className='list-group-item d-flex justify-content-between align-items-center px-0 py-3 bg-transparent'
                    >
                      <div className='d-flex align-items-center gap-3'>
                        <img
                          src={getImageUrl(item)}
                          alt={item.name}
                          className='rounded-3 border bg-light object-fit-cover'
                          style={{ width: 50, height: 50 }}
                        />
                        <div>
                          <h6 className='my-0 fw-bold small text-dark text-uppercase'>
                            {item.name}
                          </h6>
                          <small className='text-muted'>Cantidad: {item.cantidad}</small>
                        </div>
                      </div>
                      <span className='text-dark fw-semibold small'>
                        {formatPrice(item.price * item.cantidad)}
                      </span>
                    </li>
                  ))
                )}
              </ul>
              <div className='border-top pt-3'>
                <div className='d-flex justify-content-between mb-2 small text-secondary'>
                  <span>Subtotal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <div className='d-flex justify-content-between mb-2 small text-secondary'>
                  <span>Envío (Jujuy)</span>
                  <span className='text-success fw-semibold'>Gratis</span>
                </div>
                <hr className='my-2' />
                <div className='d-flex justify-content-between mb-4'>
                  <span className='fw-bold text-dark text-uppercase'>Total</span>
                  <strong className='h4 mb-0'>{formatPrice(total)}</strong>
                </div>
              </div>
              <button
                className='btn btn-warning btn-lg w-100 fw-bold text-uppercase shadow-sm py-2'
                type='submit'
              >
                Confirmar y Pagar
              </button>
              <div className='text-center mt-3'>
                <Link to='/catalogo' className='small fw-semibold'>
                  Volver al Catálogo
                </Link>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}
