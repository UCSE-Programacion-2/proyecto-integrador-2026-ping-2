import PropTypes from 'prop-types';

// Estructura visual compartida por Login y Registro
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
    <div className='row justify-content-center'>
      <div className='col-12 col-md-8 col-lg-5'>
        <div className='card border-0 shadow-sm rounded-4 p-4 bg-white'>
          <h1 className='h3 fw-bold text-uppercase mb-4 text-center'>{title}</h1>
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
            <button
              type='submit'
              className='btn btn-warning w-100 fw-bold text-uppercase py-2'
              disabled={submitting}
            >
              {submitting ? 'Enviando...' : submitLabel}
            </button>
          </form>
        </div>
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
