// src/components/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import './ChatPage.css';

function ChatPage({ text }) {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Ahoj! Jsem tvůj AI asistent. Jak ti mohu dnes pomoci?" },
    { id: 2, sender: 'user', text: "Čau, potřebuji pomoct s úkolem do školy." },
    { id: 3, sender: 'bot', text: "Jasně! O jaký předmět se jedná? Můžeme se podívat na matematiku, dějepis nebo třeba programování." },
  ]);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const newUserMsg = { id: Date.now(), sender: 'user', text: inputValue };
    setMessages(prev => [...prev, newUserMsg]);
    setInputValue("");

    setTimeout(() => {
      const newBotMsg = { id: Date.now() + 1, sender: 'bot', text: "To zní zajímavě! Řekni mi o tom víc (toto je jen demo odpověď)." };
      setMessages(prev => [...prev, newBotMsg]);
    }, 1000);
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="bot-avatar">AI</div>
        <div className="chat-info">
          <h3>AI Asistent</h3>
          <span className="status-dot"></span> Online
        </div>
      </div>

      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
            {msg.sender === 'bot' && <div className="msg-avatar">AI</div>}
            <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form className="input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          placeholder="Napište zprávu..." 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="submit" className="send-btn">➤</button>
      </form>
    </div>
  );
}

export default ChatPage;