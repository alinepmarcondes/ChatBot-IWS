import React, { useState, useEffect } from 'react';
import './NewUser.css';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const NewUser = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/users');
        setUsers(response.data); 
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };

    fetchUsers(); 
  }, []); 

  const handleUserClick = (user) => {
    setSelectedUser(user === selectedUser ? null : user); 
  };

  const handleBackButton = () => {
    console.log('Back button clicked');
    navigate('/chat');
  };

  const handleCreateNewUserButton = () => {
    navigate('/create');
  };

  const handleNextButton = () => {
    if (selectedUser) {
      console.log('Selected user:', selectedUser);
    } else {
      console.error('Please select a user.');
    }
    navigate('/edit')
  };

  return (
    <div className="new-user-page">
      <div className="sub-container">
        <div className="new-user-form">
          <button className="new-user-new" onClick={handleCreateNewUserButton}>New user</button> {/* Botão "New user" */}  
          <div className="new-user-input">
            <button
              className={`user-button ${selectedUser === 'User 1' ? 'selected' : ''}`}
              onClick={() => handleUserClick('User 1')}
            >
              User 1
            </button>
            <div className="new-user-icon">
              <i className="fas fa-times"></i>
            </div>
          </div>
          <div className="new-user-input">
            <button
              className={`user-button ${selectedUser === 'User 2' ? 'selected' : ''}`}
              onClick={() => handleUserClick('User 2')}
            >
              User 2
            </button>
            <div className="new-user-icon">
              <i className="fas fa-times"></i>
            </div>
          </div>
          <div className="new-user-input">
            <button
              className={`user-button ${selectedUser === 'User 3' ? 'selected' : ''}`}
              onClick={() => handleUserClick('User 3')}
            >
              User 3
            </button>
            <div className="new-user-icon">
              <i className="fas fa-times"></i>
            </div>
          </div>
          <div className="new-user-buttons">
            <button className="new-user-next" onClick={handleNextButton}>
              <i className="fas fa-arrow-left"></i> Next
            </button>
          </div>
          <div className="new-user-buttons">
            <button className="new-user-back" onClick={handleBackButton}>
              <i className="fas fa-arrow-left"></i> Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewUser;
