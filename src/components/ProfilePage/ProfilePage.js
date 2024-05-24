import React, { useState } from "react";
import './ProfilePage.css';
import closeButtonIcon from "../../images/close-button-icon.png";
import profileIcon from "../../images/profile-icon.png";
import goTo from "../../images/go-to-icon-2.png";
import Historic from "../Historic/Historic";
import { useNavigate } from "react-router-dom";

let isAdmin = true;

function ProfilePage({ onClose }) {
  const [showManage] = useState(isAdmin); 
  const [showHistoric, setShowHistoric] = useState(false);
  const navigate = useNavigate();

  const handleHistoricToggle = () => {
    setShowHistoric(!showHistoric);
  };

  const handleManageToggle = () => {
    navigate('/newuser');
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

        <div className="manage" style={{ display: showManage ? 'block' : 'none' }}>
          <span>Manage</span>
          <button className="manage-button" onClick={handleManageToggle}>
            <img src={goTo} alt="Manage" />
          </button>
        </div>
        
      </div>

      <div className="profile-footer">
        <button className="exit-button" onClick={handleExit}>Exit</button>
      </div>

      {showHistoric && <Historic onClose={handleHistoricToggle} />}
    </div>
  );
}

export default ProfilePage;