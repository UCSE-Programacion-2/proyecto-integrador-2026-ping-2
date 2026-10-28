import { Link } from 'react-router-dom';
import Cartel from '../components/Cartel';

export default function NotFound() {
  return (
    <div className='contenedor pagina'>
      <div className='vacio'>
        <Cartel lema={false} />
        <h1 className='titulo-pagina mb-0'>Esta página no existe</h1>
        <p className='texto-suave mb-3'>Puede que el link esté mal o que el producto ya no esté.</p>
        <Link to='/' className='btn btn-warning'>
          Volver al inicio
        </Link>
      </div>
    </div>
  );
}
