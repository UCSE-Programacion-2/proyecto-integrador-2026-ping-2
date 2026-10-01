// Autenticación: registro, login y manejo de la sesión (token en localStorage)
import { loginUser, registerUser } from './api.js';

const mensaje = document.getElementById('mensaje-auth');
const formLogin = document.getElementById('form-login');
const formRegistro = document.getElementById('form-registro');

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

const EMAIL_VALIDO = /^\S+@\S+\.\S+$/;

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

if (formRegistro) {
  formRegistro.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = formRegistro.email.value.trim();
    const password = formRegistro.password.value;
    const confirmar = formRegistro['confirmar-password'].value;

    if (!EMAIL_VALIDO.test(email)) {
      mostrarMensaje('Ingresá un email válido.');
      return;
    }
    if (password.length < 8) {
      mostrarMensaje('La contraseña debe tener al menos 8 caracteres.');
      return;
    }
    if (password !== confirmar) {
      mostrarMensaje('Las contraseñas no coinciden.');
      return;
    }

    bloquearBoton(formRegistro, true);
    try {
      await registerUser(email, password);
      mostrarMensaje('Usuario creado con éxito. Redirigiendo al login...', 'success');
      formRegistro.reset();
      setTimeout(() => {
        window.location.href = './login.html';
      }, 1500);
    } catch (error) {
      mostrarMensaje(error.message);
      bloquearBoton(formRegistro, false);
    }
  });
}
