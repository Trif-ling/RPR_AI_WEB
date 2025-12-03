// src/components/ChatPage.js
import React, { useState, useEffect, useRef } from 'react';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import './ChatPage.css';

const BACKEND_URL = "https://junomi.app/junomi-server";

function ChatPage({ text }) { // Přijímáme 'text' (překlady) jako prop
  
  // Inicializace s prázdným textem nebo defaultním, 
  // ale hned ho přepíšeme v useEffect podle jazyka
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: text?.chat_welcome || "..." },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // EFEKT: Aktualizace první zprávy při změně jazyka
  useEffect(() => {
    setMessages(prevMessages => {
      // Vytvoříme kopii zpráv
      const newMessages = [...prevMessages];
      // Najdeme první zprávu (která je od bota a je to uvítání)
      // Předpokládáme, že první zpráva s ID 1 je vždy uvítací
      const welcomeMsgIndex = newMessages.findIndex(msg => msg.id === 1);
      
      if (welcomeMsgIndex !== -1) {
        newMessages[welcomeMsgIndex] = {
          ...newMessages[welcomeMsgIndex],
          text: text.chat_welcome
        };
      }
      return newMessages;
    });
  }, [text]); // Spustí se vždy, když se změní objekt 'text' (při změně jazyka)


  // --- Utility funkce ---

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const prepareHistory = (currentMessages) => {
    return currentMessages.map(msg => ({
      role: msg.sender === 'bot' ? 'assistant' : 'user',
      content: msg.text
    }));
  };

  const renderMessageContent = (text, sender) => {
    if (sender === 'user') {
      return text;
    }
    const rawHtml = marked.parse(text);
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
  };

  // --- Hlavní funkce Odeslání Zprávy ---

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputValue.trim() || isTyping) return;

    const userText = inputValue;
    setInputValue("");
    setIsTyping(true);

    // 1. Přidat zprávu uživatele
    const newUserMsg = { id: Date.now(), sender: 'user', text: userText };
    const historyToSend = [...messages, newUserMsg]; 
    setMessages(historyToSend);

    // 2. Přidat prázdnou bublinu pro bota
    const botMsgId = Date.now() + 1;
    const initialBotMsg = { id: botMsgId, sender: 'bot', text: "" };
    setMessages(prev => [...prev, initialBotMsg]);

    let fullResponse = "";

    try {
      // 3. Volání backendu
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: prepareHistory(historyToSend)
        })
      });

      // === OPRAVA CHYBY "Body has already been consumed" ===
      if (!response.ok) {
        let errorMsg = `Chyba ${response.status}`;
        
        // DŮLEŽITÉ: Vytvoříme kopii odpovědi.
        // Můžeme tak zkusit přečíst JSON a když to selže, přečteme text z kopie.
        const responseClone = response.clone(); 

        try {
            const errorData = await response.json(); // První pokus (spotřebuje originál)
            if (errorData && errorData.error) {
                errorMsg = errorData.error;
            }
        } catch (jsonError) {
            // Druhý pokus (spotřebuje kopii - to je bezpečné)
            const textError = await responseClone.text();
            if (textError) {
                errorMsg = textError;
            }
        }
        
        // Vyhodíme chybu, aby ji chytil blok catch níže
        throw new Error(errorMsg);
      }
      // ====================================================

      // 4. Čtení streamu
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;

        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
          )
        );
        scrollToBottom();
      }

      // Finální uložení
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
        )
      );

    } catch (error) {
      console.error("Chyba při komunikaci s API:", error);
      // Zobrazení chyby v bublině
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMsgId ? { ...msg, 
            text: `⚠️ ${error.message}` 
          } : msg
        )
      );
      scrollToBottom();
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="chat-container">
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

      <form className="input-area" onSubmit={handleSend}>
        <input 
          type="text" 
          /* ZDE JE ZMĚNA: Placeholder z překladů */
          placeholder={isTyping ? "..." : text.chat_placeholder} 
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          disabled={isTyping} 
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