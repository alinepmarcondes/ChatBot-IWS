import React, { useState } from "react";
import './ProfilePage.css';
import closeButtonIcon from "../../images/close-button-icon.png";
import profileIcon from "../../images/profile-icon.png";
import goTo from "../../images/go-to-icon.png";
import Historic from "../Historic/Historic";
import { useNavigate } from "react-router-dom";

function ProfilePage({ onClose }) {
  const [showHistoric, setShowHistoric] = useState(false);
  const navigate = useNavigate();

  const handleHistoricToggle = () => {
    setShowHistoric(!showHistoric);
  };

  const handleExit = () => {
    navigate('/');
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
        <div className="historic">
          <span>Historic</span>
          <button className="historic-button" onClick={handleHistoricToggle}>
            <img src={goTo} alt="Historico" />
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
