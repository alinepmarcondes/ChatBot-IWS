import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import Manual from "../Manual/Manual";
import ListIcon from "../icons/listIcon";
import NewIcon from "../icons/newIcon";
import { useNavigationState } from "../hooks/useNavigationState";
import { marked } from 'marked';

function Chat() {
  const [showManual, setShowManual] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const navigationState = useNavigationState();

  useEffect(() => {
    fetchChats();
    if (navigationState.chat) {
      setCurrentChat(navigationState.chat);
    }
  }, [navigationState]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat?.content]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const addNewChat = async () => {
    try {
      if (inputValue.trim() !== "") {
        const content = [{ timestamp: String(new Date()), sender: 'user', message: inputValue }];
        const userId = localStorage.getItem('userId');

        const newChat = {
          title: inputValue.split(' ').slice(0, 5).join(' '),
          content: content,
          userId: userId
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
        setInputValue("");
        console.log('Chat created successfully!');
      } else {
        setCurrentChat(null);
      }
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const fetchChats = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const response = await fetch(`http://localhost:5000/chats?userId=${userId}`);
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
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
        setLoading(true); // Mostrar indicador de carregamento

        if (!currentChat) {
          await addNewChat();
        } else {
          if (currentChat && currentChat._id) {
            const updatedChats = [...chats];
            const updatedChatIndex = updatedChats.findIndex(chat => chat._id === currentChat._id);
            if (updatedChatIndex !== -1) {
              const updatedChat = {
                ...updatedChats[updatedChatIndex],
                content: [...updatedChats[updatedChatIndex].content, newMessage]
              };
              updatedChats[updatedChatIndex] = updatedChat;

              const response = await fetch(`http://localhost:5000/chats/${currentChat._id}/content`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: inputValue })
              });
              const data = await response.json();

              setCurrentChat(data.chat);
              setChats(chats.map(chat => (chat._id === data.chat._id ? data.chat : chat)));
            }
          } else {
            console.error('Current chat is undefined or missing _id property.');
          }
        }
      } catch (error) {
        console.error('Error sending message:', error);
      } finally {
        setLoading(false); // Ocultar indicador de carregamento
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

  const formatResponseMessage = (rawMessage) => {
    return marked.parse(rawMessage);
  };

  return (
    <div className="chat-container">
      {showManual && <Manual onClose={closeManual} />}
      <div className="chat-header">
        <button className="chat-manual-button" onClick={openManual}>
          <ListIcon className="chat-manual-button" />
        </button>
        <h1 className="chat-title">{currentChat ? currentChat.title : "Starting a new chat"}</h1>
        <button className="chat-add-button" onClick={addNewChat}>
          <NewIcon className="chat-add-button" />
        </button>
      </div>
      <div className="chat-body">
        <div className="chat-messages">
          {currentChat && currentChat.content.map((message, index) => (
            <div
              key={index}
              className={`message-box ${message.sender === 'user' ? "sent" : "received"}`}
            >
              <div className="message-text" dangerouslySetInnerHTML={{ __html: message.sender === 'bot' ? formatResponseMessage(message.message) : message.message }}></div>
              <div className="message-info">
                <span className="timestamp">{new Date(message.timestamp).toLocaleString()}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <span>Carregando resposta...</span>
            </div>
          )}
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
