
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
  Activity
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
    for (let i = 0; i < 12; i++) {
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
    <div className="space-y-8 animate-fade-in relative pb-12">
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              setNewClientData(prev => ({ ...prev, password: generatePassword() }));
              setIsAddClientModalOpen(true);
            }}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} />
            {t.addNewClient}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-blue-300 transition-colors">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Key size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.totalAccounts}</p>
            <h3 className="text-2xl font-bold text-slate-900">{clients.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-green-300 transition-colors">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.activeUsers}</p>
            <h3 className="text-2xl font-bold text-slate-900">{clients.filter(c => isUserOnline(c.lastLogin)).length}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-amber-300 transition-colors">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Audit Result</p>
            <h3 className="text-2xl font-bold text-slate-900">{t.securityOptimal}</h3>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex gap-2">
            {(['all', 'active', 'inactive'] as const).map(status => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                  filterStatus === status 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {t[status] || status}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">{t.clientName}</th>
                <th className="px-6 py-4">{t.email}</th>
                <th className="px-6 py-4">{t.status}</th>
                <th className="px-6 py-4">{t.lastLogin}</th>
                <th className="px-6 py-4 text-right">{commonT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredClients.map(client => {
                const status = getClientStatus(client);
                const online = isUserOnline(client.lastLogin);
                return (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden shadow-sm">
                             {client.avatarUrl ? <img src={client.avatarUrl} className="w-full h-full object-cover" /> : client.companyName.charAt(0)}
                          </div>
                          {online && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></span>}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 leading-none">{client.companyName}</p>
                          <p className="text-[11px] text-slate-500 mt-1.5">{client.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide ${
                        status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {t[status]}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className={`text-xs font-bold ${online ? 'text-green-600' : 'text-slate-700'}`}>
                          {online ? 'Active Now' : formatLastLogin(client.lastLogin)}
                        </span>
                        {client.lastLogin && !online && (
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(client.lastLogin).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => handleOpenModal(client)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm uppercase tracking-wider"
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

      {modal.isOpen && modal.client && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setModal({ ...modal, isOpen: false })}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            {modal.step === 'create' ? (
              <>
                <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                    <Key size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{t.createLogin}</h3>
                    <p className="text-sm text-slate-500">{t.createLoginSub} {modal.client.companyName}</p>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.email}</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input 
                        type="email" 
                        value={modal.client.email}
                        readOnly
                        className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 font-medium cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{t.password}</label>
                        <button 
                          onClick={() => setModal(prev => ({...prev, generatedPass: generatePassword()}))}
                          className="text-[10px] flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors uppercase tracking-wider"
                        >
                          <RefreshCw size={12} /> {t.generateRandom}
                        </button>
                     </div>
                     <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                          type={showNewPassword ? "text" : "password"}
                          value={modal.generatedPass}
                          onChange={(e) => setModal(prev => ({...prev, generatedPass: e.target.value}))}
                          className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                       <button 
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                       >
                         {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                     </div>
                     <p className="text-[10px] text-green-600 mt-2 font-bold uppercase tracking-wider">{t.strongPass}</p>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex gap-3">
                  <button onClick={() => setModal({ ...modal, isOpen: false })} className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors">{commonT.cancel}</button>
                  <button onClick={handleCreateAccess} className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]">
                    <Send size={18} /> {t.createAndSend}
                  </button>
                </div>
              </>
            ) : (
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce shadow-inner">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.accessGranted}</h3>
                <p className="text-slate-500 mb-8">{t.credentialsSent} <span className="font-bold text-slate-800">{modal.client.email}</span></p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-left">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Temporary Password</p>
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200 shadow-sm">
                    <code className="text-lg font-mono text-slate-900">{modal.generatedPass}</code>
                    <button onClick={() => copyToClipboard(modal.generatedPass)} className="text-slate-400 hover:text-blue-600 transition-colors"><Copy size={18} /></button>
                  </div>
                </div>
                <button onClick={() => setModal({ ...modal, isOpen: false })} className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all active:scale-[0.98]">{t.close}</button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* COMBINED ADD CLIENT MODAL */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={() => setIsAddClientModalOpen(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="text-xl font-bold text-slate-900">{t.addNewClient}</h3>
              <button onClick={() => setIsAddClientModalOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-all">
                <XCircle size={24} />
              </button>
            </div>
            <form onSubmit={handleAddNewClient} className="p-8 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.clientName}</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={newClientData.name} 
                    onChange={(e) => setNewClientData({...newClientData, name: e.target.value})} 
                    placeholder="Full Name" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.companyName}</label>
                <div className="relative group">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="text" 
                    required 
                    value={newClientData.companyName} 
                    onChange={(e) => setNewClientData({...newClientData, companyName: e.target.value})} 
                    placeholder="Company Name SARL" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">{t.email}</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type="email" 
                    required 
                    value={newClientData.email} 
                    onChange={(e) => setNewClientData({...newClientData, email: e.target.value})} 
                    placeholder="client@company.com" 
                    className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all" 
                  />
                </div>
              </div>
              
              {/* PASSWORD FIELD INTEGRATED */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest">{t.password}</label>
                  <button 
                    type="button"
                    onClick={() => setNewClientData(prev => ({ ...prev, password: generatePassword() }))}
                    className="text-[10px] flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700 transition-colors uppercase tracking-wider"
                  >
                    <RefreshCw size={12} /> {t.generateRandom}
                  </button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input 
                    type={showNewPassword ? "text" : "password"}
                    required
                    value={newClientData.password}
                    onChange={(e) => setNewClientData({...newClientData, password: e.target.value})}
                    placeholder="••••••••••••"
                    className="w-full pl-12 pr-12 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-slate-900 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 focus:bg-white transition-all"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {newClientData.password.length >= 10 && (
                  <p className="text-[10px] text-green-600 mt-2 font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 size={12} /> {t.strongPass}
                  </p>
                )}
              </div>

              <div className="pt-6 flex gap-4">
                 <button 
                  type="button" 
                  onClick={() => setIsAddClientModalOpen(false)} 
                  className="flex-1 py-4 bg-white border border-slate-200 text-slate-600 font-bold rounded-2xl hover:bg-slate-50 transition-all active:scale-[0.98]"
                 >
                  {commonT.cancel}
                 </button>
                 <button 
                  type="submit" 
                  className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 flex items-center justify-center gap-2 shadow-xl shadow-slate-900/20 transition-all active:scale-[0.98]"
                 >
                  <Plus size={20} /> {t.addNewClient}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
