import React, { useState } from 'react';
import './Create.css';
import { useNavigate } from "react-router-dom";
import { validateInputs, validateInputsType } from '../utils/validation';

function Create() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3000); // Toast will disappear after 3 seconds
  };

  const hideToastMessage = () => {
    setShowToast(false);
  };
  
  const handleCreate = async () => {
    if (validateInputs(login, password, setErrorMessage) && validateInputsType(password, setErrorMessage)) {
      try {
        const response = await fetch('http://localhost:5000/users', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ login: login, password: password, type: 'user' })
        });
        if (response.ok) {
          showToastMessage('User created successfully!');
        } else {
          showToastMessage('Error creating user!');
        }
      } catch (error) {
        showToastMessage('Error creating user!');
        console.error('Error creating user:', error);
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

  const handleBackNewUser = () => {
    navigate('/newuser');
  };

  return (
    <div className="create-page">
      <div className="create-container">
        <h2 className="create-title">Create<br /></h2>
        <input 
          type="text" 
          placeholder="Login" 
          className="login-newuser-input" 
          value={login} 
          onChange={(e) => {
            setLogin(e.target.value);
            handleLoginChange(e); 
          }} 
        />
        <input 
          type="password" 
          placeholder="Password" 
          className="password-newuser-input" 
          value={password} 
          onChange={(e) => {
            setPassword(e.target.value);
            handlePasswordChange(e);
          }}  
        />
        
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <button className="create-newuser-button" onClick={handleCreate}>Create User</button>
        <button className="back-create-button" onClick={handleBackNewUser}>Back</button>

        {showToast && (
          <div className="toast">
            <p>{toastMessage}</p>
            <button onClick={hideToastMessage}>Close</button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Create;
