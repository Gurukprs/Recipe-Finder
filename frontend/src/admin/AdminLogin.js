import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './login.css';

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('https://recipe-finder-zu80.onrender.com/admin/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dash');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Server error');
    }
    setLoading(false);
  };

  return (
    <div style={{ backgroundColor: '#2a2d34', minHeight: '100vh', padding: '20px' }}>
      <div className="login-container">
      <h2 style={{ color: '#e43f5a', textAlign: 'center', fontSize: '2rem' }}>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit" disabled={loading}>
            {loading ? 'Logging In...' : 'Log In'}
          </button>
        </form>
        {message && <p>{message}</p>}
        <p className="signup-link">
          Don't have an account? <a href="/admin/signup">Sign up here</a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
