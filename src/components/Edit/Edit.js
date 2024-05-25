import React, { useState } from 'react';
import './Edit.css';
import { useNavigate } from "react-router-dom";
import { validateInputs, validateInputsType } from '../utils/validation';

function Edit() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEdit = () => {
    if (validateInputs(login, password, setErrorMessage) && validateInputsType(password, setErrorMessage)) {
      navigate('/newuser');
    } 
  };

  const handleBack = () => {
    navigate('/newuser'); 
  };

  const handleNewLoginChange = (e) => {
    setLogin(e.target.value);
    setErrorMessage('');
  };

  const handleNewPasswordChange = (e) => {
    setPassword(e.target.value);
    setErrorMessage('');
  };

  return (
    <div className="edit-page">
      <div className="create-container">
        <h2 className="edit-title">Edit<br /></h2>
        <input 
          type="text" 
          placeholder="New Login" 
          className="edit-login-input" 
          data-testid="login-input"
          onChange={handleNewLoginChange}
        />
        <input 
          type="password" 
          placeholder="New Password" 
          className="edit-password-input" 
          data-testid="password-input"
          onChange={handleNewPasswordChange}
        />
        {errorMessage && <p data-testid="error-message" className="error-message">{errorMessage}</p>}
        <button className="edit-button" onClick={handleEdit}>Update</button>
        <button className="delete-button" onClick={handleEdit}>Delete</button>
        <button className="back-edit-button" onClick={handleBack}>Back</button>
      </div>
    </div>
  );
}

export default Edit;
