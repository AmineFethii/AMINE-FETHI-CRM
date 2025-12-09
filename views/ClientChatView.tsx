
import React, { useState, useEffect, useRef } from 'react';
import { 
  Send, 
  Paperclip, 
  Smile, 
  MoreVertical, 
  Search, 
  Phone, 
  Video,
  Clock,
  Check,
  CheckCheck,
  MessageSquare
} from 'lucide-react';
import { translations, Language } from '../translations';

interface ClientChatViewProps {
  lang: Language;
}

interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  status: 'sent' | 'delivered' | 'read';
  type: 'text' | 'image' | 'file';
}

interface Contact {
  id: string;
  name: string;
  role: 'consultant' | 'support';
  avatarUrl?: string;
  status: 'online' | 'offline' | 'away';
  lastSeen?: string;
  unreadCount: number;
}

export const ClientChatView: React.FC<ClientChatViewProps> = ({ lang }) => {
  const [activeContactId, setActiveContactId] = useState<string>('c1');
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<Record<string, Message[]>>({
    'c1': [
      { id: 'm1', sender: 'agent', text: "Bonjour! Je suis Amine El Fethi. Comment puis-je vous aider aujourd'hui?", timestamp: new Date(Date.now() - 3600000), status: 'read', type: 'text' }
    ],
    'c2': [
      { id: 'm2', sender: 'agent', text: "Bienvenue au support client. Un membre de l'équipe vous répondra sous peu.", timestamp: new Date(Date.now() - 86400000), status: 'read', type: 'text' }
    ]
  });
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const t = translations[lang].chat;
  const isRTL = lang === 'ar';

  const contacts: Contact[] = [
    {
      id: 'c1',
      name: 'Amine El Fethi',
      role: 'consultant',
      status: 'online',
      unreadCount: 0,
      avatarUrl: '' // Use initial
    },
    {
      id: 'c2',
      name: 'Support Team',
      role: 'support',
      status: 'away',
      lastSeen: '10m ago',
      unreadCount: 2
    }
  ];

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const currentMessages = messages[activeContactId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, activeContactId]);

  const handleSendMessage = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: messageInput,
      timestamp: new Date(),
      status: 'sent',
      type: 'text'
    };

    setMessages(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));
    
    setMessageInput('');

    // Simulate Reply
    setTimeout(() => {
      const reply: Message = {
        id: `msg-rep-${Date.now()}`,
        sender: 'agent',
        text: activeContact.role === 'consultant' 
          ? "Merci pour votre message. Je regarde cela et je reviens vers vous rapidement." 
          : "Un agent a pris en charge votre demande.",
        timestamp: new Date(),
        status: 'sent',
        type: 'text'
      };
      setMessages(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), reply]
      }));
    }, 2000);
  };

  return (
    <div className="h-[calc(100vh-120px)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex animate-fade-in">
      
      {/* Sidebar List */}
      <div className="w-80 bg-slate-50 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
           <div className="relative">
             <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
             <input 
               type="text" 
               placeholder={t.searchPlaceholder}
               className={`w-full py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400 ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
             />
           </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {contacts.map(contact => (
            <div 
              key={contact.id}
              onClick={() => setActiveContactId(contact.id)}
              className={`p-4 flex items-center gap-3 cursor-pointer transition-colors hover:bg-white ${
                activeContactId === contact.id ? 'bg-white border-l-4 border-blue-600 shadow-sm' : 'border-l-4 border-transparent'
              }`}
            >
              <div className="relative">
                <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden border border-slate-300">
                  {contact.avatarUrl ? <img src={contact.avatarUrl} className="w-full h-full object-cover" /> : contact.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                  contact.status === 'online' ? 'bg-green-500' : 'bg-amber-500'
                }`}></div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h4 className={`text-sm font-bold truncate ${activeContactId === contact.id ? 'text-blue-900' : 'text-slate-900'}`}>
                    {contact.name}
                  </h4>
                  <span className="text-[10px] text-slate-400">12:30</span>
                </div>
                <p className="text-xs text-slate-500 truncate">
                  {contact.role === 'consultant' ? t.consultant : t.supportTeam}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#f0f2f5]">
        
        {/* Chat Header */}
        <div className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 shadow-sm z-10">
          <div className="flex items-center gap-3">
             <div className="relative">
                <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold border border-slate-300">
                  {activeContact.name.charAt(0)}
                </div>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${
                  activeContact.status === 'online' ? 'bg-green-500' : 'bg-amber-500'
                }`}></div>
             </div>
             <div>
               <h3 className="font-bold text-slate-900 leading-tight">{activeContact.name}</h3>
               <p className="text-xs text-slate-500 flex items-center gap-1">
                 {activeContact.status === 'online' ? t.online : `${t.lastSeen} ${activeContact.lastSeen}`}
                 {activeContact.status !== 'online' && <span className="w-1 h-1 rounded-full bg-slate-300 mx-1"></span>}
                 <span className="text-blue-600">{t.repliesTime}</span>
               </p>
             </div>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Phone size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><Video size={20} /></button>
            <button className="p-2 hover:bg-slate-100 rounded-full transition-colors"><MoreVertical size={20} /></button>
          </div>
        </div>

        {/* Messages Feed */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
           <div className="flex justify-center mb-4">
             <span className="bg-slate-200 text-slate-500 text-[10px] px-3 py-1 rounded-full uppercase font-bold tracking-wider shadow-sm">Today</span>
           </div>
           
           {currentMessages.map((msg) => (
             <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm relative ${
                 msg.sender === 'user' 
                   ? 'bg-blue-600 text-white rounded-br-none' 
                   : 'bg-white text-slate-800 rounded-bl-none border border-slate-100'
               }`}>
                 <p className="text-sm leading-relaxed">{msg.text}</p>
                 <div className={`flex items-center gap-1 justify-end mt-1 ${msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'}`}>
                   <span className="text-[10px]">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                   {msg.sender === 'user' && (
                     <span>
                       {msg.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />}
                     </span>
                   )}
                 </div>
               </div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="bg-white p-4 border-t border-slate-200">
           <form onSubmit={handleSendMessage} className="flex items-center gap-3">
             <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
               <Paperclip size={20} />
             </button>
             <div className="flex-1 relative">
               <input 
                 type="text" 
                 value={messageInput}
                 onChange={(e) => setMessageInput(e.target.value)}
                 placeholder={t.typeMessage}
                 className={`w-full py-3 bg-slate-100 border-none rounded-full focus:outline-none focus:ring-2 focus:ring-blue-100 px-5 placeholder:text-slate-400 ${isRTL ? 'text-right' : 'text-left'}`}
               />
               <button type="button" className={`absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 ${isRTL ? 'left-3' : 'right-3'}`}>
                 <Smile size={20} />
               </button>
             </div>
             <button 
               type="submit" 
               disabled={!messageInput.trim()}
               className={`p-3 rounded-full text-white shadow-lg transition-all ${
                 messageInput.trim() 
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
