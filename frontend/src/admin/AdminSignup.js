import React, { useState } from 'react';
import axios from 'axios';
import './signup.css'; // Import the CSS file

const AdminSignup = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const res = await axios.post('https://recipe-finder-1-3g5t.onrender.com/admin/signup', formData);
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Server error');
    }
  };

  return (
    <div className="signup-container">
      <h2>Admin Signup</h2>
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
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
      <p className="login-link">
        Already have an account? <a href="/admin">Log in here</a>
      </p>
    </div>
  );
};

export default AdminSignup;
