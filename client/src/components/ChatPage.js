// src/components/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './ChatPage.css';

function ChatPage() {
  // Výchozí zpráva
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: "Ahoj! Jsem tvůj Junomi AI asistent. Jak ti mohu dnes pomoci?" },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false); // Stav pro blokování tlačítka při generování
  const messagesEndRef = useRef(null);

  // Automatické scrollování dolů
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Pomocná funkce pro přípravu historie pro API (převede 'user'/'bot' na 'user'/'assistant')
  const prepareHistory = (currentMessages) => {
    return currentMessages.map(msg => ({
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text
    }));
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue(""); // Vyčistit input
    setIsTyping(true);

    // 1. Přidat zprávu uživatele do UI
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    const updatedMessages = [...messages, newUserMsg];
    setMessages(updatedMessages);

    // 2. Vytvořit prázdnou bublinu pro bota
    const botMsgId = Date.now() + 1;
    const initialBotMsg = { id: botMsgId, sender: 'bot', text: "" };
    setMessages(prev => [...prev, initialBotMsg]);

    try {
      // 3. Volání backendu
      const response = await fetch('http://localhost:3001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: prepareHistory(updatedMessages) // Posíláme celou historii
        })
      });

      if (!response.ok) throw new Error("Chyba sítě");

      // 4. Čtení streamu
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;

        // 5. Aktualizace poslední zprávy (bot) v reálném čase
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullText } : msg
          )
        );
      }

    } catch (error) {
      console.error("Chyba:", error);
      // V případě chyby aktualizujeme zprávu bota
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: "Omlouvám se, došlo k chybě připojení." } : msg
        )
      );
    } finally {
      setIsTyping(false);
    }
  };

  // Funkce pro bezpečné renderování Markdownu
  const renderMessageContent = (text, sender) => {
    if (sender === 'user') {
      return text; // Zprávy uživatele neformátujeme (bezpečnost/styl)
    }
    
    // Pro bota převedeme Markdown na HTML a očistíme
    const rawHtml = marked.parse(text);
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  };

  return (
    <div className="chat-container">
      <div className="chat-header">
        <div className="bot-avatar">AI</div>
        <div className="chat-info">
          <h3>Junomi asistent</h3>
          <span className="status-dot" style={{ backgroundColor: isTyping ? '#eebb00' : '#00d084' }}></span> 
          {isTyping ? 'Píše...' : 'Online'}
        </div>
      </div>

      <div className="messages-area">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
            {msg.sender === 'bot' && <div className="msg-avatar">AI</div>}
            
            <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
              {/* Zde voláme funkci pro renderování obsahu */}
              {renderMessageContent(msg.text, msg.sender)}
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
          disabled={isTyping} // Znemožnit psaní během generování
          autoFocus
        />
        <button type="submit" className="send-btn" disabled={isTyping || !inputValue.trim()}>
          ➤
        </button>
      </form>
    </div>
  );
}

export default ChatPage;