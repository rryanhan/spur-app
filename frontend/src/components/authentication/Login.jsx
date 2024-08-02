import React, { useState } from 'react';
import { loginUser } from '../../api';
import spurlogo from "../../assets/Spur_Logo.png";
import './authentication.css';

const Login = ({ setActive }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser(form);
      if (response.status === 200) {
        alert('Login successful!');
        localStorage.setItem('userId', response.data.userId); // Store user ID in local storage
        // Redirect or update UI as needed
      } else {
        setError(response.data.message || 'Error logging in');
      }
    } catch (err) {
      console.error('Error logging in:', err);
      setError('An error occurred while logging in.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img className="spur-title" src={spurlogo} alt="Spur Logo" />
        <p className="login-text">
          Don't have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setActive('signup'); }} className="signup-link">
            Sign up!
          </a>
        </p>
        <form onSubmit={handleLogin}>
          <div className="fillout__boxes">
            <input 
              onChange={handleChange}
              className="input-field" 
              type="email" 
              placeholder="Email" 
              value={form.email} 
              name="email"
              required
            />
            <input 
              onChange={handleChange}
              className="input-field" 
              type="password" 
              placeholder="Password"
              value={form.password}
              name="password"
              required
            />
          </div>
          {error && <p className="error">{error}</p>}
          <div className="signin__button">
            <button type="submit" className="submit-button">Log in!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
