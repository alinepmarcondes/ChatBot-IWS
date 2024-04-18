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
      <h2 className="edit-title">Edit<br />a User</h2>
      <input type="text" placeholder=" ID User " className="edit-id-user-input" />
      <input type="text" placeholder=" Login " className="edit-login-input" />
      <input type="password" placeholder=" Password " className="edit-password-input" />
      <button className="edit-button" onClick={handleEdit}>Update</button>
      <button className="back-edit-button" onClick={handleEdit}>Back</button>
      <button className="delete-button" onClick={handleEdit}>Delete</button>
    </div>
  );
}

export default Edit;
