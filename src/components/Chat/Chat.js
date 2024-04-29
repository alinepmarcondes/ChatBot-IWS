import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./Chat.css";
import Manual from "../Manual/Manual";
import manualButtonIcon from "../../images/manual-button-icon.png";
import newChatButtonIcon from "../../images/new-chat-button-icon.png";

function Chat() {
  const [showManual, setShowManual] = useState(false);
  const [chats, setChats] = useState([]); // Array de chats
  const [currentChat, setCurrentChat] = useState(null); // Chat atual
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [chats, currentChat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const openManual = () => {
    setShowManual(true);
  };

  const closeManual = () => {
    setShowManual(false);
  };

  const addNewChat = () => {
    const newChat = {
      _id: Math.random().toString(36).substr(2, 9), // Gerando um ID único
      title: "",
      content: []
    };
    setCurrentChat(newChat); // Definindo novo chat como chat atual
    setChats([...chats, newChat]); // Adicionando novo chat ao array de chats
  };

 const sendMessage = async () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        timestamp: new Date().toISOString(),
        sender: 'user',
        message: inputValue
      };

      if (!currentChat) {
        // Se não houver um chat atual, crie um novo chat com o título e adicione a mensagem ao conteúdo
        const newChat = {
          _id: Math.random().toString(36).substr(2, 9),
          title: inputValue.split('.')[0], // Título é a primeira frase da mensagem
          content: [newMessage]
        };
        setCurrentChat(newChat); // Definindo novo chat como chat atual
        setChats([...chats, newChat]); // Adicionando novo chat ao array de chats
      } else {
        // Se houver um chat atual, adicione a mensagem ao seu conteúdo
        const updatedChats = [...chats];
        const updatedChatIndex = updatedChats.findIndex(chat => chat._id === currentChat._id);
        if (updatedChatIndex !== -1) {
          updatedChats[updatedChatIndex].content.push(newMessage);
          setChats(updatedChats);
        }
      }

      try {
        // Salve a nova mensagem no backend
        const response = await axios.post('http://localhost:5000/chats', newMessage);
        console.log(response.data);
      } catch (error) {
        console.error('Error sending message:', error);
      }

      setInputValue("");
    }
  };

  return (
    <div className="chat-container">
      {showManual && <Manual onClose={closeManual} />}
      <div className="chat-header">
        <button className="chat-manual-button" onClick={openManual}>
          <img src={manualButtonIcon} alt="Manual" />
        </button>
        <h1 className="chat-title">Starting a new chat</h1>
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
                {/* Add sender information or any other additional info here */}
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