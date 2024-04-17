import React, { useState } from 'react';
import './NewUser.css';
import { useNavigate } from "react-router-dom";

function NewUser () {
  const navigate = useNavigate();

  const handleNextPage = () => {
    navigate('/');
  };
 
  return (
    <div className="admin-page">
        <button className="new-user-button" onClick={handleNextPage}>New User</button>
        <button className="user-button" onClick={handleNextPage}>User 1</button>
        <button className="user-button" onClick={handleNextPage}>User 2</button>
        <button className="user-button" onClick={handleNextPage}>User 3</button>
        <button className="back-button" onClick={handleNextPage}>Back</button>
    </div>
  );
}
export default NewUser;