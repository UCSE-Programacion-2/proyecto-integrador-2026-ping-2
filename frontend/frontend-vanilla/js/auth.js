// Autenticación: login y manejo de la sesión (token en localStorage)
import { loginUser } from './api.js';

const mensaje = document.getElementById('mensaje-auth');
const formLogin = document.getElementById('form-login');

export const guardarSesion = (token, email) => {
  localStorage.setItem('token', token);
  localStorage.setItem('userEmail', email);
};

export const cerrarSesion = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('userEmail');
};

export const estaLogueado = () => Boolean(localStorage.getItem('token'));

const mostrarMensaje = (texto, tipo = 'danger') => {
  mensaje.textContent = texto;
  mensaje.className = `alert alert-${tipo}`;
};

const bloquearBoton = (form, bloqueado) => {
  form.querySelector('button[type="submit"]').disabled = bloqueado;
};

if (formLogin) {
  formLogin.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = formLogin.email.value.trim();
    const password = formLogin.password.value;

    if (!email || !password) {
      mostrarMensaje('Completá email y contraseña.');
      return;
    }

    bloquearBoton(formLogin, true);
    try {
      const { token } = await loginUser(email, password);
      guardarSesion(token, email);
      mostrarMensaje('¡Bienvenido! Redirigiendo...', 'success');
      setTimeout(() => {
        window.location.href = '../index.html';
      }, 1000);
    } catch (error) {
      mostrarMensaje(error.message);
      bloquearBoton(formLogin, false);
    }
  });
}
