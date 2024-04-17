import React, { useState, useRef, useEffect } from "react";
import "./Chat.css";
import Manual from "../Manual/Manual";
import manualButtonIcon from "../../images/manual-button-icon.png";
import newChatButtonIcon from "../../images/new-chat-button-icon.png";

function Chat() {
  const [showManual, setShowManual] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const sendMessage = () => {
    if (inputValue.trim() !== "") {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sentByUser: true, // Flag to identify sent messages
        timestamp: new Date().toISOString() // Adding timestamp
        // You can add more properties like sender, etc. if needed
      };

      setMessages([...messages, newMessage]);
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
        <button className="chat-add-button">
          <img src={newChatButtonIcon} alt="Add" />
        </button>
      </div>
      <div className="chat-body">
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message-box ${message.sentByUser ? "sent" : "received"}`}
            >
              <div className="message-text">{message.text}</div>
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
