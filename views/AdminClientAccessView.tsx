
import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Mail, 
  Search, 
  CheckCircle2, 
  XCircle, 
  RefreshCw, 
  Copy, 
  Eye, 
  EyeOff, 
  Lock,
  UserCheck,
  MoreVertical,
  Send,
  Plus,
  Briefcase,
  User,
  Activity,
  X,
  Sparkles
} from 'lucide-react';
import { ClientData } from '../types';
import { translations, Language } from '../translations';

interface AdminClientAccessViewProps {
  clients: ClientData[];
  lang: Language;
  onAddClient: (client: ClientData) => void;
  onUpdateCredentials: (email: string, pass: string) => void;
}

interface CredentialModalState {
  isOpen: boolean;
  client: ClientData | null;
  generatedPass: string;
  step: 'create' | 'success';
}

export const AdminClientAccessView: React.FC<AdminClientAccessViewProps> = ({ clients, lang, onAddClient, onUpdateCredentials }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [modal, setModal] = useState<CredentialModalState>({
    isOpen: false,
    client: null,
    generatedPass: '',
    step: 'create'
  });
  
  // Combined Client/Auth Creation State
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    companyName: '',
    companyCategory: 'Services',
    password: ''
  });
  
  const t = translations[lang].clientAccess;
  const commonT = translations[lang].common;
  const isRTL = lang === 'ar';

  const formatLastLogin = (dateString?: string) => {
    if (!dateString) return 'Never';
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const isUserOnline = (dateString?: string) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const now = new Date();
    return (now.getTime() - date.getTime()) < 300000; // 5 minutes activity window
  };

  const getClientStatus = (client: ClientData) => {
    // In a real app, this would check if credentials exist in auth DB
    return client.id.includes('c-') ? 'active' : 'inactive';
  };

  const filteredClients = clients.filter(client => {
    const matchesSearch = 
      client.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const status = getClientStatus(client);
    const matchesFilter = filterStatus === 'all' || status === filterStatus;

    return matchesSearch && matchesFilter;
  });

  const generatePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
    let pass = "";
    for (let i = 0; i < 14; i++) {
      pass += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return pass;
  };

  const handleOpenModal = (client: ClientData) => {
    setModal({
      isOpen: true,
      client,
      generatedPass: generatePassword(),
      step: 'create'
    });
  };

  const handleCreateAccess = () => {
    if (modal.client) {
        onUpdateCredentials(modal.client.email, modal.generatedPass);
    }
    setTimeout(() => {
      setModal(prev => ({ ...prev, step: 'success' }));
    }, 800);
  };

  const handleAddNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientData.name && newClientData.email && newClientData.companyName && newClientData.password) {
      const newClient: ClientData = {
        id: `c-${Date.now()}`,
        email: newClientData.email,
        name: newClientData.name,
        companyName: newClientData.companyName,
        companyCategory: newClientData.companyCategory,
        serviceType: 'Consulting', 
        progress: 0,
        statusMessage: 'Onboarding',
        timeline: [{ id: 't1', label: 'Onboarding', status: 'in-progress' }],
        documents: [],
        notifications: [],
        contractValue: 0,
        amountPaid: 0,
        currency: 'MAD',
        paymentStatus: 'pending',
        missionStartDate: new Date().toISOString()
      };
      
      onAddClient(newClient);
      onUpdateCredentials(newClientData.email, newClientData.password);
      
      setIsAddClientModalOpen(false);
      setNewClientData({ name: '', email: '', companyName: '', companyCategory: 'Services', password: '' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-10 animate-fade-in relative pb-12 px-2">
      
      {/* Header Section - Modern High Fidelity */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#0F172A] tracking-tight">{t.title}</h1>
          <p className="text-slate-500 mt-2 text-lg">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => {
            setNewClientData(prev => ({ ...prev, password: generatePassword() }));
            setIsAddClientModalOpen(true);
          }}
          className="flex items-center gap-3 bg-[#0F172A] hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold shadow-[0_10px_20px_rgba(15,23,42,0.15)] transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={22} strokeWidth={2.5} />
          <span className="text-[15px]">{t.addNewClient}</span>
        </button>
      </div>

      {/* KPI Cards - Matching exact screenshot style */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Total Clients Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] flex items-center gap-6 hover:shadow-md transition-all duration-300">
          <div className="p-5 bg-blue-50 text-blue-600 rounded-2xl">
            <Key size={30} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t.totalAccounts}</p>
            <h3 className="text-4xl font-black text-[#0F172A]">{clients.length}</h3>
          </div>
        </div>
        
        {/* Active Users Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] flex items-center gap-6 hover:shadow-md transition-all duration-300">
          <div className="p-5 bg-green-50 text-green-600 rounded-2xl">
            <Activity size={30} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{t.activeUsers}</p>
            <h3 className="text-4xl font-black text-[#0F172A]">{clients.filter(c => isUserOnline(c.lastLogin)).length}</h3>
          </div>
        </div>

        {/* Audit Result Card */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_4px_6px_-2px_rgba(0,0,0,0.05)] flex items-center gap-6 hover:shadow-md transition-all duration-300">
          <div className="p-5 bg-amber-50 text-[#C2410C] rounded-2xl">
            <Shield size={30} />
          </div>
          <div>
            <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">AUDIT RESULT</p>
            <h3 className="text-[26px] font-black text-[#0F172A] leading-tight">{t.securityOptimal}</h3>
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col mt-4">
        <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-2 bg-white p-1.5 rounded-2xl border border-slate-200/60 shadow-sm">
            {(['all', 'active', 'inactive'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-7 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                  filterStatus === status 
                    ? 'bg-[#0F172A] text-white shadow-xl shadow-slate-900/10' 
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {t[status] || status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-96">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-5' : 'left-5'}`} size={20} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-4 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 shadow-sm placeholder:text-slate-400 ${isRTL ? 'pr-14 pl-6' : 'pl-14 pr-6'}`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-[11px] uppercase font-black tracking-[0.25em] border-b border-slate-100">
              <tr>
                <th className="px-10 py-6">{t.clientName}</th>
                <th className="px-10 py-6">{t.email}</th>
                <th className="px-10 py-6">{t.status}</th>
                <th className="px-10 py-6">{t.lastLogin}</th>
                <th className="px-10 py-6 text-right">{commonT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map(client => {
                const status = getClientStatus(client);
                const online = isUserOnline(client.lastLogin);
                return (
                  <tr key={client.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-5">
                        <div className="relative">
                          <div className="w-14 h-14 rounded-2xl bg-slate-100 border border-slate-200 flex items-center justify-center text-base font-black text-slate-500 overflow-hidden shadow-sm">
                             {client.avatarUrl ? <img src={client.avatarUrl} className="w-full h-full object-cover" /> : client.companyName.charAt(0)}
                          </div>
                          {online && <span className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-[4px] border-white shadow-sm"></span>}
                        </div>
                        <div>
                          <p className="font-black text-[#0F172A] text-[15px] leading-none">{client.companyName}</p>
                          <p className="text-xs text-slate-500 mt-2 font-bold">{client.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-sm font-bold text-slate-600">
                      {client.email}
                    </td>
                    <td className="px-10 py-6">
                      <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[10px] font-black border uppercase tracking-[0.15em] ${
                        status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200/50' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`}></div>
                        {t[status]}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className={`text-[13px] font-black ${online ? 'text-green-600' : 'text-[#0F172A]'}`}>
                          {online ? 'Active Now' : formatLastLogin(client.lastLogin)}
                        </span>
                        {client.lastLogin && !online && (
                          <span className="text-[11px] text-slate-400 font-mono mt-1 font-bold">
                            {new Date(client.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button 
                        onClick={() => handleOpenModal(client)}
                        className="px-6 py-2.5 bg-white border border-slate-200 text-[#0F172A] text-[11px] font-black rounded-[0.9rem] hover:bg-slate-900 hover:text-white hover:border-slate-900 transition-all shadow-sm uppercase tracking-[0.1em]"
                       >
                         {status === 'active' ? t.resetPassword : t.grantAccess}
                       </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ACCESS GRANTING / RESET PASSWORD MODAL */}
      {modal.isOpen && modal.client && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md" onClick={() => setModal({ ...modal, isOpen: false })}></div>
          <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up border border-white/20">
            {modal.step === 'create' ? (
              <>
                <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center gap-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-3xl flex items-center justify-center text-blue-600 shadow-inner">
                    <Key size={32} strokeWidth={2.5} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-[#0F172A]">{t.createLogin}</h3>
                    <p className="text-[15px] font-bold text-slate-500 mt-1">{t.createLoginSub} {modal.client.companyName}</p>
                  </div>
                </div>

                <div className="p-10 space-y-8">
                  <div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">{t.email}</label>
                    <div className="relative group">
                      <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={22} />
                      <input 
                        type="email" 
                        value={modal.client.email}
                        readOnly
                        className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] text-slate-600 font-black cursor-not-allowed outline-none text-base"
                      />
                    </div>
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-4 px-1">
                        <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">{t.password}</label>
                        <button 
                          onClick={() => setModal(prev => ({...prev, generatedPass: generatePassword()}))}
                          className="text-[11px] flex items-center gap-2 text-blue-600 font-black hover:text-blue-700 transition-colors uppercase tracking-widest"
                        >
                          <RefreshCw size={16} strokeWidth={3} /> {t.generateRandom}
                        </button>
                     </div>
                     <div className="relative group">
                       <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-blue-500 transition-colors" size={22} />
                       <input 
                          type={showNewPassword ? "text" : "password"}
                          value={modal.generatedPass}
                          onChange={(e) => setModal(prev => ({...prev, generatedPass: e.target.value}))}
                          className="w-full pl-14 pr-16 py-5 bg-white border border-slate-200 rounded-[1.5rem] font-mono font-black text-[#0F172A] focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-lg tracking-wider"
                       />
                       <button 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1"
                       >
                         {showNewPassword ? <EyeOff size={24} /> : <Eye size={24} />}
                       </button>
                     </div>
                     <p className="text-[11px] text-green-600 mt-4 font-black uppercase tracking-[0.15em] flex items-center gap-2 ml-1">
                       <CheckCircle2 size={16} strokeWidth={3} /> {t.strongPass}
                     </p>
                  </div>
                </div>

                <div className="p-10 border-t border-slate-100 bg-slate-50/30 flex gap-5">
                  <button onClick={() => setModal({ ...modal, isOpen: false })} className="flex-1 py-5 bg-white border border-slate-200 text-slate-600 font-black rounded-3xl hover:bg-slate-100 transition-all active:scale-95 text-base">{commonT.cancel}</button>
                  <button onClick={handleCreateAccess} className="flex-2 py-5 bg-blue-600 text-white font-black rounded-3xl hover:bg-blue-700 shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-3 transition-all active:scale-95 text-base">
                    <Send size={22} strokeWidth={2.5} /> {t.createAndSend}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-12 text-center">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 animate-bounce shadow-inner">
                  <CheckCircle2 size={48} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black text-[#0F172A] mb-3">{t.accessGranted}</h3>
                <p className="text-slate-500 mb-10 text-lg font-bold">{t.credentialsSent} <span className="text-[#0F172A]">{modal.client.email}</span></p>
                <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 mb-12 text-left">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4 ml-1">Temporary Password</p>
                  <div className="flex justify-between items-center bg-white p-5 rounded-[1.5rem] border border-slate-200 shadow-sm">
                    <code className="text-2xl font-mono font-black text-[#0F172A] tracking-wider">{modal.generatedPass}</code>
                    <button onClick={() => copyToClipboard(modal.generatedPass)} className="p-3 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"><Copy size={24} strokeWidth={2.5} /></button>
                  </div>
                </div>
                <button onClick={() => setModal({ ...modal, isOpen: false })} className="w-full py-5 bg-[#0F172A] text-white font-black rounded-3xl hover:bg-slate-800 shadow-2xl shadow-slate-900/30 transition-all active:scale-95 text-base">{t.close}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMBINED ADD CLIENT MODAL - HIGH FIDELITY REDESIGN */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl transition-opacity" onClick={() => setIsAddClientModalOpen(false)}></div>
          <div className="relative bg-white rounded-[3.5rem] shadow-2xl w-full max-w-xl overflow-hidden animate-scale-up border border-white/20">
            
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="p-4 bg-[#0F172A] text-white rounded-[1.75rem] shadow-2xl shadow-slate-900/30">
                  <Plus size={30} strokeWidth={3} />
                </div>
                <h3 className="text-3xl font-black text-[#0F172A] tracking-tight">{t.addNewClient}</h3>
              </div>
              <button 
                onClick={() => setIsAddClientModalOpen(false)} 
                className="p-3 text-slate-300 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-all active:scale-90"
              >
                <X size={32} strokeWidth={2.5} />
              </button>
            </div>

            <form onSubmit={handleAddNewClient} className="p-12 space-y-9 max-h-[80vh] overflow-y-auto">
              
              {/* Section 1: Client Profile */}
              <div className="space-y-7">
                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 ml-1">{t.clientName}</label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input 
                      type="text" 
                      required 
                      value={newClientData.name} 
                      onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} 
                      placeholder="Full Name" 
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-black text-[#0F172A] focus:outline-none focus:ring-[6px] focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:font-bold placeholder:text-slate-300 text-base" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 ml-1">{t.companyName}</label>
                  <div className="relative group">
                    <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input 
                      type="text" 
                      required 
                      value={newClientData.companyName} 
                      onChange={(e) => setNewClientData({...newClientData, companyName: e.target.value})} 
                      placeholder="Company Name SARL" 
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-black text-[#0F172A] focus:outline-none focus:ring-[6px] focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:font-bold placeholder:text-slate-300 text-base" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em] mb-4 ml-1">{t.email}</label>
                  <div className="relative group">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                    <input 
                      type="email" 
                      required 
                      value={newClientData.email} 
                      onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} 
                      placeholder="client@company.com" 
                      className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-black text-[#0F172A] focus:outline-none focus:ring-[6px] focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all placeholder:font-bold placeholder:text-slate-300 text-base" 
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Account Access Setup */}
              <div className="pt-10 border-t border-slate-100">
                <div className="flex justify-between items-center mb-5 px-1">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                      <Lock size={18} strokeWidth={2.5} />
                    </div>
                    <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Portal Security</label>
                  </div>
                  <button 
                    type="button"
                    onClick={() => setNewClientData(prev => ({ ...prev, password: generatePassword() }))}
                    className="text-[11px] flex items-center gap-2 text-blue-600 font-black hover:text-blue-700 transition-colors uppercase tracking-[0.15em] group"
                  >
                    <RefreshCw size={16} strokeWidth={3} className="group-active:animate-spin" /> {t.generateRandom}
                  </button>
                </div>
                
                <div className="relative group">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={24} />
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newClientData.password}
                    onChange={(e) => setNewClientData({...newClientData, password: e.target.value})}
                    placeholder="••••••••••••••••"
                    className="w-full pl-16 pr-16 py-5 bg-slate-50 border border-slate-200 rounded-[1.5rem] font-mono font-black text-[#0F172A] focus:outline-none focus:ring-[6px] focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all text-lg tracking-[0.3em]"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors p-1"
                  >
                    {showNewPassword ? <EyeOff size={26} strokeWidth={2.5} /> : <Eye size={26} strokeWidth={2.5} />}
                  </button>
                </div>
                
                {newClientData.password.length > 0 && (
                  <div className="mt-5 flex items-center justify-between px-2">
                    <div className="flex gap-2">
                       {[1,2,3,4,5].map((idx) => (
                         <div key={idx} className={`h-2 w-12 rounded-full transition-all duration-700 ${newClientData.password.length >= (idx * 2) ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.3)]' : 'bg-slate-200'}`}></div>
                       ))}
                    </div>
                    <span className="text-[11px] font-black text-green-600 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Sparkles size={16} fill="currentColor" /> Secure Key Ready
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-10 flex gap-5">
                 <button 
                  type="button" 
                  onClick={() => setIsAddClientModalOpen(false)} 
                  className="flex-1 py-6 bg-white border border-slate-200 text-slate-600 font-black rounded-3xl hover:bg-slate-50 transition-all active:scale-[0.98] text-base"
                 >
                  {commonT.cancel}
                 </button>
                 <button 
                  type="submit" 
                  className="flex-2 py-6 bg-[#0F172A] text-white font-black rounded-3xl hover:bg-slate-800 flex items-center justify-center gap-4 shadow-2xl shadow-slate-900/40 transition-all active:scale-[0.98] text-base"
                 >
                  <Plus size={26} strokeWidth={3} /> {t.addNewClient}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
