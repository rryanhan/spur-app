import React, { useState } from 'react';
import { loginUser } from '../../api';
import spurlogo from "../../assets/Spur_Logo.png";

import { useNavigate } from 'react-router-dom';

import './authentication.css';

const Login = ({ setActive }) => {
    // State and navigation setup
    const [form, setForm] = useState({ email: '', password: '' });
    const navigate = useNavigate();
    const [error, setError] = useState('');
  
    // Handle input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setForm({ ...form, [name]: value });
    };
  
    // Handle form submission
    const handleLogin = async (e) => {
      e.preventDefault();
      try {
        const response = await loginUser(form);
        if (response.success) {
          alert('Login successful!');
          sessionStorage.setItem("user", response.token);
          navigate("/profile");
        } else {
          setError(response.message || 'Error logging in');
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
              <input onChange={handleChange} className="input-field" type="email" placeholder="Email" value={form.email} name="email" required />
              <input onChange={handleChange} className="input-field" type="password" placeholder="Password" value={form.password} name="password" required />
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