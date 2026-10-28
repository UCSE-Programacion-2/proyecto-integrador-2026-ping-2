import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Cartel from '../components/Cartel';
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
      <label htmlFor={name} className='form-label'>
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

  if (items.length === 0) {
    return (
      <div className='contenedor pagina'>
        <h1 className='titulo-pagina'>Finalizar compra</h1>
        <div className='vacio'>
          <Cartel lema={false} />
          <p className='fs-4 fw-bold mb-0'>No hay nada para pagar todavía</p>
          <p className='texto-suave mb-3'>Agregá productos al carrito y volvé acá.</p>
          <Link to='/catalogo' className='btn btn-warning'>
            Ir al catálogo
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className='contenedor pagina'>
      <h1 className='titulo-pagina'>Finalizar compra</h1>
      <form className={validado ? 'was-validated' : ''} noValidate onSubmit={handleSubmit}>
        <div className='compra'>
          <div className='d-grid gap-4'>
            <section className='panel' aria-labelledby='titulo-envio'>
              <h2 id='titulo-envio' className='fs-4 fw-bold mb-4'>
                1. Datos de envío
              </h2>
              <div className='row g-3'>
                {campo('nombre', 'Nombre', { required: true, autoComplete: 'given-name' })}
                {campo('apellido', 'Apellido', { required: true, autoComplete: 'family-name' })}
                {campo('email', 'Correo electrónico', {
                  type: 'email',
                  placeholder: 'nombre@ejemplo.com',
                  required: true,
                  autoComplete: 'email',
                })}
                {campo('telefono', 'Teléfono o celular', {
                  type: 'tel',
                  placeholder: '388-1234567',
                  required: true,
                  autoComplete: 'tel',
                })}
                {campo(
                  'direccion',
                  'Dirección (calle y número)',
                  { placeholder: 'Av. Fascio 100', required: true, autoComplete: 'street-address' },
                  'col-12 col-sm-8',
                )}
                {campo('piso', 'Piso / Dpto (opcional)', {}, 'col-12 col-sm-4')}
                {campo(
                  'ciudad',
                  'Ciudad',
                  { placeholder: 'San Salvador de Jujuy', required: true },
                  'col-12 col-sm-5',
                )}
                <div className='col-12 col-sm-4'>
                  <label htmlFor='provincia' className='form-label'>
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
                  'Código postal',
                  { placeholder: '4600', required: true, autoComplete: 'postal-code' },
                  'col-12 col-sm-3',
                )}
              </div>
            </section>

            <section className='panel' aria-labelledby='titulo-pago'>
              <h2 id='titulo-pago' className='fs-4 fw-bold mb-4'>
                2. Método de pago
              </h2>
              {[
                ['mercadopago', 'Mercado Pago o tarjeta de crédito y débito'],
                ['transferencia', 'Transferencia bancaria'],
              ].map(([valor, etiqueta]) => (
                <label className='metodo-pago fw-bold' htmlFor={valor} key={valor}>
                  <input
                    id={valor}
                    name='metodoPago'
                    type='radio'
                    className='form-check-input'
                    value={valor}
                    checked={form.metodoPago === valor}
                    onChange={handleChange}
                  />
                  {etiqueta}
                </label>
              ))}
              <p className='chico texto-suave mb-0'>
                Compra de demostración: no se cobra ni se envía nada.
              </p>
            </section>
          </div>

          <aside className='panel-negro resumen' aria-labelledby='titulo-pedido'>
            <h2 id='titulo-pedido' className='fs-4 fw-bold mb-4'>
              Tu pedido
            </h2>
            <ul className='list-unstyled mb-0'>
              {items.map(item => (
                <li key={item.id} className='d-flex justify-content-between gap-3 mb-3'>
                  <div className='d-flex align-items-center gap-3'>
                    <img
                      src={getImageUrl(item)}
                      alt=''
                      className='rounded-circle object-fit-cover'
                      style={{ width: 48, height: 48 }}
                    />
                    <div>
                      <h3 className='fs-6 fw-bold my-0'>{item.name}</h3>
                      <span className='chico' style={{ color: 'var(--crema-hundida)' }}>
                        Cantidad: {item.cantidad}
                      </span>
                    </div>
                  </div>
                  <span className='precio text-nowrap'>
                    {formatPrice(item.price * item.cantidad)}
                  </span>
                </li>
              ))}
            </ul>
            <div className='resumen-total'>
              <span className='fw-bold'>Total</span>
              <strong className='precio'>{formatPrice(total)}</strong>
            </div>
            <p className='chico mb-4' style={{ color: 'var(--crema-hundida)' }}>
              Envío gratis en Jujuy.
            </p>
            <button className='btn btn-warning w-100' type='submit'>
              Confirmar y pagar
            </button>
            <Link to='/carrito' className='d-block text-center mt-3 link-subrayado'>
              Volver al carrito
            </Link>
          </aside>
        </div>
      </form>
    </div>
  );
}
