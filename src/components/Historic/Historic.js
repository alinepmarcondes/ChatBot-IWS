import React, { useState, useEffect } from "react";
import './Historic.css';
import CloseButtonIcon from "../icons/closeButtonIcon";
import axios from 'axios';
import { useNavigate } from "react-router-dom"; // Importe useNavigate

function Historic({ onClose }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate(); // Use o hook useNavigate

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

  const handleChatClick = (chat) => {
    navigate('/chat', { state: { chat } }); // Navegue para a tela de chat e passe o chat clicado como estado
  };

  return (
    <div className="historic-page">
      <div className="historic-header">
        <button className="close-button" onClick={onClose}>
          <CloseButtonIcon />
        </button>
      </div>
      <div className="historic-content">
        <h2>Historic</h2>
        <ul>
          {chats.map(chat => (
            <li key={chat._id}>
              <button 
                className="link-button" 
                onClick={() => handleChatClick(chat)}
              >
                {chat.title}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Historic;
