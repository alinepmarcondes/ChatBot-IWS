import React, { useState } from 'react';
import './Edit.css';
import { useNavigate } from "react-router-dom";
import { validateInputs } from '../utils/validation';

function Edit() {
  const navigate = useNavigate();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleEdit = () => {
    if (validateInputs(login, password, setErrorMessage)) {
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
      <h2 className="edit-title">Edit<br />  </h2>
      <input 
        type="text" 
        placeholder=" New Login " 
        className="edit-login-input" 
        onChange={handleNewLoginChange}
      />
      <input 
        type="password" 
        placeholder=" New Password " 
        className="edit-password-input" 
        onChange={handleNewPasswordChange}
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button className="edit-button" onClick={handleEdit}>Update</button>
      <button className="delete-button" onClick={handleEdit}>Delete</button>
      <button className="back-edit-button" onClick={handleBack}>Back</button>
    </div>
  );
}

export default Edit;