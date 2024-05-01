// frontend/src/components/Create/Create.js
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
      console.log('Trying to create user...');

      const newUser = { login, password };
      console.log('New user data:', newUser);

      // Enviar requisição para o backend
      const response = await axios.post('http://localhost:5000/users', newUser);

      console.log('Response from server:', response);

      // Verifica o código de status da resposta
      if (response.status === 201) {
        console.log('User created successfully:', response.data);
        // Redireciona ou executa outras ações necessárias após a criação do usuário
        navigate('/newuser');
      } else {
        console.error('Failed to create user:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  const handleBackNewUser = () => {
    navigate('/newuser');
  };

  return (
    <div className="create-page">
      <h2 className="create-title">Create<br />  </h2>
      <input type="text" placeholder=" Login " className="login-newuser-input" value={login} onChange={(e) => setLogin(e.target.value)} />
      <input type="password" placeholder=" Password " className="password-newuser-input" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="create-newuser-button" onClick={handleCreate}>Create</button>
      <button className="back-create-button" onClick={handleBackNewUser}>Back</button>
    </div>
  );
}

export default Create;
