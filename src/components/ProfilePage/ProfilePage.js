import React, { useState } from "react";
import "./ProfilePage.css";
import CloseButtonIcon from "../icons/closeButtonIcon";
import ProfileIcon from "../icons/profileIcon";
import GoToIcon from "../icons/goToIcon";
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
    navigate("/newuser");
  };

  const handleExit = () => {
    navigate("/");
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <button className="close-button" onClick={onClose}>
          <CloseButtonIcon className="close-button" />
        </button>
      </div>

      <div className="profile-content">
        <button className="profile-button">
          <ProfileIcon className="profile-icon" />
          <span className="hello-user">User</span>
        </button>

        <ul className="profile-options">
          <li className="option" onClick={handleHistoricToggle}>
            <span>Historic</span>
            <button className="option-button">
              <GoToIcon />
            </button>
          </li>

          {showManage && (
            <li className="option" onClick={handleManageToggle}>
              <span>Manage</span>
              <button className="option-button">
                <GoToIcon />
              </button>
            </li>
          )}
        </ul>
      </div>

      <div className="profile-footer">
        <button className="exit-button" onClick={handleExit}>
          Exit
        </button>
      </div>

      {showHistoric && <Historic onClose={handleHistoricToggle} />}
    </div>
  );
}

export default ProfilePage;
