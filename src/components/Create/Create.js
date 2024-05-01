import React, { useState } from 'react';
import './Create.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

function Create() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const handleCreate = async () => {
    try {
      await axios.post('http://localhost:5000/users', { login: login, password: password, type: 'user' });
      console.log('Usuário criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
    } 
  };

  const handleBackNewUser = () => {
    navigate('/newuser');
  };

  return (
    <div className="create-page">
      <h2 className="create-title">Create<br />  </h2>
      <input type="text" placeholder=" Login " className="login-newuser-input" value={login} onChange={(e) => setLogin(e.target.value)} />
      <input type="password" placeholder=" Password " className="password-newuser-input" value={password} onChange={(e) => setPassword(e.target.value)}  />
      <button className="create-newuser-button" onClick={handleCreate}>Create</button>
      <button className="back-create-button" onClick={handleBackNewUser}>Back</button>
    </div>
  );
}

export default Create;
