import { useState } from 'react';
import './Auth.css';
import { register } from '../State/Auth/Action';
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({ firstName: '', lastName: '', email: '', password: '', role: 'USER', gender: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value });

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsLoading(true);

    const userData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      gender: formData.gender
    };

    const result = await dispatch(register(userData));
    setIsLoading(false);

    if (result?.success) {
      navigate('/dashboard');
      return;
    }

    setError(result?.error || 'Registration failed. Please try again.');
  };

  return (
    <main className="auth-page">
      <section className="auth-intro">
        <div className="brand-mark" aria-hidden="true">@</div>
        <p className="eyebrow">Social network</p>
        <h1>Join your online community.</h1>
        <p className="intro-copy">Create an account, connect with friends, share updates, and stay close to the people who matter most.</p>
      </section>
      <section className="auth-panel" aria-labelledby="register-title">
        <div className="panel-topline"><span>Create your account</span><span className="secure-label">Safe & private</span></div>
        <div className="form-heading">
          <h2 id="register-title">Sign up today</h2>
          <p>Tell us a little about yourself and start connecting.</p>
        </div>
        <form className="auth-form register-form" onSubmit={handleSubmit}>
          <div className="name-fields"><div><label htmlFor="first-name">First name</label><input id="first-name" name="firstName" type="text" value={formData.firstName} onChange={handleChange} placeholder="Jane" autoComplete="given-name" required /></div><div><label htmlFor="last-name">Last name</label><input id="last-name" name="lastName" type="text" value={formData.lastName} onChange={handleChange} placeholder="Doe" autoComplete="family-name" required /></div></div>
          <label htmlFor="register-email">Email address</label>
          <input id="register-email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" autoComplete="email" required />
          <label htmlFor="register-password">Password</label>
          <input id="register-password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Create a password" autoComplete="new-password" required />
          <label htmlFor="gender">Gender</label>
          <select id="gender" name="gender" value={formData.gender} onChange={handleChange} required>
            <option value="">Select gender</option>
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
            <option value="OTHER">OTHER</option>
          </select>
          <label htmlFor="role">I am registering as</label>
          <select id="role" name="role" value={formData.role} onChange={handleChange} required>
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
          </select>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="primary-button" type="submit" disabled={isLoading}>{isLoading ? 'Creating profile...' : 'Create account'} <span aria-hidden="true">→</span></button>
        </form>
        <p className="switch-prompt">Already have an account? <a className="switch-button" href="/login">Log in</a></p>
      </section>
    </main>
  );
}

export default Register;
