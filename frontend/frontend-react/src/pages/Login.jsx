import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isLoggedIn) return <Navigate to='/' replace />;

  const handleSubmit = async event => {
    event.preventDefault();
    if (!email.trim() || !password) {
      setError('Completá email y contraseña.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await login(email.trim(), password);
      navigate(location.state?.from || '/', { replace: true });
    } catch (err) {
      setError(err.message);
      setSubmitting(false);
    }
  };

  return (
    <AuthForm
      title='Iniciar sesión'
      error={error}
      submitting={submitting}
      submitLabel='Ingresar'
      onSubmit={handleSubmit}
    >
      <div className='mb-3'>
        <label htmlFor='email' className='form-label small fw-semibold text-secondary'>
          Correo electrónico
        </label>
        <input
          id='email'
          type='email'
          className='form-control'
          autoComplete='email'
          value={email}
          onChange={event => setEmail(event.target.value)}
        />
      </div>
      <div className='mb-3'>
        <label htmlFor='password' className='form-label small fw-semibold text-secondary'>
          Contraseña
        </label>
        <input
          id='password'
          type='password'
          className='form-control'
          autoComplete='current-password'
          value={password}
          onChange={event => setPassword(event.target.value)}
        />
      </div>
      <p className='small text-center'>
        ¿No tenés cuenta? <Link to='/registro'>Registrate</Link>
      </p>
    </AuthForm>
  );
}
