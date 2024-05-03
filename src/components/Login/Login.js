import React from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/chat');
  };

  return (
  <div class="login-page">
    <div class="login-container">
      <h2 class="login-title">Enter your<br />account</h2>
      <input type="text" placeholder="Login" class="login-input" />
      <input type="password" placeholder="Password" class="password-input" />
      <button class="login-button" onClick={handleLogin}>Next</button>
    </div>
  </div>
  );
}

export default Login;
