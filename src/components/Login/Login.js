import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { validateInputs } from './utils/validation';

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = () => {
    if (validateInputs(login, password, setErrorMessage)) {
      navigate('/chat');
    }
  };

  const handleLoginChange = (e) => {
    setLogin(e.target.value);
    setErrorMessage('');
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage('');
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
          onChange={handleLoginChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="password-input"
          value={password}
          onChange={handlePasswordChange}
        />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="login-button" onClick={handleLogin}>Next</button>
      </div>
    </div>
  );
}

export default Login;
