import React from "react";
import "./Chat.css";
import Manual from "../Manual/Manual"
import manualButtonIcon from "../../images/manual-button-icon.png";
import newChatButtonIcon from "../../images/new-chat-button-icon.png";
import { useState } from "react";

function Chat() {

  const [showManual, setShowManual] = useState(false);

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
        <h1 className="chat-title">Starting a new chat</h1>
        <button className="chat-add-button">
          <img src={newChatButtonIcon} alt="Add" />
          </button>
      </div>
      <div className="chat-body">
        <div className="chat-messages"></div>
        <div className="chat-input">
          <input type="text" placeholder="Write your question here" />
          <button className="send-button">Send</button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
