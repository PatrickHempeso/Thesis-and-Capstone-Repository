import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AppHeader from '../components/AppHeader';
import '../assets/design.css';
import axios from '../axiosConfig'; // ✅ use your custom axios instance

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState(''); // ← Added loginError state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Clean guest mode only
    localStorage.removeItem('guestMode');
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Please enter a valid email address';

    if (!formData.password) newErrors.password = 'Password is required';
    else if (formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit fired', formData);
    if (!validateForm()) return;

    setIsSubmitting(true);
    setLoginError(''); // ← Clear previous login errors
    localStorage.clear();

    try {
      // 1️⃣ Get CSRF cookie from Laravel
      await axios.get('/sanctum/csrf-cookie'); // withCredentials already in axiosConfig

      // 2️⃣ Then login
      const response = await axios.post('/api/login', {
        email: formData.email,
        password: formData.password,
      });

      const { user, role, token } = response.data;

      // Store login info
      localStorage.setItem('authToken', token);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userProfile', JSON.stringify(user));

      // Navigate based on role
      if (role === 'student') navigate('/dashboard/student');
      else navigate('/dashboard/faculty');
    } catch (error) {
      console.error(error.response);
      setLoginError(error.response?.data?.message || 'Login failed.'); // ← Set error message
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="app-container">
      <AppHeader title="LOGIN" />
      <div className="app-body">
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email" style={{ color: 'black' }}>Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="password" style={{ color: 'black' }}>Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Display backend login error */}
          {loginError && <div className="error-message" style={{ marginBottom: '10px' }}>{loginError}</div>}

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
              style={{ textAlign: isSubmitting ? 'left' : 'center' }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
            <Link to="/" className="btn btn-secondary">Back</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;