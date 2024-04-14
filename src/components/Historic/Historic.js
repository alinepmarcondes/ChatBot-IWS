/* eslint-disable jsx-a11y/anchor-is-valid */
import React from "react";
import './Historic.css';
import closeButtonIcon from "../../images/close-button-icon.png";

function Historic({ onClose }) {
  return (
    <div className="historic-page">
      <div className="historic-header">
        <button className="close-button" onClick={onClose}><img src={closeButtonIcon} alt="Fechar" /></button>
      </div>
      <div className="historic-content">
        <h2>Historic</h2>
        <ul>
          <li><a href="#">Topic 1</a></li>
          <li><a href="#">Topic 2</a></li>
          <li><a href="#">Topic 3</a></li>
        </ul>
      </div>
    </div>
  );
}

export default Historic;
