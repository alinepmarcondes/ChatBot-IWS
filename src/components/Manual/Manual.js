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
            <li class="level1"><div class="li"> <strong>Cotação Online</strong></div>
            <ul>
            <li class="level2"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=manuais:cotacao:mobile" class="wikilink1" target="_blank" title="manuais:cotacao:mobile" rel="noreferrer">Mobile</a></div>
            </li>
            <li class="level2"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=manuais:cotacao:web" class="wikilink1" target="_blank" title="manuais:cotacao:web" rel="noreferrer">Web</a></div>
            </li>
            </ul>
            </li>
            <li class="level1"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=easycash" class="wikilink1" target="_blank" title="easycash" rel="noreferrer">EasyCash</a></div>
            </li>
            <li class="level1"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=easycheckout" class="wikilink1" target="_blank" title="easycheckout" rel="noreferrer">EasyCheckOut</a></div>
            </li>
            <li class="level1"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=instalacao_web_service" class="wikilink1" target="_blank" title="instalacao_web_service" rel="noreferrer">Instalação Web Service</a></div>
            </li>
            <li class="level1"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=intellicash" class="wikilink1" target="_blank" title="intellicash" rel="noreferrer">IntelliCash</a></div>
            </li>
            <li class="level1"><div class="li"> <strong>Intelligroup</strong></div>
            <ul>
            <li class="level2"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=manuais:intelligroup:mobile" class="wikilink1" target="_blank" title="manuais:intelligroup:mobile" rel="noreferrer">Mobile</a></div>
            </li>
            <li class="level2"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=manuais:intelligroup:web" class="wikilink1" target="_blank" title="manuais:intelligroup:web" rel="noreferrer">Web</a></div>
            </li>
            </ul>
            </li>
            <li class="level1"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=intellistock" class="wikilink1" target="_blank" title="intellistock" rel="noreferrer">IntelliStock</a></div>
            </li>
            <li class="level1"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=intelliweb" class="wikilink1" target="_blank" title="intelliweb" rel="noreferrer">Intelliweb</a></div>
            </li>
            <li class="level1"><div class="li"> <a href="https://wiki.iws.com.br/doku.php?id=manuais:vendaassistida:versao-1" class="wikilink1" target="_blank" title="manuais:vendaassistida:versao-1" rel="noreferrer">Venda Assistida</a></div>
            </li>
          </ul>
        </div>
      </div>
      {showProfile && <ProfilePage onClose={handleProfileToggle} />}
    </div>
  );
}

export default Manual;