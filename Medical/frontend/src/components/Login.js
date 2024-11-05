import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom'; // Import useNavigate
import { loginUser } from '../Actions/userActions';
import '../styles/login.css';

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user'); // State for role selection
  const [errorMessage, setErrorMessage] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  const handleLogin = async (e) => {
    e.preventDefault();
    
    const result = await dispatch(loginUser(email, password, role));
    
    if (result.success) {
      const userData = { email: result.email, name: result.name, id: result.id, role }; // Include role
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', result.token);
      onLogin(userData);
      
      // Redirect based on role
      if (role === 'doctor') {
        navigate('/doctor'); // Navigate to doctor interface
      } else {
        navigate('/'); // Navigate to home for users
      }
    } else {
      setErrorMessage(result.message || 'Login failed. Please check your email and password.');
    }
  };
  
  return (
    <div className="login-container">
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <label>
          Email:
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password:
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <label>
          Role:
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
          </select>
        </label>
        <button type="submit">Login</button>
      </form>
      {errorMessage && <div className="error-message">{errorMessage}</div>}
      <div className="login-options">
        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
