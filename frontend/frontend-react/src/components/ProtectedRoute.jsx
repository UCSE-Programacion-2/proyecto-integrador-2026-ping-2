import PropTypes from 'prop-types';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Sin sesión redirige al login; con requireAdmin además exige rol de administrador
export default function ProtectedRoute({ requireAdmin = false }) {
  const { isLoggedIn, isAdmin } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) return <Navigate to='/login' replace state={{ from: location.pathname }} />;
  if (requireAdmin && !isAdmin) return <Navigate to='/' replace />;

  return <Outlet />;
}

ProtectedRoute.propTypes = { requireAdmin: PropTypes.bool };
