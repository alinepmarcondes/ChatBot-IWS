import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import Manual from "../Manual/Manual";
import ListIcon from "../icons/listIcon";
import NewIcon from "../icons/newIcon";
import { useNavigationState } from "../hooks/useNavigationState"; 

function Chat() {
  const [showManual, setShowManual] = useState(false);
  const [chats, setChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);
  const navigationState = useNavigationState();

  const [userInput, setUserInput] = useState('');
  const [botResponse, setBotResponse] = useState('');

  const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('/api/generate-response', { userInput });
          setBotResponse(response.data);
      } catch (error) {
          console.error(error);
      }
  };

  useEffect(() => {
    fetchChats(); 
    if (navigationState.chat) {
      setCurrentChat(navigationState.chat);
    }
  }, [navigationState]);

  useEffect(() => {
    scrollToBottom();
  }, [currentChat]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const addNewChat = async () => {
    try {
      if (inputValue.trim() !== "") {
        const content = [{ timestamp: String(new Date()), sender: 'user', message: inputValue }];
        const userId = localStorage.getItem('userId');  // Obter o ID do usuário do localStorage
  
        const newChat = {
          title: inputValue.split(' ').slice(0, 5).join(' '),
          content: content,
          userId: userId  // Incluir o ID do usuário
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

  const fetchChats = async () => {
    try {
      const userId = localStorage.getItem('userId');  // Obter o ID do usuário do localStorage
      const response = await fetch(`http://localhost:5000/chats?userId=${userId}`);
      const data = await response.json();
      setChats(data);
    } catch (error) {
      console.error('Erro ao buscar chats:', error);
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
            const updatedChat = {
              ...updatedChats[updatedChatIndex],
              content: [...updatedChats[updatedChatIndex].content, newMessage]
            };
            updatedChats[updatedChatIndex] = updatedChat;
            setChats(updatedChats);
            setCurrentChat(updatedChat);

            await fetch(`http://localhost:5000/chats/${currentChat._id}/content`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(newMessage)
            });
            console.log('Mensagem enviada com sucesso!');
          }
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
          <ListIcon className="chat-manual-button" />
        </button>
        <h1 className="chat-title">{currentChat ? currentChat.title : "Starting a new chat"}</h1>
        <button className="chat-add-button" onClick={addNewChat}>
          <NewIcon className="chat-add-button"/>
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
          <form onSubmit={handleSubmit}>
              <input 
                  type="text" 
                  value={userInput} 
                  onChange={(e) => setUserInput(e.target.value)} 
              />
              <button type="submit">Send</button>
          </form>
          <button className="send-button" onClick={sendMessage}>
            Send
          </button>
          <div>
                <p>Bot: {botResponse}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Chat;
