import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { TOKEN_KEY, loginUser } from '../services/api';

const USER_KEY = 'user';

const AuthContext = createContext(null);

// Lee el payload del JWT para saber cuándo vence (la validación real la hace el backend)
const tokenVencido = token => {
  try {
    const { exp } = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return exp * 1000 < Date.now();
  } catch {
    return true;
  }
};

const leerSesion = () => {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const user = JSON.parse(localStorage.getItem(USER_KEY));
    if (token && user && !tokenVencido(token)) return user;
  } catch {
    // sesión corrupta: se descarta
  }
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  return null;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(leerSesion);

  const login = useCallback(async (email, password) => {
    const { token, user: datos } = await loginUser(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(datos));
    setUser(datos);
    return datos;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, isLoggedIn: Boolean(user), isAdmin: user?.role === 'admin', login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node.isRequired };

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  return context;
};
