import React from 'react';
import './Login.css';
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/chat');
  };

  return (
    <div className="login-page">
      <h2 className="login-title">Enter your<br />account</h2>
      <input type="text" placeholder="Login" className="login-input" />
      <input type="password" placeholder="Password" className="password-input" />
      <button className="login-button" onClick={handleLogin}>Next</button>
    </div>
  );
}

export default Login;
