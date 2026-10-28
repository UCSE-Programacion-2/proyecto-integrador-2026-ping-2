import PropTypes from 'prop-types';

// El cartel redondo del local: disco negro con TECNO X en relieve
export default function Cartel({ className = '', lema = true }) {
  return (
    <div className={`cartel ${className}`} aria-hidden='true'>
      <span className='cartel-nombre marca'>Tecno X</span>
      <span className='cartel-raya' />
      {lema && <span className='cartel-lema'>Tu tienda de confianza</span>}
    </div>
  );
}

Cartel.propTypes = {
  className: PropTypes.string,
  lema: PropTypes.bool,
};
