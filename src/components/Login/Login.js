import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";
import { validateInputs } from '../utils/validation';

function Login() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    if (validateInputs(login, password, setErrorMessage)) {
      try {
        const response = await fetch('http://localhost:5000/users/authenticate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ login, password }),
        });

        if (response.ok) {
          await response.json();
          navigate('/chat');
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.error);
        }
      } catch (error) {
        console.error('Erro ao autenticar:', error);
        setErrorMessage('Erro ao autenticar o usuário.');
      }
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
        {errorMessage && <p data-testid="error-message" className="error-message">{errorMessage}</p>}
        <button className="login-button" onClick={handleLogin}>Next</button>
      </div>
    </div>
  );
}

export default Login;
