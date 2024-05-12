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

  const addNewChat = async () => {
    try {
      const content = inputValue !== "" ? [{timestamp: String(new Date()), sender: 'user',  message: inputValue}] : [];
      
      const newChat = {
        title: "title",
        content: content
      };
  
      const response = await axios.post('http://localhost:5000/chats', newChat);
      const createdChat = response.data.chat;

      await updateChatTitle(createdChat._id, inputValue);
  
      setCurrentChat(createdChat);
      setChats([...chats, createdChat]);
      
      console.log('Chat criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar chat:', error);
    }
  };

  const updateChatTitle = async (chatId, firstMessage) => {
    try {
      // Extrair as primeiras 5 palavras da primeira mensagem
      const title = firstMessage.split(' ').slice(0, 5).join(' ');
  
      // Fazer uma chamada PUT para atualizar o título do chat
      await axios.put(`http://localhost:5000/chats/${chatId}/title`, { newTitle: title });
      console.log('Título do chat atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar título do chat:', error);
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