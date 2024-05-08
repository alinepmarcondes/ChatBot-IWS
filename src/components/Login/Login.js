import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (!login.trim() || !password.trim()) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    navigate('/chat');
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 className="login-title">Enter your<br />account</h2>
        <input 
          type="text" 
          placeholder="Login" 
          className="login-input" 
          value={login} 
          onChange={(e) => setLogin(e.target.value)} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="password-input" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="login-button" onClick={handleLogin}>Next</button>
      </div>
    </div>
  );
}

export default Login;
