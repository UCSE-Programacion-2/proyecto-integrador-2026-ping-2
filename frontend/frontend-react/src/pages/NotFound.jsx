import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className='text-center py-5'>
      <h1 className='display-1 fw-bold'>404</h1>
      <p className='fs-5 text-muted'>La página que buscás no existe.</p>
      <Link to='/' className='btn btn-warning fw-bold text-uppercase'>
        Volver al inicio
      </Link>
    </div>
  );
}
