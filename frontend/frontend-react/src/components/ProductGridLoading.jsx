import PropTypes from 'prop-types';

// Tarjetas vacías con la forma de ProductCard mientras llega el catálogo
export default function ProductGridLoading({ cantidad, lento }) {
  return (
    <>
      {lento && (
        <p className='aviso-carga w-100' role='status'>
          Estamos despertando el servidor. La primera carga puede tardar hasta un minuto.
        </p>
      )}
      {Array.from({ length: cantidad }, (_, i) => (
        <div className='col' key={i} aria-hidden='true'>
          <div className='esqueleto' style={{ aspectRatio: '3 / 4' }} />
          <div className='esqueleto mt-3' style={{ height: 14, width: '40%' }} />
          <div className='esqueleto mt-2' style={{ height: 18, width: '80%' }} />
          <div className='esqueleto mt-3' style={{ height: 40, width: '100%' }} />
        </div>
      ))}
      {!lento && (
        <span className='visually-hidden' role='status'>
          Cargando productos...
        </span>
      )}
    </>
  );
}

ProductGridLoading.propTypes = {
  cantidad: PropTypes.number.isRequired,
  lento: PropTypes.bool.isRequired,
};
