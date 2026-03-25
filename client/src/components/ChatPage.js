import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { Helmet } from 'react-helmet-async';
import { supabase } from '../supabaseClient'; // IMPORT DATABÁZE
import './ChatPage.css';

// === DOSTUPNÉ AI MODELY ===
const AVAILABLE_MODELS = [
  { id: 'llama-3.3-70b-versatile', name: 'LLaMA 3.3', supportsVision: false },
  { id: 'meta-llama/llama-4-scout-17b-16e-instruct', name: 'LLaMA 4 Scout', supportsVision: true },
  { id: 'openai/gpt-oss-120b', name: 'GPT OSS (Pro)', supportsVision: false }
];

// === LIMITY ZPRÁV (na 30 minut) ===
const RATE_LIMITS = {
  logged_in: {
    'llama-3.3-70b-versatile': 40,
    'meta-llama/llama-4-scout-17b-16e-instruct': 15,
    'openai/gpt-oss-120b': 30
  },
  guest: {
    'llama-3.3-70b-versatile': 20,
    'meta-llama/llama-4-scout-17b-16e-instruct': 5,
    'openai/gpt-oss-120b': 15
  }
};
const LIMIT_WINDOW_MS = 30 * 60 * 1000; // 30 minut v milisekundách

// === LIMITY OBRÁZKŮ (na 24 hodin) ===
const IMAGE_LIMITS = {
  logged_in: 5,
  guest: 3
};
const DAY_IN_MS = 24 * 60 * 60 * 1000;

