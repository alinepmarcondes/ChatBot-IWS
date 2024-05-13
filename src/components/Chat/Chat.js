// Chat.js

import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.css";
import Manual from "../Manual/Manual";
import manualButtonIcon from "../../images/manual-button-icon.png";
import newChatButtonIcon from "../../images/new-chat-button-icon.png";
import { useLocation } from "react-router-dom";

function Chat() {
  const [showManual, setShowManual] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    scrollToBottom();
    if (location.state && location.state.chat) {
      setCurrentChat(location.state.chat);
    }
  }, [chats, currentChat, location.state]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const addNewChat = async () => {
    try {
      const content = inputValue !== "" ? [{timestamp: String(new Date()), sender: 'user',  message: inputValue}] : [];
      
      const newChat = {
        title: "New Chat", // Defina o título como 'New Chat'
        content: content
      };
  
      const response = await axios.post('http://localhost:5000/chats', newChat);
      const createdChat = response.data.chat;

      setCurrentChat(createdChat);
      setChats([...chats, createdChat]);
      
      console.log('Chat criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  const sendMessage = async () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        timestamp: String(new Date()),
        sender: 'user',
        message: inputValue
      };

      try {
        if (!currentChat) {
          await addNewChat();
        } else {
          const updatedChats = [...chats];
          const updatedChatIndex = updatedChats.findIndex(chat => chat._id === currentChat._id);
          if (updatedChatIndex !== -1) {
            updatedChats[updatedChatIndex].content.push(newMessage);
            if (updatedChats[updatedChatIndex].title === "New Chat") { // Atualize o título apenas se ainda for 'New Chat'
              const title = inputValue.split(' ').slice(0, 5).join(' '); // Extrair as primeiras 5 palavras da mensagem
              await axios.put(`http://localhost:5000/chats/${currentChat._id}/title`, { newTitle: title }); // Atualizar o título do chat
              updatedChats[updatedChatIndex].title = title; // Atualizar o título localmente
            }
            setChats(updatedChats);
          }
        } 

        if (currentChat) {
          await axios.post(`http://localhost:5000/chats/${currentChat._id}/content`, newMessage);
          console.log('Mensagem enviada com sucesso!');
        }
      } catch (error) {
        console.error('Erro ao enviar mensagem:', error);
      }
  
      setInputValue("");
    }
  };

  const openManual = () => {
    setShowManual(true);
  };

  const closeManual = () => {
    setShowManual(false);
  };

  return (
    <div className="chat-container">
      {showManual && <Manual onClose={closeManual} />}
      <div className="chat-header">
        <button className="chat-manual-button" onClick={openManual}>
          <img src={manualButtonIcon} alt="Manual" />
        </button>
        <h1 className="chat-title">{currentChat ? currentChat.title : "Starting a new chat"}</h1>
        <button className="chat-add-button" onClick={addNewChat}>
          <img src={newChatButtonIcon} alt="Add" />
        </button>
      </div>
      <div className="chat-body">
        <div className="chat-messages">
          {currentChat && currentChat.content.map((message, index) => (
            <div
              key={index}
              className={`message-box ${message.sender === 'user' ? "sent" : "received"}`}
            >
              <div className="message-text">{message.message}</div>
              <div className="message-info">
                <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className="chat-input">
          <input
            type="text"
            placeholder="Write your question here"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
          />
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
