import React, { useState, useEffect } from "react";
import './Historic.css';
import CloseButtonIcon from "../icons/closeButtonIcon";
import { useNavigate } from "react-router-dom";

function Historic({ onClose }) {
  const [chats, setChats] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch('http://localhost:5000/chats');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setChats(data);
      } catch (error) {
        console.error('Erro ao buscar chats:', error);
      }
    }
    fetchChats();
  }, []);

  const handleChatClick = (chat) => {
    navigate('/chat', { state: { chat } });
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