// --- POMOCNÉ FUNKCE PRO ČAS A DATUM ---
const formatDateSeparator = (dateObj) => {
  if (!dateObj) return '';
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (dateObj.toDateString() === today.toDateString()) return 'Dnes';
  if (dateObj.toDateString() === yesterday.toDateString()) return 'Včera';
  
  return dateObj.toLocaleDateString('cs-CZ', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatMessageTime = (dateObj) => {
  if (!dateObj) return '';
  return dateObj.toLocaleTimeString('cs-CZ', { hour: '2-digit', minute: '2-digit' });
};

const BACKEND_URL = "https://monkfish-app-grkr8.ondigitalocean.app/rpr-ai-web-server";

const ChatPage = ({ text = {} }) => {
  // --- STAVY UŽIVATELE A DATABÁZE ---
  const [selectedModel, setSelectedModel] = useState(AVAILABLE_MODELS[0]);
  const [user, setUser] = useState(null);
  const [chatList, setChatList] = useState([]); // Seznam chatů v postranním panelu
  const navigate = useNavigate(); // Pro přesměrování
  const [userName, setUserName] = useState(''); // Uchování uživatelského jména
  const [showProfilePopup, setShowProfilePopup] = useState(false); // Zda je popup otevřený
  const [showLimits, setShowLimits] = useState(false); // Hlídá zobrazení info panelu o limitech
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState(''); // Zpráva o úspěchu/chybě
  const [editingChatId, setEditingChatId] = useState(null); // Který chat právě upravujeme
  const [chatToDelete, setChatToDelete] = useState(null); // ID chatu, který čeká na potvrzení smazání
  const [editTitle, setEditTitle] = useState(""); // Nový text názvu
  const [activeChatId, setActiveChatId] = useState(null); // ID aktuálně otevřeného chatu
  const [selectedFile, setSelectedFile] = useState(null); // Samotný fyzický soubor
  const [previewUrl, setPreviewUrl] = useState(null); // Rychlý náhled pro uživatele
  const fileInputRef = useRef(null); // Odkaz na neviditelné tlačítko pro výběr souboru
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Hlídá mobilní menu
  
  const profileWrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(event.target)) {
        setShowProfilePopup(false); // Zavřeme hlavní popup
        setShowLimits(false);       // Pro jistotu zavřeme i tabulku s limity
      }
    };

    if (showProfilePopup) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showProfilePopup]);

  // --- STAVY CHATU ---
  const defaultWelcomeMsg = { id: 1, sender: 'bot', text: text?.chat_welcome || "Ahoj! Jak ti mohu pomoci?", createdAt: new Date() };
  const [messages, setMessages] = useState([defaultWelcomeMsg]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const textareaRef = useRef(null);

  // --- 1. ZÍSKÁNÍ PŘIHLÁŠENÉHO UŽIVATELE A JEHO JMÉNA ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        
        // Vytáhneme jméno z naší tabulky profiles
        const { data: profile } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', session.user.id)
          .single();
          
        if (profile && profile.username) {
          setUserName(profile.username);
        } else {
          // Záloha, kdyby se jméno nenačetlo
          setUserName(session.user.user_metadata?.username || "Uživatel");
        }
      }
    };
    fetchUser();
  }, []); 

  const handleUpdatePassword = async () => {
    if (newPassword.length < 6) {
      setPasswordMsg("Heslo musí mít alespoň 6 znaků.");
      return;
    }
    
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    
    if (error) {
      setPasswordMsg(error.message);
    } else {
      setPasswordMsg("Heslo úspěšně změněno!");
      setTimeout(() => {
        setIsChangingPassword(false);
        setNewPassword('');
        setPasswordMsg('');
      }, 2000); // Po 2 vteřinách zavře políčko
    }
  };

  // --- FUNKCE PRO ODHLÁŠENÍ ---
  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/'); // Přesměrování na hlavní stránku (Hero)
  };

  // --- 2. NAČTENÍ HISTORIE CHATŮ (LEVY PANEL) ---
  useEffect(() => {
    if (!user) return; // Pokud není přihlášen, nic nenačítáme

    const loadChats = async () => {
      const { data, error } = await supabase
        .from('chats')
        .select('*')
        .order('updated_at', { ascending: false }); // Nejnovější nahoře
      
      if (data) setChatList(data);
      if (error) console.error("Chyba načítání chatů:", error);
    };

    loadChats();
  }, [user]);

  // --- 3. NAČTENÍ ZPRÁV PŘI KLIKNUTÍ NA CHAT ---
  useEffect(() => {
    if (!activeChatId) {
      // Pokud není vybrán chat (Nový chat), zobrazíme jen uvítací zprávu
      setMessages([defaultWelcomeMsg]);
      return;
    }

    const loadMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('chat_id', activeChatId)
        .order('created_at', { ascending: true }); // Od nejstarší po nejnovější
      
      if (data && data.length > 0) {
        // Převedeme formát z DB do formátu, který používá náš React state
        const formattedMessages = data.map(msg => ({
          id: msg.id,
          sender: msg.sender,
          text: msg.content,
          createdAt: new Date(msg.created_at)
        }));
        setMessages(formattedMessages);
      } else {
        setMessages([defaultWelcomeMsg]);
      }
      if (error) console.error("Chyba načítání zpráv:", error);
    };

    loadMessages();
  }, [activeChatId]); // Spustí se vždy, když se změní aktivní chat


  // --- POMOCNÉ FUNKCE (SCROLL, TEXTAREA, PARSOVÁNÍ) ---
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => { scrollToBottom(); }, [messages]);

  useEffect(() => {
    if (!isTyping) { setTimeout(() => { inputRef.current?.focus(); }, 10); }
  }, [isTyping]);

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; 
      textarea.style.height = `${Math.min(textarea.scrollHeight, 150)}px`;
    }
  };
  useEffect(() => { adjustTextareaHeight(); }, [inputValue]);

