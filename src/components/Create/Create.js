import React from 'react';
import './Create.css';
import { useNavigate } from "react-router-dom";

function Create() {
  const navigate = useNavigate();

  const handleCreate = () => {
    navigate('/newuser');
  };

  const handleBackNewUser = () => {
    navigate('/newuser');
  };

  return (
    <div className="create-page">
      <h2 className="create-title">Create<br />a New User</h2>
      <input type="text" placeholder=" ID User " className="id-user-input" />
      <input type="text" placeholder=" Login " className="login-newuser-input" />
      <input type="password" placeholder=" Password " className="password-newuser-input" />
      <button className="create-newuser-button" onClick={handleCreate}>Create</button>
      <button className="back-create-button" onClick={handleBackNewUser}>Back</button>
    </div>
  );
}

export default Create;
