
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
  User
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
  const [showPassword, setShowPassword] = useState(false);
  
  // Add Client Modal State
  const [isAddClientModalOpen, setIsAddClientModalOpen] = useState(false);
  const [newClientData, setNewClientData] = useState({
    name: '',
    email: '',
    companyName: '',
    companyCategory: 'Services'
  });
  
  const t = translations[lang].clientAccess;
  const commonT = translations[lang].common;
  const isRTL = lang === 'ar';

  // Mock status logic (randomly assign status for demo purposes if not present)
  // In a real app, this would come from the backend user object
  const getClientStatus = (client: ClientData) => {
    // Deterministic mock status based on ID char code to keep it consistent
    const code = client.id.charCodeAt(client.id.length - 1);
    if (code % 3 === 0) return 'inactive';
    return 'active';
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

  const activeCount = clients.filter(c => getClientStatus(c) === 'active').length;

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
    setShowPassword(false);
  };

  const handleCreateAccess = () => {
    if (modal.client) {
        onUpdateCredentials(modal.client.email, modal.generatedPass);
    }
    // Simulate API call
    setTimeout(() => {
      setModal(prev => ({ ...prev, step: 'success' }));
    }, 800);
  };

  const handleAddNewClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClientData.name && newClientData.email && newClientData.companyName) {
      // Added missionStartDate to satisfy ClientData type requirement
      const newClient: ClientData = {
        id: `c-${Date.now()}`,
        email: newClientData.email,
        name: newClientData.name,
        companyName: newClientData.companyName,
        companyCategory: newClientData.companyCategory,
        serviceType: 'Consulting', // Default
        progress: 0,
        statusMessage: 'Onboarding',
        timeline: [
          { id: 't1', label: 'Onboarding', status: 'in-progress' }
        ],
        documents: [],
        notifications: [],
        contractValue: 0,
        amountPaid: 0,
        currency: 'MAD',
        paymentStatus: 'pending',
        missionStartDate: new Date().toISOString()
      };
      
      onAddClient(newClient);
      setIsAddClientModalOpen(false);
      setNewClientData({ name: '', email: '', companyName: '', companyCategory: 'Services' });
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsAddClientModalOpen(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-slate-900/20 transition-all hover:-translate-y-0.5"
          >
            <Plus size={18} />
            {t.addNewClient}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-blue-300 transition-colors">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <Key size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalAccounts}</p>
            <h3 className="text-2xl font-bold text-slate-900">{clients.length}</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-green-300 transition-colors">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
            <Shield size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.activeAccess}</p>
            <h3 className="text-2xl font-bold text-slate-900">{activeCount}</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-amber-300 transition-colors">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Mail size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.pendingInvites}</p>
            <h3 className="text-2xl font-bold text-slate-900">{clients.length - activeCount}</h3>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {/* Toolbar */}
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

        {/* List */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
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
                return (
                  <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden">
                           {client.avatarUrl ? <img src={client.avatarUrl} className="w-full h-full object-cover" /> : client.companyName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{client.companyName}</p>
                          <p className="text-xs text-slate-500">{client.name}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-slate-600">
                      {client.email}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border uppercase ${
                        status === 'active' 
                          ? 'bg-green-50 text-green-700 border-green-200' 
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}>
                        {status === 'active' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                        {t[status]}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-400 font-mono">
                      {status === 'active' ? '2 hours ago' : 'Never'}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <button 
                        onClick={() => handleOpenModal(client)}
                        className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 text-xs font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-colors shadow-sm"
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

      {/* GENERATE ACCESS MODAL */}
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
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t.email}</label>
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
                        <label className="block text-sm font-bold text-slate-700">{t.password}</label>
                        <button 
                          onClick={() => setModal(prev => ({...prev, generatedPass: generatePassword()}))}
                          className="text-xs flex items-center gap-1 text-blue-600 font-bold hover:text-blue-700"
                        >
                          <RefreshCw size={12} /> {t.generateRandom}
                        </button>
                     </div>
                     <div className="relative">
                       <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                       <input 
                          type={showPassword ? "text" : "password"}
                          value={modal.generatedPass}
                          onChange={(e) => setModal(prev => ({...prev, generatedPass: e.target.value}))}
                          className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl font-mono text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                       />
                       <button 
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                       >
                         {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                       </button>
                     </div>
                     <div className="mt-2 flex gap-2">
                        <span className="h-1 flex-1 bg-green-500 rounded-full"></span>
                        <span className="h-1 flex-1 bg-green-500 rounded-full"></span>
                        <span className="h-1 flex-1 bg-green-500 rounded-full"></span>
                        <span className="h-1 flex-1 bg-slate-200 rounded-full"></span>
                     </div>
                     <p className="text-xs text-green-600 mt-1 font-medium">{t.strongPass}</p>
                  </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex gap-3">
                  <button 
                    onClick={() => setModal({ ...modal, isOpen: false })}
                    className="flex-1 py-2.5 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-100 transition-colors"
                  >
                    {commonT.cancel}
                  </button>
                  <button 
                    onClick={handleCreateAccess}
                    className="flex-1 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    {t.createAndSend}
                  </button>
                </div>
              </>
            ) : (
              // SUCCESS STATE
              <div className="p-8 text-center">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.accessGranted}</h3>
                <p className="text-slate-500 mb-8">{t.credentialsSent} <span className="font-bold text-slate-800">{modal.client.email}</span></p>
                
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 text-left">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Temporary Password</p>
                  <div className="flex justify-between items-center bg-white p-3 rounded-lg border border-slate-200">
                    <code className="text-lg font-mono text-slate-900">{modal.generatedPass}</code>
                    <button 
                      onClick={() => copyToClipboard(modal.generatedPass)}
                      className="text-slate-400 hover:text-blue-600"
                      title="Copy"
                    >
                      <Copy size={18} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => setModal({ ...modal, isOpen: false })}
                  className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                >
                  {t.close}
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ADD NEW CLIENT MODAL */}
      {isAddClientModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsAddClientModalOpen(false)}></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">{t.addNewClient}</h3>
              <button onClick={() => setIsAddClientModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={20} />
              </button>
            </div>
            
            <form onSubmit={handleAddNewClient} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.clientName}</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={newClientData.name}
                    onChange={(e) => setNewClientData({...newClientData, name: e.target.value})}
                    placeholder="Full Name"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.companyName}</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="text" 
                    required
                    value={newClientData.companyName}
                    onChange={(e) => setNewClientData({...newClientData, companyName: e.target.value})}
                    placeholder="Company Name SARL"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{t.email}</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input 
                    type="email" 
                    required
                    value={newClientData.email}
                    onChange={(e) => setNewClientData({...newClientData, email: e.target.value})}
                    placeholder="client@company.com"
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                <select 
                  value={newClientData.companyCategory}
                  onChange={(e) => setNewClientData({...newClientData, companyCategory: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Services">Services</option>
                  <option value="IT Services">IT Services</option>
                  <option value="Consulting">Consulting</option>
                  <option value="Import/Export">Import/Export</option>
                  <option value="Retail">Retail</option>
                  <option value="Construction">Construction</option>
                </select>
              </div>

              <div className="pt-4 flex gap-3">
                 <button 
                  type="button"
                  onClick={() => setIsAddClientModalOpen(false)}
                  className="flex-1 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50"
                 >
                   {commonT.cancel}
                 </button>
                 <button 
                  type="submit"
                  className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 flex items-center justify-center gap-2"
                 >
                   <Plus size={18} /> {t.addNewClient}
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
