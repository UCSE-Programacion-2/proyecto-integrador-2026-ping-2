import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Al navegar a otra ruta la SPA no recarga: volvemos arriba manualmente
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
