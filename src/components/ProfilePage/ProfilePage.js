import React, { useState } from "react";
import './ProfilePage.css';
import closeButtonIcon from "../../images/close-button-icon.png";
import profileIcon from "../../images/profile-icon.png";
import goTo from "../../images/go-to-icon.png";
import Historic from "../Historic/Historic";
import { useNavigate } from "react-router-dom";

//let isAdmin = true;

function ProfilePage({ onClose }) {
  // const [showManage, setShowManage] = useState(false); //alteração lucas
  const [showHistoric, setShowHistoric] = useState(false);
  const navigate = useNavigate();

  const handleHistoricToggle = () => {
    setShowHistoric(!showHistoric);
  };

  const handleExit = () => {
    navigate('/');
  };

  const handleNewUser = () => {
    navigate('/newuser');
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="close-button" onClick={onClose}>
          <img src={closeButtonIcon} alt="Fechar" />
        </button>
      </div>

      <div className="profile-content">
        <button className="go-button">
          <img src={profileIcon} alt="Profile" className="profile-icon" />
          <span className="hello-user">User</span>
        </button>

        <div className="navigate">
          <span>Historic</span>
          <button className="navigate-button" onClick={handleHistoricToggle}>
            <img src={goTo} alt="Historico" />
          </button>
        </div>

        <div className="navigate">
          <span>Manage</span>
          <button className="navigate-button" onClick={handleNewUser}>
            <img src={goTo} alt="Manage" />
          </button>
        </div>
        
      </div>

      <div className="profile-footer">
        <button className="exit-button" onClick={handleExit}>Sair</button>
      </div>

      {showHistoric && <Historic onClose={handleHistoricToggle} />}
    </div>
  );
}

export default ProfilePage;
