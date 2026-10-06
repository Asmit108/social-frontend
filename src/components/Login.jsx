import { useState } from 'react';
import './Auth.css';
import { login } from '../State/Auth/Action';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const authState = useSelector((state) => state.auth);
  const error = authState.error;
  const isLoading = authState.isLoading;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.email === '' || formData.password === '') {
      return;
    }

    const userData = {
      email: formData.email,
      password: formData.password
    };

    const result = await dispatch(login(userData));

    if (result?.success) {
      navigate('/dashboard');
      return;
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="brand-mark" aria-hidden="true">+</div>
        <p className="eyebrow">Care, connected</p>
        <h1>Your health, in good hands.</h1>
        <p className="intro-copy">A calmer way to manage your care, appointments, and conversations with your health team.</p>
      </section>
      <section className="auth-panel" aria-labelledby="login-title">
        <div className="panel-topline"><span>Welcome back</span><span className="secure-label">Secure access</span></div>
        <div className="form-heading">
          <h2 id="login-title">Sign in to continue</h2>
          <p>Enter your details to access your health space.</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="login-email">Email address</label>
          <input id="login-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
          <label htmlFor="login-password">Password</label>
          <input id="login-password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" autoComplete="current-password" required />
          {error != null && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={isLoading}>{isLoading == true ? 'Signing in...' : 'Log in'} <span aria-hidden="true">→</span></button>
        </form>
        <p className="switch-prompt">New to Careline? <a className="switch-button" href="/register">Register</a></p>
      </section>
    </main>
  );
}

export default Login;
