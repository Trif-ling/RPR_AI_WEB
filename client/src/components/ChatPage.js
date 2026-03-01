import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './ChatPage.css';
import { Helmet } from 'react-helmet-async';

const BACKEND_URL = "http://localhost:3001";

// Přidal jsem 'text' jako prop do závorky, aby aplikace nespadla, pokud ho nepošleš
const ChatPage = ({ text = {} }) => {
  
  // --- STAVOVÉ PROMĚNNÉ ---
  // Používáme bezpečný přístup (text?.neco || "default"), aby to nespadlo
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: text?.chat_welcome || "Ahoj! Jak ti mohu pomoci?" },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Reference
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // --- EFEKTY ---
  
  // Aktualizace uvítací zprávy při změně jazyka
  useEffect(() => {
    if (text?.chat_welcome) {
      setMessages(prevMessages => {
        const newMessages = [...prevMessages];
        const welcomeMsgIndex = newMessages.findIndex(msg => msg.id === 1);
        
        if (welcomeMsgIndex !== -1) {
          newMessages[welcomeMsgIndex] = {
            ...newMessages[welcomeMsgIndex],
            text: text.chat_welcome
          };
        }
        return newMessages;
      });
    }
  }, [text]);

  // Scroll dolů při nové zprávě
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Vrácení fokusu do inputu po odeslání
  useEffect(() => {
    if (!isTyping) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 10);
    }
  }, [isTyping]);

  // Automatická výška textarea
  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [inputValue]);


  // --- POMOCNÉ FUNKCE ---

  const prepareHistory = (currentMessages) => {
    return currentMessages.map(msg => ({
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text
    }));
  };

  const renderMessageContent = (textMsg, sender) => {
    if (sender === 'user') {
      return textMsg;
    }
    // Ošetření prázdného textu před parsováním
    if (!textMsg) return null;

    const rawHtml = marked.parse(textMsg);
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  };

  // --- ODESLÁNÍ ZPRÁVY ---

  const handleSend = async (e) => {
    if (e) e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue("");
    setIsTyping(true);
    
    if (inputRef.current) inputRef.current.style.height = 'auto';

    // 1. Přidat zprávu uživatele
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    const historyToSend = [...messages, newUserMsg]; 
    setMessages(historyToSend);

    // 2. Přidat placeholder pro bota
    const botMsgId = Date.now() + 1;
    const initialBotMsg = { id: botMsgId, sender: 'bot', text: "" };
    setMessages(prev => [...prev, initialBotMsg]);

    let fullResponse = "";

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: prepareHistory(historyToSend)
        })
      });

      if (!response.ok) {
        let errorMsg = `Chyba ${response.status}`;
        // Pokus o bezpečné čtení chyby (může selhat, proto try/catch uvnitř)
        try {
            const responseClone = response.clone(); 
            const errorData = await response.json();
            if (errorData && errorData.error) errorMsg = errorData.error;
        } catch (e) {
             // Pokud selže JSON, zkusíme text, nebo necháme default
        }
        throw new Error(errorMsg);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        
        // Funkcionální update stavu pro zamezení problémů s closure
        setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
        ));
        scrollToBottom();
      }
      // Finální update pro jistotu
      setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
      ));

    } catch (error) {
      console.error("Chyba API:", error);
      setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: `⚠️ ${error.message}` } : msg
      ));
      scrollToBottom();
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  // --- RENDEROVÁNÍ (HTML) ---
  return (
    <div className="app-layout">
      
      <Helmet>
        <title>Chat s AI | RPR AI Web</title>
        <meta name="description" content="Potřebujete poradit? Náš AI asistent je tu pro vás 24/7." />
      </Helmet>

      {/* === LEVÝ PANEL (SIDEBAR) === */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={() => window.location.reload()}>
          <span>+</span> Nový chat
        </button>

        <div className="history-list">
          
          <div className="history-group">Dnes</div>
          
          {/* Ukázka aktivního chatu */}
          <div className="history-item active">
            <span className="history-title">Návrh webu JuNoMi</span>
            <div className="history-actions">
              <button title="Upravit">✎</button>
              <button title="Smazat">🗑️</button>
            </div>
          </div>

          <div className="history-item">
            <span className="history-title">Vysvětlení Reactu pro začátečníky</span>
          </div>
          
          <div className="history-group">Včera</div>
          
          <div className="history-item">
            <span className="history-title">Recept na guláš</span>
          </div>

          <div className="history-item">
            <span className="history-title">Analýza textu pro školní práci</span>
          </div>

          <div className="history-group">Předchozí 7 dní</div>
          
          <div className="history-item">
            <span className="history-title">Generování obrázků</span>
          </div>
        </div>
        
        <div className="sidebar-footer">
          <div className="user-profile">
            <div className="avatar-small">DM</div>
            <div className="user-info">
              <span className="user-name">Daniel Milota</span>
              <span className="user-status">Pro Plan</span>
            </div>
          </div>
        </div>
      </aside>

      {/* === HLAVNÍ CHAT === */}
      <main className="chat-main">
        <div className="chat-container">
          
          {/* Hlavička chatu */}
          <div className="chat-header">
            <div className="bot-avatar">JU</div>
            <div className="chat-info">
              <h3>Junomi assistent</h3>
              <span className="status-dot" style={{ backgroundColor: isTyping ? '#eebb00' : '#00d084' }}></span> 
              <span style={{color: isTyping ? '#eebb00' : '#00d084'}}>
                {isTyping ? 'píše...' : 'Online'}
              </span>
            </div>
          </div>

          {/* Zprávy */}
          <div className="messages-area">
            {messages.map((msg) => (
              <div key={msg.id} className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
                {msg.sender === 'bot' && <div className="msg-avatar">JU</div>}
                
                <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                  {renderMessageContent(msg.text, msg.sender)}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Vstupní pole */}
          <form className="input-area" onSubmit={handleSend}>
            <textarea
              ref={inputRef}
              placeholder={isTyping ? "..." : (text?.chat_placeholder || "Napište zprávu...")}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isTyping}
              autoFocus
              rows={1}
            />
            <button type="submit" className="send-btn" disabled={isTyping || !inputValue.trim()}>
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
              </svg>
            </button>
          </form>

        </div>
      </main>
    </div>
  );
};

export default ChatPage;