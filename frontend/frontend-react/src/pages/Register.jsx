import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { registerUser } from '../services/api';

const EMAIL_VALIDO = /^\S+@\S+\.\S+$/;

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '', confirmar: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Tras registrarse, redirige al login después de mostrar el mensaje
  useEffect(() => {
    if (!success) return undefined;
    const timer = setTimeout(() => navigate('/login'), 1500);
    return () => clearTimeout(timer);
  }, [success, navigate]);

  const handleChange = event => {
    const { name, value } = event.target;
    setForm(actual => ({ ...actual, [name]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const email = form.email.trim();

    if (!EMAIL_VALIDO.test(email)) return setError('Ingresá un email válido.');
    if (form.password.length < 8) {
      return setError('La contraseña debe tener al menos 8 caracteres.');
    }
    if (form.password !== form.confirmar) return setError('Las contraseñas no coinciden.');

    setSubmitting(true);
    setError('');
    try {
      await registerUser(email, form.password);
      setSuccess('Usuario creado con éxito. Redirigiendo al login...');
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
    return undefined;
  };

  return (
    <AuthForm
      title='Crear cuenta'
      error={error}
      success={success}
      submitting={submitting}
      submitLabel='Registrarme'
      onSubmit={handleSubmit}
    >
      {[
        ['email', 'Correo electrónico', 'email', 'email'],
        ['password', 'Contraseña (mínimo 8 caracteres)', 'password', 'new-password'],
        ['confirmar', 'Confirmar contraseña', 'password', 'new-password'],
      ].map(([name, label, type, autoComplete]) => (
        <div className='mb-3' key={name}>
          <label htmlFor={name} className='form-label'>
            {label}
          </label>
          <input
            id={name}
            name={name}
            type={type}
            className='form-control'
            autoComplete={autoComplete}
            value={form[name]}
            onChange={handleChange}
          />
        </div>
      ))}
      <p className='small text-center'>
        ¿Ya tenés cuenta? <Link to='/login'>Ingresá</Link>
      </p>
    </AuthForm>
  );
}
