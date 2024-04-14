/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import './Manual.css';
import closeButtonIcon from "../../images/close-button-icon.png";
import profileIcon from "../../images/profile-icon.png";
import ProfilePage from "../ProfilePage/ProfilePage";

function Manual({ onClose }) {
  const [showProfile, setShowProfile] = useState(false);

  const handleProfileToggle = () => {
    setShowProfile(!showProfile);
  };

  return (
    <div className="manual-screen">
      <div className="manual-header">
        <button className="back-button" onClick={onClose}>
          <img src={closeButtonIcon} alt="Fechar" />
        </button>
      </div>
      <div className="manual-content">
        <div className="go-to-profile">
          <button className="go-button" onClick={handleProfileToggle}>
            <img src={profileIcon} alt="Profile" className="profile-icon" />
            <span className="hello-user">Hello, User!</span>
          </button>
        </div>
        <div className="manual-topics">
          <h2>Manual topics</h2>
          <ul>
            <li><a href="#">Cotação Online</a></li>
            <li><a href="#">EasyCash</a></li>
            <li><a href="#">EasyCheckOut</a></li>
            <li><a href="#">Instalação Web Service</a></li>
            <li><a href="#">IntelliCash</a></li>
            <li><a href="#">Intelligroup</a></li>
            <li><a href="#">IntelliStock</a></li>
            <li><a href="#">Intelliweb</a></li>
            <li><a href="#">Venda assistida</a></li>
          </ul>
        </div>
      </div>
      {showProfile && <ProfilePage onClose={handleProfileToggle} />}
    </div>
  );
}

export default Manual;
