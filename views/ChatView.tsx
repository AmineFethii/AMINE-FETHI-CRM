
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  MoreVertical, 
  Search, 
  CheckCheck, 
  MessageSquare, 
  Zap,
  Download,
  Archive,
  Star,
  Inbox,
  FileText,
  File as FileIcon
} from 'lucide-react';
import { translations, Language } from '../translations';
import { User, ClientData } from '../types';

interface Message {
  id: string;
  senderId: string;
  senderName: string;
  text?: string;
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
  attachment?: {
    name: string;
    url: string;
    type: string;
  };
}

interface Thread {
  clientId: string;
  clientName: string;
  messages: Message[];
  isPriority?: boolean;
  isArchived?: boolean;
}

interface ChatViewProps {
  lang: Language;
  user: User;
  clients: ClientData[];
}

export const ChatView: React.FC<ChatViewProps> = ({ lang, user, clients }) => {
  const [activeThreadId, setActiveThreadId] = useState<string>('');
  const [messageInput, setMessageInput] = useState('');
  const [threads, setThreads] = useState<Record<string, Thread>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [sidebarView, setSidebarView] = useState<'active' | 'archived'>('active');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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

  const handleSendMessage = (e?: React.FormEvent, attachment?: Message['attachment']) => {
    e?.preventDefault();
    if (!messageInput.trim() && !attachment || !activeThreadId) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      text: messageInput.trim() || undefined,
      timestamp: new Date().toISOString(),
      status: 'sent',
      attachment: attachment
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

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const type = file.type.startsWith('image/') ? 'image' : 'file';
      
      handleSendMessage(undefined, {
        name: file.name,
        url: result,
        type: type
      });
    };
    reader.readAsDataURL(file);
    
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
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

${messagesToExport.map(m => `[${new Date(m.timestamp).toLocaleString()}] ${m.senderName}: ${m.attachment ? `[FILE: ${m.attachment.name}]` : ''} ${m.text || ''}`).join('\n')}

=========================================
END OF EXPORT
=========================================
    `;

    try {
      const blob = new Blob([transcript], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const safeName = clientName.replace(/[^a-z0-9]/gi, '_');
      link.setAttribute('download', `Export_${safeName}_${new Date().toISOString().split('T')[0]}.txt`);
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Export failed:", err);
    }
    setIsMenuOpen(false);
  };

  const handleTogglePriority = () => {
    setThreads(prev => {
      const thread = prev[activeThreadId] || { clientId: activeThreadId, clientName: 'Unknown', messages: [] };
      return { ...prev, [activeThreadId]: { ...thread, isPriority: !thread.isPriority } };
    });
    setIsMenuOpen(false);
  };

  const handleArchiveThread = () => {
    setThreads(prev => {
      const thread = prev[activeThreadId] || { clientId: activeThreadId, clientName: 'Unknown', messages: [] };
      return { ...prev, [activeThreadId]: { ...thread, isArchived: !thread.isArchived } };
    });
    setIsMenuOpen(false);
  };

  const currentThread = threads[activeThreadId];
  const currentMessages = currentThread?.messages || [];

  return (
    <div className="h-[calc(100vh-140px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex animate-fade-in font-sans">
      
      {/* Sidebar List */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200 space-y-4 bg-white">
           <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">{t.title}</h2>
              {isAdmin && (
                <div className="flex items-center bg-slate-100 p-1 rounded-lg">
                   <button onClick={() => setSidebarView('active')} className={`p-1.5 rounded-md transition-all ${sidebarView === 'active' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Inbox size={16} /></button>
                   <button onClick={() => setSidebarView('archived')} className={`p-1.5 rounded-md transition-all ${sidebarView === 'archived' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><Archive size={16} /></button>
                </div>
              )}
           </div>
           {isAdmin && (
             <div className="relative">
               <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
               <input type="text" placeholder={isAdmin ? "Search..." : t.searchPlaceholder} className={`w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`} />
             </div>
           )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {isAdmin ? (
            clients.filter(c => {
               const thread = threads[c.id];
               return sidebarView === 'active' ? !thread?.isArchived : thread?.isArchived;
            }).map(client => {
              const thread = threads[client.id];
              const lastMsg = thread?.messages?.slice(-1)[0];
              return (
                <div key={client.id} onClick={() => setActiveThreadId(client.id)} className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-white border-l-4 ${activeThreadId === client.id ? 'bg-white border-blue-600 shadow-sm' : 'border-transparent'} ${thread?.isPriority ? 'bg-amber-50/30' : ''}`}>
                  <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-300 flex-shrink-0">
                    {client.avatarUrl ? <img src={client.avatarUrl} className="w-full h-full object-cover" /> : client.companyName.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <h4 className={`text-sm font-bold truncate ${thread?.isPriority ? 'text-amber-700' : 'text-slate-900'}`}>{client.companyName}</h4>
                        {thread?.isPriority && <span className="flex-shrink-0 p-0.5 bg-amber-100 text-amber-600 rounded"><Star size={10} className="fill-amber-600" /></span>}
                      </div>
                      {lastMsg && <span className="text-[10px] text-slate-400">{new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                    </div>
                    <p className="text-xs text-slate-500 truncate">{lastMsg ? (lastMsg.attachment ? `📎 ${lastMsg.attachment.name}` : lastMsg.text) : client.name}</p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-4 flex items-center gap-3 cursor-pointer transition-colors bg-white border-l-4 border-blue-600 shadow-sm">
              <div className="relative flex-shrink-0">
                <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-blue-400 font-bold overflow-hidden border border-slate-700">A</div>
                <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white bg-green-500"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-bold truncate text-blue-900">Amine El Fethi</h4>
                <p className="text-xs text-slate-500 truncate">{t.consultant}</p>
              </div>
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
                {!isAdmin && <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white bg-green-500"></div>}
             </div>
             <div>
               <div className="flex items-center gap-2">
                 <h3 className="font-bold text-slate-900 leading-tight">
                   {isAdmin ? (clients.find(c => c.id === activeThreadId)?.companyName || 'Select Client') : 'Amine El Fethi'}
                 </h3>
                 {isAdmin && currentThread?.isPriority && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider flex items-center gap-1"><Star size={10} className="fill-amber-700" /> Priority</span>}
               </div>
               <div className="flex items-center gap-2 mt-0.5">
                  <span className="flex items-center gap-1 text-[10px] font-bold text-green-600 uppercase tracking-wider"><div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>{t.online}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200"></div>
                  <span className="flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase tracking-wider"><Zap size={10} className="fill-blue-600" />{t.repliesTime}</span>
               </div>
             </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative" ref={menuRef}>
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"><MoreVertical size={20} /></button>
              {isMenuOpen && (
                <div className={`absolute top-full mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden py-1 z-50 ${isRTL ? 'left-0' : 'right-0'} animate-fade-in-up`}>
                   {isAdmin && <button onClick={handleTogglePriority} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><Star size={16} className={currentThread?.isPriority ? "text-amber-500 fill-amber-500" : "text-slate-400"} />{currentThread?.isPriority ? "Remove Priority" : "Mark as Priority"}</button>}
                   <button onClick={handleExportChat} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><Download size={16} className="text-slate-400" />Export Chat</button>
                   {isAdmin && <button onClick={handleArchiveThread} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"><Archive size={16} className="text-slate-400" />{currentThread?.isArchived ? "Unarchive Conversation" : "Archive Conversation"}</button>}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: 'radial-gradient(#e2e8f0 1px, transparent 1px)', backgroundSize: '30px 30px' }}>
           
           {currentMessages.length > 0 ? (
             currentMessages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl p-1 shadow-sm relative ${msg.senderId === user.id ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'}`}>
                  
                  {/* Attachment Preview */}
                  {msg.attachment && (
                    <div className="mb-1">
                      {msg.attachment.type === 'image' ? (
                        <div className="rounded-xl overflow-hidden border border-white/20">
                          <img src={msg.attachment.url} alt={msg.attachment.name} className="max-w-full h-auto max-h-60 object-cover" />
                        </div>
                      ) : (
                        <div className={`flex items-center gap-3 p-3 rounded-xl border ${msg.senderId === user.id ? 'bg-white/10 border-white/20' : 'bg-slate-50 border-slate-100'}`}>
                           <div className={`p-2 rounded-lg ${msg.senderId === user.id ? 'bg-white/20 text-white' : 'bg-blue-100 text-blue-600'}`}>
                              {msg.attachment.name.toLowerCase().endsWith('.pdf') ? <FileText size={20} /> : <FileIcon size={20} />}
                           </div>
                           <div className="min-w-0">
                              <p className={`text-sm font-bold truncate ${msg.senderId === user.id ? 'text-white' : 'text-slate-900'}`}>{msg.attachment.name}</p>
                              <p className={`text-[10px] ${msg.senderId === user.id ? 'text-blue-200' : 'text-slate-400'}`}>Document Attachment</p>
                           </div>
                           <a href={msg.attachment.url} download={msg.attachment.name} className={`p-1.5 rounded-lg transition-colors ${msg.senderId === user.id ? 'hover:bg-white/20 text-white' : 'hover:bg-slate-200 text-slate-500'}`}>
                              <Download size={16} />
                           </a>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="px-4 py-2">
                    {isAdmin && msg.senderId !== user.id && <p className="text-[10px] font-bold text-blue-600 uppercase mb-1 tracking-wider">{msg.senderName}</p>}
                    {msg.text && <p className="text-sm leading-relaxed">{msg.text}</p>}
                    <div className={`flex items-center gap-1 justify-end mt-1 ${msg.senderId === user.id ? 'text-blue-200' : 'text-slate-400'}`}>
                      <span className="text-[10px]">{new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                      {msg.senderId === user.id && <CheckCheck size={12} />}
                    </div>
                  </div>
                </div>
              </div>
            ))
           ) : (
             <div className="h-full flex flex-col items-center justify-center text-slate-400 text-center">
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-sm"><MessageSquare size={32} className="opacity-20" /></div>
                <h3 className="font-bold text-slate-900">Start the conversation</h3>
                <p className="text-sm max-w-xs mt-2">Send a message to discuss legal procedures or business updates.</p>
             </div>
           )}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-slate-200 shadow-lg">
           <form onSubmit={handleSendMessage} className="flex items-center gap-3">
             <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept="image/*,.pdf,.doc,.docx" />
             <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors border border-slate-200">
               <Paperclip size={20} />
             </button>
             <div className="flex-1 relative">
               <input type="text" value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder={t.typeMessage} className={`w-full py-3 bg-slate-50 border border-slate-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 px-5 placeholder:text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`} />
             </div>
             <button type="submit" disabled={(!messageInput.trim()) || !activeThreadId} className={`p-3 rounded-full text-white shadow-lg transition-all ${messageInput.trim() && activeThreadId ? 'bg-blue-600 hover:bg-blue-700 hover:scale-105' : 'bg-slate-300 cursor-not-allowed'}`}>
               <Send size={20} className={isRTL ? "rotate-180" : ""} />
             </button>
           </form>
        </div>

      </div>
    </div>
  );
};
