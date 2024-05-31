/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from "react";
import './Manual.css';
import CloseButtonIcon from "../icons/closeButtonIcon";
import ProfileIcon from "../icons/profileIcon";
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
          <CloseButtonIcon className="close-button"/>
        </button>
      </div>
      <div className="manual-content">
        <div className="go-to-profile">
          <button className="go-button" onClick={handleProfileToggle}>
            <ProfileIcon className="profile-icon"/>
            <span className="hello-user">Hello, User!</span>
          </button>
        </div>
        <div className="manual-topics">
          <h2>Manual topics</h2>
          <ul>
            <li><a href="#">Cotação Online Mobile</a></li>
            <li><a href="#">Cotação Online Web</a></li>
            <li><a href="#">EasyCash</a></li>
            <li><a href="#">EasyCheckOut</a></li>
            <li><a href="#">Instalação Web Service</a></li>
            <li><a href="#">IntelliCash</a></li>
            <li><a href="#">Intelligroup Mobile</a></li>
            <li><a href="#">Intelligroup Web</a></li>
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