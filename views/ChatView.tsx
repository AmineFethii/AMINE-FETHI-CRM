
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Search, 
  Clock, 
  Check, 
  CheckCheck, 
  MessageSquare, 
  Sparkles, 
  Loader2, 
  X, 
  BrainCircuit,
  Zap,
  ShieldCheck,
  Download,
  Archive,
  Star,
  Inbox,
  Filter
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { translations, Language } from '../translations';
import { User, ClientData } from '../types';

interface ChatViewProps {
  lang: Language;
  user: User;
  clients: ClientData[];
}

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface Thread {
  clientId: string;
  clientName: string;
  messages: Message[];
  isPriority?: boolean;
  isArchived?: boolean;
}

export const ChatView: React.FC<ChatViewProps> = ({ lang, user, clients }) => {
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [threads, setThreads] = useState<Record<string, Thread>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<'active' | 'archived'>('active');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].chat;
  const isAdmin = user.role === 'admin';
  const isRTL = lang === 'ar';

  // Load and persist threads
  useEffect(() => {
    const saved = localStorage.getItem('crm_chat_threads');
    if (saved) {
      try {
        setThreads(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse chat threads", e);
      }
    }
  }, []);

  useEffect(() => {
    if (Object.keys(threads).length > 0) {
      localStorage.setItem('crm_chat_threads', JSON.stringify(threads));
    }
  }, [threads]);

  // Click outside menu closer
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Set initial active thread
  useEffect(() => {
    if (isAdmin) {
      if (!activeThreadId && clients.length > 0) {
        setActiveThreadId(clients[0].id);
      }
    } else {
      setActiveThreadId(user.id);
    }
  }, [isAdmin, clients, user.id, activeThreadId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [threads, activeThreadId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim() || !activeThreadId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      text: messageInput,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setThreads(prev => {
      const existingThread = prev[activeThreadId];
      const thread: Thread = existingThread || {
        clientId: activeThreadId,
        clientName: isAdmin ? (clients.find(c => c.id === activeThreadId)?.companyName || 'Unknown') : user.name,
        messages: []
      };
      
      return {
        ...prev,
        [activeThreadId]: {
          ...thread,
          messages: [...(thread.messages || []), newMessage]
        }
      };
    });
    
    setMessageInput('');
  };

  // --- MENU ACTIONS ---
  const handleExportChat = () => {
    const thread = threads[activeThreadId];
    const clientName = thread?.clientName || (isAdmin ? clients.find(c => c.id === activeThreadId)?.companyName : "Amine El Fethi") || "Conversation";
    const messagesToExport = thread?.messages || [];

    if (messagesToExport.length === 0) {
      alert("This conversation has no messages to export.");
      setIsMenuOpen(false);
      return;
    }

    const transcript = `
=========================================
CHAT EXPORT: ${clientName}
Generated: ${new Date().toLocaleString()}
Portal: Amine El Fethi Business Solutions
=========================================

${messagesToExport.map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.senderName}: ${m.text}`).join('\n')}

=========================================
END OF EXPORT
=========================================
    `;

    try {
      const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Sanitize filename: replace spaces and non-alphanumeric with underscores
      const safeName = clientName.replace(/[^a-z0-9]/gi, '_');
      link.setAttribute('download', `Export_${safeName}_${new Date().toISOString().split('T')[0]}.txt`);
      
      document.body.appendChild(link);
      link.click();
      
      // Cleanup
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Export failed:", err);
      alert("Failed to export chat. Please try again.");
    }

    setIsMenuOpen(false);
  };

  const handleTogglePriority = () => {
    setThreads(prev => {
      const thread = prev[activeThreadId] || {
        clientId: activeThreadId,
        clientName: clients.find(c => c.id === activeThreadId)?.companyName || 'Unknown',
        messages: []
      };
      return {
        ...prev,
        [activeThreadId]: {
          ...thread,
          isPriority: !thread.isPriority
        }
      };
    });
    setIsMenuOpen(false);
  };

  const handleArchiveThread = () => {
    setThreads(prev => {
      const thread = prev[activeThreadId] || {
        clientId: activeThreadId,
        clientName: clients.find(c => c.id === activeThreadId)?.companyName || 'Unknown',
        messages: []
      };
      return {
        ...prev,
        [activeThreadId]: {
          ...thread,
          isArchived: !thread.isArchived
        }
      };
    });
    setIsMenuOpen(false);
  };

  // --- GEMINI THINKING MODE ANALYSIS ---
  const handleAnalyzeHistory = async () => {
    if (!activeThreadId || !threads[activeThreadId]) return;
    
    setIsAnalyzing(true);
    setAnalysisResult(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const currentThread = threads[activeThreadId];
      const historyText = (currentThread.messages || [])
        .slice(-20)
        .map(m => `${m.senderName}: ${m.text}`)
        .join('\n');

      const prompt = `You are a legal and business operations assistant. Analyze the following chat history between our consultant and the client "${currentThread.clientName}". 
      Identify:
      1. The core issue or request.
      2. The sentiment of the client.
      3. Suggested next steps for the consultant.
      
      Keep it professional and structured.
      
      Chat History:
      ${historyText}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt,
        config: {
          thinkingConfig: { thinkingBudget: 32768 }
        }
      });

      setAnalysisResult(response.text || "Could not generate analysis.");
    } catch (error) {
      console.error("AI Analysis Error:", error);
      setAnalysisResult("An error occurred during analysis. Please check your API configuration.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const currentThread = threads[activeThreadId];
  const currentMessages = currentThread?.messages || [];

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex animate-fade-in font-sans">
      
      {/* Sidebar List */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
        {/* Sidebar Header with Toggle */}
        <div className="p-4 border-b border-slate-200 space-y-4 bg-white">
           <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.title}</h2>
              {isAdmin && (
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                   <button 
                    onClick={() => setSidebarView('active')}
                    className={`p-1.5 rounded-md transition-all ${sidebarView === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Active Chats"
                   >
                     <Inbox size={16} />
                   </button>
                   <button 
                    onClick={() => setSidebarView('archived')}
                    className={`p-1.5 rounded-md transition-all ${sidebarView === 'archived' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                    title="Archived Chats"
                   >
                     <Archive size={16} />
                   </button>
                </div>
              )}
           </div>
           <div className="relative">
             <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
             <input 
               type="text" 
               placeholder={isAdmin ? "Search..." : t.searchPlaceholder}
               className={`w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isAdmin ? (
            // Admin sees clients filtered by active/archived
            clients.filter(c => {
               const thread = threads[c.id];
               return sidebarView === 'active' ? !thread?.isArchived : thread?.isArchived;
            }).map(client => {
              const thread = threads[client.id];
              const lastMsg = thread?.messages?.slice(-1)[0];
              const isPriority = thread?.isPriority;

              return (
                <div 
                  key={client.id}
                  onClick={() => setActiveThreadId(client.id)}
                  className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-white border-l-4 ${
                    activeThreadId === client.id ? 'bg-white border-blue-600 shadow-sm' : 'border-transparent'
                  } ${isPriority ? 'bg-amber-50/30' : ''}`}
                >
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-300 flex-shrink-0">
                    {client.avatarUrl ? <img src={client.avatarUrl} className="w-full h-full object-cover" /> : client.companyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${isPriority ? 'text-amber-700' : 'text-slate-900'}`}>{client.companyName}</h4>
                        {isPriority && (
                          <span className="flex-shrink-0 p-0.5 bg-amber-100 text-amber-600 rounded">
                            <Star size={10} className="fill-amber-600" />
                          </span>
                        )}
                      </div>
                      {lastMsg && <span className="text-[10px] text-slate-400">
                        {new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                      </span>}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{lastMsg ? lastMsg.text : client.name}</p>
                  </div>
                </div>
              );
            })
          ) : (
            // Client ONLY sees Amine El Fethi
            <div 
              className="p-4 flex items-center gap-3 cursor-pointer transition-colors bg-white border-l-4 border-blue-600 shadow-sm"
            >
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold overflow-hidden border border-slate-700">
                  A
                </div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate text-blue-900">Amine El Fethi</h4>
                <p className="text-xs text-slate-500 truncate">{t.consultant}</p>
              </div>
            </div>
          )}
          {isAdmin && clients.filter(c => sidebarView === 'active' ? !threads[c.id]?.isArchived : threads[c.id]?.isArchived).length === 0 && (
             <div className="p-8 text-center text-slate-400">
               <MessageSquare size={32} className="mx-auto mb-2 opacity-20" />
               <p className="text-sm">No {sidebarView} conversations found.</p>
             </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f8fafc]">
        
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-20">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-slate-500 font-bold border ${currentThread?.isPriority ? 'bg-amber-50 border-amber-200' : 'bg-slate-100 border-slate-200'}`}>
                  {isAdmin ? (clients.find(c => c.id === activeThreadId)?.companyName.charAt(0) || 'C') : 'A'}
                </div>
                {!isAdmin && (
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500"></div>
                )}
             </div>
             <div>
               <div className="flex items-center gap-2">
                 <h3 className="font-bold text-slate-900 leading-tight">
                   {isAdmin ? (clients.find(c => c.id === activeThreadId)?.companyName || 'Select Client') : 'Amine El Fethi'}
                 </h3>
                 {isAdmin && currentThread?.isPriority && (
                   <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1">
                     <Star size={10} className="fill-amber-700" /> Priority
                   </span>
                 )}
               </div>
               <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-wider">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
                    {t.online}
                  </span>
                  <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider">
                    <Zap size={10} className="fill-blue-600" />
                    {t.repliesTime}
                  </span>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <button 
                onClick={handleAnalyzeHistory}
                disabled={isAnalyzing || currentMessages.length === 0}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all text-xs font-bold shadow-lg shadow-blue-600/20 disabled:opacity-50 disabled:shadow-none transform active:scale-95"
              >
                {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : <BrainCircuit size={14} />}
                AI Analysis
              </button>
            )}
            <div className="h-6 w-px bg-slate-200 mx-1"></div>
            
            {/* DROPDOWN MENU */}
            <div className="relative" ref={menuRef}>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
              >
                <MoreVertical size={20} />
              </button>
              
              {isMenuOpen && (
                <div className={`absolute top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-1 z-50 ${isRTL ? 'left-0' : 'right-0'} animate-fade-in-up`}>
                   {isAdmin && (
                     <button 
                       onClick={handleTogglePriority}
                       className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                     >
                       <Star size={16} className={currentThread?.isPriority ? "text-amber-500 fill-amber-500" : "text-slate-400"} />
                       {currentThread?.isPriority ? "Remove Priority" : "Mark as Priority"}
                     </button>
                   )}
                   <button 
                     onClick={handleExportChat}
                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                   >
                     <Download size={16} className="text-slate-400" />
                     Export Chat
                   </button>
                   {isAdmin && (
                     <button 
                       onClick={handleArchiveThread}
                       className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                     >
                       <Archive size={16} className="text-slate-400" />
                       {currentThread?.isArchived ? "Unarchive Conversation" : "Archive Conversation"}
                     </button>
                   )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
           
           {/* AI Analysis Result Overlay */}
           {analysisResult && (
             <div className="bg-white border-2 border-blue-500 p-6 rounded-2xl shadow-xl mb-6 relative animate-scale-up overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                <button onClick={() => setAnalysisResult(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
                  <X size={18} />
                </button>
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Sparkles size={20} />
                  </div>
                  <h4 className="font-bold text-slate-900 text-lg">AI Case Intelligence</h4>
                </div>
                <div className="text-sm leading-relaxed text-slate-700 space-y-2 whitespace-pre-wrap">
                  {analysisResult}
                </div>
                <div className="mt-4 pt-4 border-t border-slate-100 text-[10px] uppercase font-bold tracking-widest text-slate-400 flex items-center gap-2">
                  <ShieldCheck size={12} className="text-blue-500" />
                  Powered by Gemini 3 Pro (Thinking Mode)
                </div>
             </div>
           )}

           {currentMessages.length > 0 ? (
             currentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm relative ${
                  msg.senderId === user.id 
                    ? 'bg-blue-600 text-white rounded-br-none' 
                    : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                }`}>
                  {isAdmin && msg.senderId !== user.id && (
                    <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 tracking-wider">{msg.senderName}</p>
                  )}
                  <p className="text-sm leading-relaxed">{msg.text}</p>
                  <div className={`flex items-center gap-1 justify-end mt-1 ${msg.senderId === user.id ? 'text-blue-200' : 'text-slate-400'}`}>
                    <span className="text-[10px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    {msg.senderId === user.id && <CheckCheck size={12} />}
                  </div>
                </div>
              </div>
            ))
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm">
                   <MessageSquare size={32} className="opacity-20" />
                </div>
                <h3 className="font-bold text-slate-900">Start the conversation</h3>
                <p className="text-sm max-w-xs mt-2">Send a message to discuss legal procedures or business updates.</p>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-slate-200 shadow-lg">
           <form onSubmit={handleSendMessage} className="flex items-center gap-3">
             <button type="button" className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
               <Paperclip size={20} />
             </button>
             <div className="flex-1 relative">
               <input 
                 type="text" 
                 value={messageInput}
                 onChange={(e) => setMessageInput(e.target.value)}
                 placeholder={t.typeMessage}
                 className={`w-full py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 px-5 placeholder:text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}
               />
               <button type="button" className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`}>
                 <Smile size={20} />
               </button>
             </div>
             <button 
               type="submit" 
               disabled={!messageInput.trim() || !activeThreadId}
               className={`p-3 rounded-full text-white shadow-lg transition-all ${
                 messageInput.trim() && activeThreadId
                   ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105' 
                   : 'bg-slate-300 cursor-not-allowed'
               }`}
             >
               <Send size={20} className={isRTL ? "rotate-180" : ""} />
             </button>
           </form>
        </div>

      </div>
    </div>
  );
};
