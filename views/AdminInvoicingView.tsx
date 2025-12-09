
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Plus, 
  Download, 
  Send, 
  MoreHorizontal, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Receipt,
  Sparkles,
  Loader2,
  X,
  Printer,
  ChevronDown
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ClientData } from '../types';
import { translations, Language } from '../translations';

interface AdminInvoicingViewProps {
  clients: ClientData[];
  lang: Language;
}

interface Invoice {
  id: string;
  number: string;
  clientId: string;
  clientName: string;
  companyName: string;
  date: string;
  dueDate: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue' | 'draft';
  items: { description: string; amount: number }[];
}

export const AdminInvoicingView: React.FC<AdminInvoicingViewProps> = ({ clients, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // AI State
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // New Invoice Form State
  const [newInvoice, setNewInvoice] = useState<{
    clientId: string;
    description: string;
    amount: string;
    dueDate: string;
  }>({
    clientId: '',
    description: '',
    amount: '',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  const t = translations[lang].invoicing;
  const commonT = translations[lang].common;
  const isRTL = lang === 'ar';

  // Mock Data Generation based on Clients
  const invoices: Invoice[] = useMemo(() => {
    let mocks: Invoice[] = [];
    clients.forEach((c, idx) => {
      // Paid Invoice
      if (c.amountPaid > 0) {
        mocks.push({
          id: `inv-${c.id}-1`,
          number: `INV-2023-${1000 + idx}`,
          clientId: c.id,
          clientName: c.name,
          companyName: c.companyName,
          date: '2023-10-01',
          dueDate: '2023-10-15',
          amount: c.amountPaid,
          status: 'paid',
          items: [{ description: `Consulting Services - ${c.serviceType}`, amount: c.amountPaid }]
        });
      }
      // Pending Invoice
      if (c.contractValue > c.amountPaid) {
        mocks.push({
          id: `inv-${c.id}-2`,
          number: `INV-2023-${2000 + idx}`,
          clientId: c.id,
          clientName: c.name,
          companyName: c.companyName,
          date: '2023-10-25',
          dueDate: '2023-11-10',
          amount: c.contractValue - c.amountPaid,
          status: 'pending',
          items: [{ description: `Remaining Balance - ${c.serviceType}`, amount: c.contractValue - c.amountPaid }]
        });
      }
    });
    // Add some random overdue/drafts
    mocks.push({
      id: 'inv-draft-1', number: 'DRAFT-001', clientId: 'c1', clientName: 'MPL Admin', companyName: 'MPL DIGITAL WORKS', 
      date: '2023-10-28', dueDate: '2023-11-12', amount: 5000, status: 'draft', 
      items: [{ description: 'Q4 Retainer', amount: 5000 }]
    });
    return mocks;
  }, [clients]);

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          inv.number.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || inv.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Stats
  const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalPaid = invoices.filter(i => i.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = invoices.filter(i => i.status === 'pending').reduce((sum, inv) => sum + inv.amount, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((sum, inv) => sum + inv.amount, 0);

  // --- GEMINI AI FUNCTION ---
  const handleGenerateDescription = async () => {
    if (!newInvoice.clientId) return;
    
    const client = clients.find(c => c.id === newInvoice.clientId);
    if (!client) return;

    setIsGeneratingAI(true);
    try {
      // Initialize Gemini
      // @ts-ignore
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      const prompt = `Write a professional, concise, single-sentence invoice line-item description for a client receiving '${client.serviceType}' services in the '${client.companyCategory}' industry. Do not include price.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      
      const text = response.text.trim();
      setNewInvoice(prev => ({ ...prev, description: text }));
    } catch (error) {
      console.error("AI Generation Error:", error);
      // Fallback
      setNewInvoice(prev => ({ ...prev, description: `${client.serviceType} Professional Services` }));
    } finally {
      setIsGeneratingAI(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5"
        >
          <Plus size={18} />
          {t.createInvoice}
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title={t.totalInvoiced} amount={totalInvoiced} icon={FileText} color="blue" />
        <KPICard title={t.paid} amount={totalPaid} icon={CheckCircle2} color="green" />
        <KPICard title={t.pending} amount={totalPending} icon={Clock} color="amber" />
        <KPICard title={t.overdue} amount={totalOverdue} icon={AlertCircle} color="red" />
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
        {/* Toolbar */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            {['all', 'paid', 'pending', 'overdue', 'draft'].map(status => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                  statusFilter === status 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'
                }`}
              >
                {status === 'all' ? commonT.all : t[status as keyof typeof t] || status}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-72">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
            <input 
              type="text" 
              placeholder={t.searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm placeholder:text-slate-400 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
            />
          </div>
        </div>

        {/* Invoice List */}
        <div className="flex-1 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">{t.invoiceNum}</th>
                <th className="px-6 py-4">{t.client}</th>
                <th className="px-6 py-4">{t.date}</th>
                <th className="px-6 py-4 text-right">{t.amount}</th>
                <th className="px-6 py-4 text-center">{commonT.status}</th>
                <th className="px-6 py-4 text-right">{commonT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredInvoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-medium text-slate-900">
                    <div className="flex items-center gap-2">
                       <FileText size={16} className="text-slate-400" />
                       {inv.number}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{inv.companyName}</p>
                    <p className="text-xs text-slate-500">{inv.clientName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    {new Date(inv.date).toLocaleDateString()}
                    <span className="block text-[10px] text-slate-400">Due: {new Date(inv.dueDate).toLocaleDateString()}</span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-slate-900">
                    {inv.amount.toLocaleString()} <span className="text-xs font-normal text-slate-500">MAD</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <StatusBadge status={inv.status} t={t} />
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Send">
                        <Send size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Download">
                        <Download size={16} />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    <Receipt size={48} className="mx-auto mb-3 opacity-10" />
                    <p>{t.noInvoices}</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm transition-opacity" onClick={() => setIsCreateModalOpen(false)}></div>
          
          <div className="relative bg-slate-100 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] flex overflow-hidden animate-scale-up">
            
            {/* Left: Form */}
            <div className="w-1/2 bg-white p-8 overflow-y-auto border-r border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                  <div className="p-2 bg-blue-600 rounded-lg text-white">
                    <Plus size={20} />
                  </div>
                  {t.newInvoice}
                </h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* Client Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{t.client}</label>
                  <div className="relative">
                    <select
                      value={newInvoice.clientId}
                      onChange={(e) => setNewInvoice({ ...newInvoice, clientId: e.target.value })}
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select a client...</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.companyName}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
                  </div>
                </div>

                {/* AI Description Generator */}
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                    <span>{t.description}</span>
                    <button 
                      onClick={handleGenerateDescription}
                      disabled={!newInvoice.clientId || isGeneratingAI}
                      className="text-xs flex items-center gap-1 text-purple-600 font-bold hover:text-purple-700 disabled:opacity-50 transition-colors"
                    >
                      {isGeneratingAI ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                      {t.aiGenerate}
                    </button>
                  </label>
                  <div className="relative group">
                    <textarea 
                      value={newInvoice.description}
                      onChange={(e) => setNewInvoice({ ...newInvoice, description: e.target.value })}
                      rows={3}
                      placeholder="e.g. Consultation Services for Q3..."
                      className={`w-full p-4 bg-slate-50 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none placeholder:text-slate-400 ${isGeneratingAI ? 'border-purple-300 bg-purple-50' : 'border-slate-200'}`}
                    />
                    {isGeneratingAI && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-[1px] rounded-xl">
                        <span className="text-purple-600 text-xs font-bold animate-pulse">Generating with Gemini...</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t.amount} (MAD)</label>
                    <input 
                      type="number" 
                      value={newInvoice.amount}
                      onChange={(e) => setNewInvoice({ ...newInvoice, amount: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono placeholder:text-slate-400"
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">{t.dueDate}</label>
                    <input 
                      type="date"
                      value={newInvoice.dueDate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, dueDate: e.target.value })} 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="pt-6 border-t border-slate-100 flex gap-4">
                  <button className="flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors">
                    Save Draft
                  </button>
                  <button className="flex-1 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                    Create & Send
                  </button>
                </div>

              </div>
            </div>

            {/* Right: Preview */}
            <div className="w-1/2 bg-slate-100 p-8 flex flex-col items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
               
               <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 z-10">Live Preview</div>
               
               {/* Paper Invoice UI */}
               <div className="bg-white w-full max-w-md shadow-2xl shadow-slate-400/20 rounded-lg overflow-hidden flex flex-col h-[500px] z-10 transition-all duration-500">
                  {/* Header Decoration */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-blue-500"></div>
                  
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-8">
                      <div>
                        <h1 className="text-xl font-bold text-slate-900">INVOICE</h1>
                        <p className="text-xs text-slate-500 mt-1">#INV-DRAFT</p>
                      </div>
                      <div className="text-right">
                        <div className="w-10 h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white font-bold mb-1 ml-auto">
                           A
                        </div>
                        <p className="text-[10px] text-slate-400">Amine El Fethi</p>
                      </div>
                    </div>

                    <div className="mb-8">
                       <p className="text-[10px] text-slate-400 uppercase font-bold mb-1">Bill To</p>
                       {newInvoice.clientId ? (
                         <div>
                            <p className="font-bold text-slate-800">{clients.find(c => c.id === newInvoice.clientId)?.companyName}</p>
                            <p className="text-xs text-slate-500">{clients.find(c => c.id === newInvoice.clientId)?.name}</p>
                         </div>
                       ) : (
                         <div className="h-8 w-32 bg-slate-100 rounded animate-pulse"></div>
                       )}
                    </div>

                    <div className="flex-1">
                      <table className="w-full text-left">
                        <thead>
                          <tr className="border-b border-slate-100">
                            <th className="pb-2 text-[10px] text-slate-400 uppercase">Description</th>
                            <th className="pb-2 text-[10px] text-slate-400 uppercase text-right">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-slate-50">
                            <td className="py-4 text-sm text-slate-700 max-w-[200px]">
                              {newInvoice.description || <span className="text-slate-300 italic">Description will appear here...</span>}
                            </td>
                            <td className="py-4 text-sm font-bold text-slate-900 text-right">
                              {newInvoice.amount ? parseFloat(newInvoice.amount).toLocaleString() : '0.00'}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="border-t border-slate-100 pt-4 mt-auto">
                       <div className="flex justify-between items-center text-lg font-bold">
                         <span className="text-slate-900">Total</span>
                         <span className="text-blue-600">{newInvoice.amount ? parseFloat(newInvoice.amount).toLocaleString() : '0.00'} MAD</span>
                       </div>
                    </div>
                  </div>
                  
                  {/* Footer Decoration */}
                  <div className="bg-slate-50 p-3 text-center border-t border-slate-100">
                     <p className="text-[10px] text-slate-400">Thank you for your business.</p>
                  </div>
               </div>

               <div className="mt-6 flex gap-3 z-10">
                 <button className="p-2 bg-white rounded-full shadow-md text-slate-500 hover:text-blue-600 transition-colors">
                   <Printer size={18} />
                 </button>
                 <button className="p-2 bg-white rounded-full shadow-md text-slate-500 hover:text-blue-600 transition-colors">
                   <Download size={18} />
                 </button>
               </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

const KPICard = ({ title, amount, icon: Icon, color }: { title: string, amount: number, icon: any, color: 'blue' | 'green' | 'amber' | 'red' }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
    red: 'bg-red-50 text-red-600'
  };

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
      <div>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-xl font-bold text-slate-900">{amount.toLocaleString()} <span className="text-xs font-normal text-slate-400">MAD</span></h3>
      </div>
      <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
        <Icon size={24} />
      </div>
    </div>
  );
};

const StatusBadge = ({ status, t }: { status: string, t: any }) => {
  const styles = {
    paid: 'bg-green-100 text-green-700 border-green-200',
    pending: 'bg-amber-100 text-amber-700 border-amber-200',
    overdue: 'bg-red-100 text-red-700 border-red-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-200'
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${styles[status as keyof typeof styles]}`}>
      {t[status] || status}
    </span>
  );
};
