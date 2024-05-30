import React, { useState, useRef, useEffect } from "react";
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
      if (inputValue.trim() !== "") {
        const content = [{ timestamp: String(new Date()), sender: 'user', message: inputValue }];

        const newChat = {
          title: inputValue.split(' ').slice(0, 5).join(' '),
          content: content
        };

        const response = await fetch('http://localhost:5000/chats', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newChat)
        });
        const data = await response.json();
        const createdChat = data.chat;

        setCurrentChat(createdChat);
        setChats([...chats, createdChat]);

        console.log('Chat criado com sucesso!');
      } else {
        setCurrentChat(null);
      }
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
            if (updatedChats[updatedChatIndex].title === "New Chat") {
              const title = inputValue.split(' ').slice(0, 5).join(' ');
              await fetch(`http://localhost:5000/chats/${currentChat._id}/title`, {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ newTitle: title })
              });
              updatedChats[updatedChatIndex].title = title;
            }
            setChats(updatedChats);
          }
        }

        if (currentChat) {
          await fetch(`http://localhost:5000/chats/${currentChat._id}/content`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(newMessage)
          });
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

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
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
            onKeyDown={handleKeyDown}
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