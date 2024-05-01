import React, { useState, useEffect } from "react";
import './Historic.css';
import closeButtonIcon from "../../images/close-button-icon.png";
import axios from 'axios';

function Historic({ onClose }) {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await axios.get('http://localhost:5000/chats');
        setChats(response.data);
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      }
    }
    fetchChats();
  }, []);

  return (
    <div className="historic-page">
      <div className="historic-header">
        <button className="close-button" onClick={onClose}><img src={closeButtonIcon} alt="Fechar" /></button>
      </div>
      <div className="historic-content">
        <h2>Historic</h2>
        <ul>
          {chats.map(chat => (
            <li key={chat._id}>
              <a href="#" onClick={() => console.log(chat)}>
                {chat.title} {/* Supondo que o título do chat seja armazenado em uma propriedade chamada 'title' */}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Historic;
