import PropTypes from 'prop-types';

export default function QuantitySelector({ cantidad, onChange }) {
  return (
    <div
      className='input-group input-group-sm justify-content-center flex-nowrap'
      style={{ width: 110 }}
    >
      <button
        className='btn btn-outline-secondary'
        type='button'
        aria-label='Restar'
        onClick={() => onChange(cantidad - 1)}
      >
        -
      </button>
      <span className='input-group-text bg-white fw-semibold'>{cantidad}</span>
      <button
        className='btn btn-outline-secondary'
        type='button'
        aria-label='Sumar'
        onClick={() => onChange(cantidad + 1)}
      >
        +
      </button>
    </div>
  );
}

QuantitySelector.propTypes = {
  cantidad: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
};