const prepareHistory = (currentMessages, currentModel) => {
    const prepared = currentMessages
      .filter(msg => msg.id !== 1 && msg.text.trim() !== '') 
      .map(msg => {
        const role = msg.sender === 'bot' ? 'assistant' : 'user';
        
        // Hledáme Markdown obrázek
        const imgRegex = /!\[.*?\]\((.*?)\)/;
        const match = msg.text.match(imgRegex);

        // Pokud to je zpráva od uživatele, našli jsme obrázek A model umí vidět
        if (role === 'user' && match && currentModel.supportsVision) {
          const imageUrl = match[1];
          const textWithoutImg = msg.text.replace(imgRegex, '').trim();

          return {
            role: role,
            content: [
              { type: "text", text: textWithoutImg || "Prosím, popiš detailně, co vidíš na tomto obrázku." },
              { type: "image_url", image_url: { url: imageUrl } }
            ]
          };
        }

        // Běžná textová zpráva
        return {
          role: role,
          content: msg.text
        };
      });

    // === LÉK NA SLEPOTU LLAMA MODELŮ ===
    // Pokud má model oči, přidáme mu na úplný začátek konverzace neviditelný příkaz
    if (currentModel.supportsVision) {
      prepared.unshift({
        role: "system",
        content: "You are a highly capable multimodal AI. You CAN see images and analyze them. Always describe and analyze any image provided to you in detail. Never say you cannot see images."
      });
    }

    // KONTROLA: Tímto se podíváme, jestli to děláme správně (zmáčkni F12 v prohlížeči)
    console.log("ODESÍLANÁ HISTORIE DO BACKENDU:", prepared);

    return prepared;
  };

  const renderMessageContent = (textMsg, sender) => {
    if (!textMsg) return null;
    
    const rawHtml = marked.parse(textMsg);
    const cleanHtml = DOMPurify.sanitize(rawHtml);
    
    return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} className="markdown-content" />;
  };

  // --- FUNKCE PRO PRÁCI S OBRÁZKY A KONTROLU HOSTŮ ---
  const handleAttachClick = (e) => {
    e.preventDefault();
    
    // Pokud uživatel není přihlášen, zablokujeme akci a ukážeme zprávu
    if (!user) {
      alert("Nahrávat obrázky mohou pouze přihlášení uživatelé. Prosím, přihlaste se nebo se zaregistrujte.");
      return;
    }

    // Pokud je přihlášen, spustíme standardní výběr souboru
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const imageLimitCheck = checkImageLimit();
    if (!imageLimitCheck.allowed) {
      const warningMsg = { 
        id: Date.now(), 
        sender: 'bot', 
        text: `🖼️ **Dosažen limit pro obrázky**\n\nVyčerpali jste svůj denní limit pro analýzu obrázků. Další obrázek můžete nahrát za **${imageLimitCheck.waitText}**.${!user ? '\n\n*Tip: Zaregistrujte se a získejte 5 obrázků denně místo 3!*' : ''}`, 
        createdAt: new Date() 
      };
      setMessages(prev => [...prev, warningMsg]);
      scrollToBottom();
      e.target.value = null; // Vyčistí input, aby nešel obrázek poslat
      return; // Zastaví funkci
    }

    // Bezpečnostní pojistka: max 5 MB
    if (file.size > 5 * 1024 * 1024) {
      alert("Obrázek je příliš velký. Maximální velikost je 5 MB.");
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file)); // Vytvoří bleskový náhled z disku
    e.target.value = null; // Vyresetuje input, aby šel vybrat stejný soubor znovu
  };

  const removeSelectedFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  // --- FUNKCE PRO KONTROLU LIMITŮ ---
  const checkRateLimit = (modelId) => {
    // Zjistíme, jestli je uživatel přihlášený (použijeme proměnnou 'user')
    const userType = user ? 'logged_in' : 'guest';
    const limit = RATE_LIMITS[userType][modelId];
    
    // Klíč, pod kterým si to pamatuje prohlížeč (např. "usage_guest_llama-3.3")
    const storageKey = `usage_${userType}_${modelId}`;

    // Načteme historii časů, kdy uživatel odeslal zprávu
    let usageHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    const now = Date.now();

    // Promažeme staré zprávy (necháme jen ty za posledních 30 minut)
    usageHistory = usageHistory.filter(timestamp => now - timestamp < LIMIT_WINDOW_MS);
    localStorage.setItem(storageKey, JSON.stringify(usageHistory));

    // Pokud je počet zpráv větší nebo roven limitu, nepustíme ho dál
    if (usageHistory.length >= limit) {
      const oldestMsg = usageHistory[0]; // Nejstarší zpráva z těch čerstvých
      const waitTimeMs = LIMIT_WINDOW_MS - (now - oldestMsg);
      const waitMinutes = Math.ceil(waitTimeMs / 60000); // Převod na minuty nahoru
      return { allowed: false, waitMinutes };
    }

    return { allowed: true };
  };
  

  const recordMessageUsage = (modelId) => {
    const userType = user ? 'logged_in' : 'guest';
    const storageKey = `usage_${userType}_${modelId}`;
    let usageHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    usageHistory.push(Date.now()); // Zápis aktuálního času
    localStorage.setItem(storageKey, JSON.stringify(usageHistory));
  };

  // --- FUNKCE PRO KONTROLU LIMITU OBRÁZKŮ ---
  const checkImageLimit = () => {
    const userType = user ? 'logged_in' : 'guest';
    const limit = IMAGE_LIMITS[userType];
    const storageKey = `image_usage_${userType}`;

    let usageHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    const now = Date.now();

    // Vyfiltrujeme jen obrázky poslané za posledních 24 hodin
    usageHistory = usageHistory.filter(timestamp => now - timestamp < DAY_IN_MS);
    localStorage.setItem(storageKey, JSON.stringify(usageHistory));

    // Pokud je dosažen limit, spočítáme čas do dalšího uvolnění
    if (usageHistory.length >= limit) {
      const oldestMsg = usageHistory[0];
      const waitTimeMs = DAY_IN_MS - (now - oldestMsg);
      const waitHours = Math.floor(waitTimeMs / (1000 * 60 * 60));
      const waitMinutes = Math.ceil((waitTimeMs % (1000 * 60 * 60)) / 60000);
      
      const waitText = waitHours > 0 ? `${waitHours}h a ${waitMinutes}m` : `${waitMinutes} minut`;
      
      return { allowed: false, waitText };
    }

    return { allowed: true };
  };

  const recordImageUsage = () => {
    const userType = user ? 'logged_in' : 'guest';
    const storageKey = `image_usage_${userType}`;
    let usageHistory = JSON.parse(localStorage.getItem(storageKey)) || [];
    usageHistory.push(Date.now());
    localStorage.setItem(storageKey, JSON.stringify(usageHistory));
  };

  // --- 4. HLAVNÍ LOGIKA: ODESLÁNÍ ZPRÁVY A UKLÁDÁNÍ DO DB ---
  const handleSend = async (e) => {
    if (e) e.preventDefault();
    
    // ZMĚNA: Dovolíme odeslat, pokud je zadán text NEBO je vybrán obrázek
    if ((!inputValue.trim() && !selectedFile) || isTyping) return;

    const limitCheck = checkRateLimit(selectedModel.id);
    if (!limitCheck.allowed) {
      // Místo otravného vyskakovacího okna pošleme uživateli hezkou zprávu přímo do chatu
      const warningMsg = { 
        id: Date.now(), 
        sender: 'bot', 
        text: `**Dosažen limit zpráv**\n\nVyčerpali jste limit pro model **${selectedModel.name}**. Můžete poslat další zprávu za **${limitCheck.waitMinutes} minut**, nebo vlevo dole přepnout na jiný model.${!user ? '\n\n*Tip: Přihlášení uživatelé mají limity dvojnásobné!*' : ''}`, 
        createdAt: new Date() 
      };
      setMessages(prev => [...prev, warningMsg]);
      scrollToBottom();
      return; // Zastavíme odesílání
    }

    const userText = inputValue;
    setInputValue("");
    setIsTyping(true); // Zamkne pole během nahrávání
    if (inputRef.current) inputRef.current.style.height = 'auto';

    let currentChatId = activeChatId;
    let finalMessageContent = userText; // V základu je zpráva jen text

    // === NOVÉ: NAHRÁNÍ OBRÁZKU DO SUPABASE ===
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop();
      // Vytvoříme unikátní název (např. 167890123-abc.jpg)
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      // 1. Nahrání fyzického souboru do našeho nového bucketu
      const { error: uploadError } = await supabase.storage
        .from('chat-images')
        .upload(fileName, selectedFile);

      if (uploadError) {
        console.error("Chyba nahrávání obrázku:", uploadError);
        alert("Obrázek se nepodařilo nahrát.");
        setIsTyping(false);
        return; // Zastavíme odesílání
      }

      // 2. Získání veřejné URL adresy obrázku
      const { data: publicUrlData } = supabase.storage
        .from('chat-images')
        .getPublicUrl(fileName);

      const imageUrl = publicUrlData.publicUrl;

      // 3. Přidáme obrázek na konec textu ve formátu Markdown (![popis](url))
      finalMessageContent = userText.trim() 
        ? `${userText}\n\n![Příloha](${imageUrl})` 
        : `![Příloha](${imageUrl})`;
      
      recordImageUsage();

      // Úklid po úspěšném nahrání
      removeSelectedFile();
    }

    // A) Založení nového chatu v DB, pokud píšeme první zprávu
    if (!currentChatId && user) {
      // ZMĚNA: Pokud je zpráva jen obrázek, nazveme chat "Obrázek"
      const titleText = userText.trim() ? userText : "Obrázek";
      const title = titleText.length > 30 ? titleText.substring(0, 30) + '...' : titleText;
      
      const { data: newChat, error: chatError } = await supabase
        .from('chats')
        .insert({ user_id: user.id, title: title })
        .select()
        .single();
      
      if (newChat) {
        currentChatId = newChat.id;
        setActiveChatId(currentChatId);
        // Přidáme nový chat hned na začátek seznamu v postranním panelu
        setChatList(prev => [newChat, ...prev]);

        await supabase.from('messages').insert({
          chat_id: currentChatId,
          sender: 'bot',
          content: messages[0].text // Uvítací zpráva
        });

      } else {
        console.error("Chyba vytvoření chatu:", chatError);
      }
    }

    // B) Uložení uživatelovy zprávy do DB (pokud je přihlášen)
    if (currentChatId && user) {
      await supabase.from('messages').insert({
        chat_id: currentChatId,
        sender: 'user',
        content: finalMessageContent
      });
    }

    // C) Okamžitá aktualizace UI pro uživatele
    const newUserMsg = { id: Date.now(), sender: 'user', text: finalMessageContent, createdAt: new Date() };
    const historyToSend = [...messages, newUserMsg]; 
    setMessages(historyToSend);

    const botMsgId = Date.now() + 1;
    const initialBotMsg = { id: botMsgId, sender: 'bot', text: "", createdAt: new Date() };
    setMessages(prev => [...prev, initialBotMsg]);

    let fullResponse = "";

    try {
      recordMessageUsage(selectedModel.id);
      // 2. Komunikace s backendem (API)
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          history: prepareHistory(historyToSend, selectedModel),
          modelId: selectedModel.id
        })
      });

      if (response.status === 429) {
        throw new Error("Ochranný systém serveru: Příliš mnoho požadavků. Chvíli počkejte.");
      }

      if (!response.ok) {
        throw new Error(`Chyba serveru: ${response.status}`);
      }

      // Streamování odpovědi
      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullResponse += chunk;
        
        setMessages(prev => prev.map(msg => 
            msg.id === botMsgId ? { ...msg, text: fullResponse } : msg
        ));
        scrollToBottom();
      }

      // D) Uložení kompletní odpovědi BOTA do databáze (AŽ PO SKONČENÍ STREAMU)
      if (currentChatId && user) {
        await supabase.from('messages').insert({
          chat_id: currentChatId,
          sender: 'bot',
          content: fullResponse
        });
        
        // Aktualizujeme 'updated_at' u chatu, aby se v seznamu posunul nahoru
        await supabase.from('chats').update({ updated_at: new Date() }).eq('id', currentChatId);
      }

    } catch (error) {
      console.error("Chyba API:", error);
      setMessages(prev => prev.map(msg => 
          msg.id === botMsgId ? { ...msg, text: ` ${error.message}` } : msg
      ));
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

  // --- FUNKCE PRO ZALOŽENÍ NOVÉHO CHATU (TLAČÍTKO VLEVO) ---
  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([defaultWelcomeMsg]);
    setIsSidebarOpen(false);
  };

  // --- FUNKCE PRO SMAZÁNÍ CHATU ---
  // 1. Otevře potvrzovací okno
  const handleDeleteClick = (e, chatId) => {
    e.stopPropagation();
    setChatToDelete(chatId);
  };

  // 2. Provede samotné smazání (po potvrzení)
  const confirmDeleteChat = async () => {
    if (!chatToDelete) return;

    const { error } = await supabase.from('chats').delete().eq('id', chatToDelete);
    
    if (error) {
      console.error("Chyba při mazání chatu:", error);
    } else {
      setChatList(prev => prev.filter(c => c.id !== chatToDelete));
      if (activeChatId === chatToDelete) {
        setActiveChatId(null);
        setMessages([defaultWelcomeMsg]);
      }
    }
    setChatToDelete(null); // Zavře modal po smazání
  };

  // 3. Zruší mazání a zavře okno
  const cancelDelete = () => {
    setChatToDelete(null);
  };

  // --- FUNKCE PRO PŘEJMENOVÁNÍ CHATU ---
  const handleStartEdit = (e, chat) => {
    e.stopPropagation();
    setEditingChatId(chat.id);
    setEditTitle(chat.title);
  };

  const handleSaveEdit = async (chatId) => {
    // Pokud je název prázdný, neukládáme a zrušíme editaci
    if (!editTitle.trim()) {
      setEditingChatId(null);
      return;
    }

    // Uložení do Supabase
    const { error } = await supabase
      .from('chats')
      .update({ title: editTitle.trim() })
      .eq('id', chatId);

    if (error) {
      console.error("Chyba při přejmenování chatu:", error);
    } else {
      // Aktualizace názvu v levém panelu v Reactu
      setChatList(prev => prev.map(c => 
        c.id === chatId ? { ...c, title: editTitle.trim() } : c
      ));
    }
    setEditingChatId(null); // Ukončení editace
  };

  // Obsluha kláves Enter (uložit) a Escape (zrušit) při psaní názvu
  const handleEditKeyDown = (e, chatId) => {
    if (e.key === 'Enter') handleSaveEdit(chatId);
    if (e.key === 'Escape') setEditingChatId(null);
  };

  // --- RENDEROVÁNÍ (HTML) ---
  return (
    <div className="app-layout">
      <Helmet>
        <title>Chat s AI | JuNoMi</title>
      </Helmet>

      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      {/* === LEVÝ PANEL (SIDEBAR) === */}
      <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <button className="new-chat-btn" onClick={handleNewChat}>
          <span>+</span> Nový chat
        </button>

        <div className="history-list">
          <div className="history-group">Tvoje konverzace</div>
          
          {/* DYNAMICKÉ VYKRESLOVÁNÍ CHATŮ Z DATABÁZE */}
          {chatList.length === 0 ? (
            <div style={{padding: '10px 15px', fontSize: '0.85rem', color: 'gray'}}>Zatím tu nic není.</div>
          ) : (
            chatList.map((chat) => (
              <div 
                key={chat.id} 
                className={`history-item ${activeChatId === chat.id ? 'active' : ''}`}
                onClick={() => {
                  setActiveChatId(chat.id);
                  setIsSidebarOpen(false);
                }}
              >
                {/* --- 1. NÁZEV NEBO INPUT PRO ÚPRAVU --- */}
                {editingChatId === chat.id ? (
                  <input
                    type="text"
                    className="history-title-input"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onBlur={() => handleSaveEdit(chat.id)} // Uloží se i když uživatel klikne jinam
                    onKeyDown={(e) => handleEditKeyDown(e, chat.id)}
                    autoFocus
                    onClick={(e) => e.stopPropagation()} // Aby se při psaní nepřepínal chat
                  />
                ) : (
                  <span className="history-title">{chat.title}</span>
                )}

                {/* --- 2. AKČNÍ TLAČÍTKA (Tužka a Popelnice) --- */}
                {/* Ukážou se jen ve chvíli, kdy chat zrovna nepřejmenováváme */}
                {editingChatId !== chat.id && (
                  <div className="history-actions">
                    <button title="Upravit" onClick={(e) => handleStartEdit(e, chat)}>✎</button>
                    <button title="Smazat" onClick={(e) => handleDeleteClick(e, chat.id)}>🗑️</button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        
        <div className="sidebar-footer">
          
          <div ref={profileWrapperRef} style={{ position: 'relative', width: '100%' }}>

            {/* === VYSKAKOVACÍ OKNO (POPUP) - Odemčeno pro všechny === */}
            {showProfilePopup && (
              <div className="user-popup">
                
                {/* === HLAVIČKA S EMAILEM/TITULEM A INFO IKONOU === */}
                <div className="user-popup-header">
                  <div className="user-popup-email">
                    {user ? user.email : 'Nastavení účtu'}
                  </div>
                  <button 
                    className={`info-limit-btn ${showLimits ? 'active' : ''}`} 
                    onClick={(e) => {
                      e.stopPropagation(); // Pojistka, aby se nezavřel celý popup
                      setShowLimits(!showLimits);
                    }}
                    title="Informace o limitech"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                  </button>
                </div>

                {/* === ROZBALOVACÍ PANEL S LIMITY (Obsah zůstává stejný) === */}
                {showLimits && (
                  <div className="limits-info-box">
                    <h4>Vaše limity (na 30 min)</h4>
                    <ul>
                      <li><span>LLaMA 3.3:</span> <b>{user ? '40' : '20'} zpráv</b></li>
                      <li><span>LLaMA 4 Scout:</span> <b>{user ? '15' : '5'} zpráv</b></li>
                      <li><span>GPT OSS (Pro):</span> <b>{user ? '30' : '15'} zpráv</b></li>
                      <li className="limit-img">
                        <span>Obrázky (24h):</span> 
                        <b>{user ? '5 ks' : <span style={{fontSize: '0.8em', color: '#ff4d4f'}}>Jen přihlášení</span>}</b>
                      </li>
                    </ul>
                    {!user && <p className="limit-tip">Tip: Přihlášením získáte až dvojnásobné limity!</p>}
                  </div>
                )}

                {/* === AKČNÍ TLAČÍTKA (Heslo / Odhlášení vs Přihlášení) === */}
                {user ? (
                  <>
                    {isChangingPassword ? (
                      <div className="password-change-section">
                        <input 
                          type="password" 
                          placeholder="Nové heslo" 
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="password-input-small"
                        />
                        {passwordMsg && <div style={{fontSize: '0.8rem', color: passwordMsg.includes('úspěšně') ? '#00d084' : '#ff4d4f', marginBottom: '8px'}}>{passwordMsg}</div>}
                        <div style={{display: 'flex', gap: '8px', marginBottom: '10px'}}>
                          <button className="btn-save-pwd" onClick={handleUpdatePassword}>Uložit</button>
                          <button className="btn-cancel-pwd" onClick={() => {setIsChangingPassword(false); setPasswordMsg('');}}>Zrušit</button>
                        </div>
                      </div>
                    ) : (
                      <button className="change-pwd-btn" onClick={() => setIsChangingPassword(true)}>
                        Změnit heslo
                      </button>
                    )}

                    <button className="logout-btn" onClick={handleLogout}>
                      Odhlásit se
                    </button>
                  </>
                ) : (
                  // TLAČÍTKO PRO HOSTA
                  <button 
                    className="login-btn-popup" 
                    onClick={() => navigate('/login')}
                    style={{ marginTop: '10px' }} // Drobný odstup
                  >
                    Přihlásit se
                  </button>
                )}
              </div>
            )}

            {/* === PROFIL UŽIVATELE (TLAČÍTKO DOLU) - Povoleno pro všechny === */}
            <div 
              className="user-profile" 
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              style={{ cursor: 'pointer' }} // Vždy kurzor ruky
            >
              <div className="avatar-small">
                {user ? userName.substring(0, 2).toUpperCase() : 'HO'}
              </div>
              <div className="user-info">
                <span className="user-name">{user ? userName : 'Host (Nepřihlášen)'}</span>
                {!user && <span className="user-status">Bez historie</span>}
              </div>
            </div>

          </div> 
        </div>
      </aside>

      {/* === HLAVNÍ CHAT === */}
      <main className="chat-main">
        <div className="chat-container">
          
          <div className="chat-header">
            <button className="mobile-menu-btn" onClick={() => setIsSidebarOpen(true)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <div className="bot-avatar">JU</div>
            <div className="chat-info">
              <h3>Junomi asistent</h3>
              <span className="status-dot" style={{ backgroundColor: isTyping ? '#eebb00' : '#00d084' }}></span> 
              <span style={{color: isTyping ? '#eebb00' : '#00d084'}}>
                {isTyping ? 'píše...' : 'Online'}
              </span>
            </div>
          </div>

          <div className="messages-area">
            {messages.map((msg, index) => {
              let showDateSeparator = false;
              
              if (index === 0) {
                if (messages.length > 1) {
                  showDateSeparator = true;
                }
              } else {
                const prevMsg = messages[index - 1];
                if (msg.createdAt && prevMsg.createdAt && msg.createdAt.toDateString() !== prevMsg.createdAt.toDateString()) {
                  showDateSeparator = true;
                }
              }

              return (
                <React.Fragment key={msg.id}>
                  {/* === ODDĚLOVAČ DATA === */}
                  {showDateSeparator && msg.createdAt && (
                    <div className="date-separator">
                      <span>{formatDateSeparator(msg.createdAt)}</span>
                    </div>
                  )}

                  {/* === SAMOTNÁ ZPRÁVA S ČASEM === */}
                  <div className={`message-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}>
                    {msg.sender === 'bot' && <div className="msg-avatar">JU</div>}
                    
                    <div className={`message-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                        {renderMessageContent(msg.text, msg.sender)}
                    </div>
                    <div className="message-time">
                        {formatMessageTime(msg.createdAt)}
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          <form className="input-area" onSubmit={handleSend}>
            <input 
              type="file" 
              accept="image/*" 
              style={{ display: 'none' }} 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />

            <div className="chat-input-wrapper">
              
              {/* --- LEVÁ ČÁST (Model + Sponka) --- */}
              <div className="input-tools-left">
                <select 
                  className="model-select-modern"
                  value={selectedModel.id}
                  onChange={(e) => {
                    const model = AVAILABLE_MODELS.find(m => m.id === e.target.value);
                    setSelectedModel(model);
                  }}
                  title="Vybrat AI model"
                >
                  {AVAILABLE_MODELS.map(m => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>

                {selectedModel.supportsVision && (
                  <button 
                    type="button" 
                    className="attach-btn" 
                    title="Připojit obrázek"
                    onClick={handleAttachClick} 
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"></path>
                    </svg>
                  </button>
                )}
              </div>

              {/* --- STŘEDNÍ ČÁST (Náhled obrázku + Textové pole) --- */}
              <div className="textarea-container">
                {previewUrl && (
                  <div className="image-preview-container">
                    <img src={previewUrl} alt="Náhled" className="image-preview-thumb" />
                    <button type="button" className="remove-image-btn" onClick={removeSelectedFile}>×</button>
                  </div>
                )}

                <textarea
                  ref={inputRef}
                  placeholder={isTyping ? "Nahrávám..." : (selectedModel.supportsVision ? "Napište zprávu nebo vložte obrázek..." : (text?.chat_placeholder || "Napište zprávu..."))}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  autoFocus
                  rows={1}
                  className="chat-textarea"
                />
              </div>
              
              {/* --- PRAVÁ ČÁST (Odesílací tlačítko) --- */}
              <button type="submit" className="send-btn" disabled={isTyping || (!inputValue.trim() && !selectedFile)}>
                <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path>
                </svg>
              </button>

            </div>
          </form>

        </div>
      </main>

      {/* === POPUP PRO POTVRZENÍ SMAZÁNÍ === */}
      {chatToDelete && (
        <div className="delete-modal-overlay">
          <div className="delete-modal-box">
            <h4>Smazat konverzaci?</h4>
            <p>Opravdu chcete tuto konverzaci smazat? Tato akce je nevratná.</p>
            <div className="delete-modal-actions">
              <button className="btn-cancel-delete" onClick={cancelDelete}>Zrušit</button>
              <button className="btn-confirm-delete" onClick={confirmDeleteChat}>Smazat</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;