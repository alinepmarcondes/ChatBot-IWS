import React from 'react';
import './Edit.css';
import { useNavigate } from "react-router-dom";

function Edit() {
  const navigate = useNavigate();

  const handleEdit = () => {
    navigate('/newuser');
  };

  return (
    <div className="edit-page">
      <h2 className="edit-title">Edit<br />  </h2>
      <input type="text" placeholder=" New Login " className="edit-login-input" />
      <input type="password" placeholder=" New Password " className="edit-password-input" />
      <button className="edit-button" onClick={handleEdit}>Update</button>
      <button className="delete-button" onClick={handleEdit}>Delete</button>
      <button className="back-edit-button" onClick={handleEdit}>Back</button>
    </div>
  );
}

export default Edit;
