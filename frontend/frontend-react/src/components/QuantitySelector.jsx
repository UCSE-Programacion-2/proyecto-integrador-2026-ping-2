import PropTypes from 'prop-types';

const Trazo = ({ d }) => (
  <svg
    viewBox='0 0 24 24'
    width='18'
    height='18'
    fill='none'
    stroke='currentColor'
    strokeWidth='2.2'
    strokeLinecap='round'
    aria-hidden='true'
  >
    <path d={d} />
  </svg>
);

Trazo.propTypes = { d: PropTypes.string.isRequired };

export default function QuantitySelector({ cantidad, maximo, onChange }) {
  return (
    <div className='cantidad' role='group' aria-label='Cantidad'>
      <button
        type='button'
        aria-label='Restar uno'
        disabled={cantidad <= 1}
        onClick={() => onChange(cantidad - 1)}
      >
        <Trazo d='M5 12h14' />
      </button>
      <output aria-live='polite'>{cantidad}</output>
      <button
        type='button'
        aria-label='Sumar uno'
        disabled={Boolean(maximo) && cantidad >= maximo}
        onClick={() => onChange(cantidad + 1)}
      >
        <Trazo d='M5 12h14M12 5v14' />
      </button>
    </div>
  );
}

QuantitySelector.propTypes = {
  cantidad: PropTypes.number.isRequired,
  maximo: PropTypes.number,
  onChange: PropTypes.func.isRequired,
};
