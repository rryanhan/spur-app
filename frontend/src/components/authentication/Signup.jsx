import React, { useState } from 'react';
import { createUser } from '../../api';
import spurlogo from "../../assets/Spur_Logo.png";
import './authentication.css';
import { useNavigate } from 'react-router-dom';

const Signup = ({ setActive }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const response = await createUser(form);
      if (response.status === 201) {
        alert('User created successfully!');
        sessionStorage.setItem("user", response.data.token); // Store the token
        const storedToken = sessionStorage.getItem("user");
        console.log(storedToken);
        navigate("/profile"); // Redirect to profile page
      } else {
        setError(response.data.message || 'Error creating user');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An error occurred while creating the account.');
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <img className="spur-title" src={spurlogo} alt="Spur Logo" />
        <p className="login-text">
          Have an account?{' '}
          <a href="#" onClick={(e) => { e.preventDefault(); setActive('login'); }} className="login-link">
            Log in!
          </a>
        </p>
        <form onSubmit={handleSignup}>
          <div className="fillout__boxes">
            <input 
              onChange={handleChange}
              className="input-field" 
              type="text" 
              placeholder="Name/Organization" 
              value={form.name}
              name="name"
              required
              maxLength={20}
            />
            <input 
              onChange={handleChange}
              className="input-field" 
              type="email" 
              placeholder="Email" 
              value={form.email} 
              name="email"
              required
              maxLength={30}
            />
            <div className="password-container">
              <input
                onChange={handleChange}
                className="input-field"
                type={passwordVisible ? "text" : "password"} // Use the passwordVisible state
                placeholder="Password"
                value={form.password}
                name="password"
                required
                maxLength={20}
              />
              <button
                type="button"
                className="toggle-password"
                onClick={togglePasswordVisibility}
              >
                {passwordVisible ? "Hide" : "Show"}
              </button>
            </div>
          </div>
          {error && <p className="error">{error}</p>}
          <div className="signin__button">
            <button type="submit" className="submit-button">Sign Up!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
