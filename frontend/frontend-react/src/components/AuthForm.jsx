import PropTypes from 'prop-types';
import Cartel from './Cartel';

// Estructura visual compartida por Login y Registro: el cartel del local y el formulario
export default function AuthForm({
  title,
  error,
  success,
  submitting,
  submitLabel,
  onSubmit,
  children,
}) {
  return (
    <div className='contenedor pagina acceso'>
      <Cartel />
      <div className='panel'>
        <h1 className='titulo-pagina'>{title}</h1>
        <form onSubmit={onSubmit} noValidate>
          {children}
          {error && (
            <div className='alert alert-danger' role='alert'>
              {error}
            </div>
          )}
          {success && (
            <div className='alert alert-success' role='alert'>
              {success}
            </div>
          )}
          <button type='submit' className='btn btn-warning w-100' disabled={submitting}>
            {submitting ? 'Enviando...' : submitLabel}
          </button>
        </form>
      </div>
    </div>
  );
}

AuthForm.propTypes = {
  title: PropTypes.string.isRequired,
  error: PropTypes.string,
  success: PropTypes.string,
  submitting: PropTypes.bool.isRequired,
  submitLabel: PropTypes.string.isRequired,
  onSubmit: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired,
};
