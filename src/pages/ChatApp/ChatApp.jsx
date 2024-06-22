import React, { useState, useRef, useEffect } from "react";
import "./chatApp.css";
// import userImg from "./user.png"; // Import a user avatar image

const ChatApp = ({ user }) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const chatWindowRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat window when messages change
    chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (message.trim() !== "") {
      const newMessage = {
        text: message,
        sender: user.username,
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setMessage("");
      // Simulate a response from the server (you would replace this with your backend logic)
      setTimeout(() => {
        const botResponse = {
          text: "This is a dummy response from the bot.",
          sender: "bot",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        };
        setMessages([...messages, botResponse]);
      }, 500);
    }
  };

  return (
    <div className="chat-container">
      <div className="chat-window" ref={chatWindowRef}>
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === user.username ? "user" : "bot"}`}
          >
            {msg.sender !== "bot" && (
              <img className="avatar" src={userImg} alt="User Avatar" />
            )}
            <div className="message-content">
              <p>{msg.text}</p>
              <span className="message-timestamp">{msg.timestamp}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default ChatApp;
