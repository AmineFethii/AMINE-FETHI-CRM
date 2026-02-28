
import React, { useState, useMemo } from 'react';
import { 
  Banknote, 
  TrendingUp, 
  PieChart, 
  CreditCard, 
  Calendar, 
  ArrowUpRight, 
  AlertCircle, 
  CheckCircle2, 
  Download,
  Search,
  Filter,
  ArrowUpDown,
  Plus,
  Receipt,
  Mail,
  X
} from 'lucide-react';
import { ClientData } from '../types';
import { translations } from '../translations';

interface FinanceDashboardProps {
  clients: ClientData[];
  onUpdateClient: (clientId: string, updates: Partial<ClientData>) => void;
}

type TimeRange = 'this-month' | 'last-month' | '3-months' | '6-months' | 'ytd';
type SortKey = 'companyName' | 'contractValue' | 'amountPaid' | 'outstanding';

export const FinanceDashboard: React.FC<FinanceDashboardProps> = ({ clients, onUpdateClient }) => {
  const [timeRange, setTimeRange] = useState<TimeRange>('this-month');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState<{key: SortKey, direction: 'asc' | 'desc'} | null>(null);

  // Payment Modal State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<ClientData | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentNote, setPaymentNote] = useState('');
  
  const t = translations.en.finance;
  const commonT = translations.en.common;

  // --- Calculations ---

  const totalRevenue = clients.reduce((sum, client) => sum + client.contractValue, 0);
  const collectedAmount = clients.reduce((sum, client) => sum + client.amountPaid, 0);
  const remainingAmount = totalRevenue - collectedAmount;
  const collectionRate = totalRevenue > 0 ? Math.round((collectedAmount / totalRevenue) * 100) : 0;

  // --- Sorting & Filtering ---

  const handleSort = (key: SortKey) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedClients = useMemo(() => {
    let result = [...clients];

    // Filter by Search
    if (searchTerm) {
      result = result.filter(c => 
        c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by Status
    if (statusFilter !== 'all') {
      result = result.filter(c => c.paymentStatus === statusFilter);
    }

    // Sort
    if (sortConfig) {
      result.sort((a, b) => {
        let aValue: any = a[sortConfig.key as keyof ClientData] || 0;
        let bValue: any = b[sortConfig.key as keyof ClientData] || 0;

        // Custom Sort Logic for computed fields
        if (sortConfig.key === 'outstanding') {
           aValue = a.contractValue - a.amountPaid;
           bValue = b.contractValue - b.amountPaid;
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [clients, searchTerm, statusFilter, sortConfig]);


  // --- Actions ---

  const handleOpenPaymentModal = (client: ClientData) => {
    setSelectedClient(client);
    setPaymentAmount('');
    setPaymentNote('');
    setIsPaymentModalOpen(true);
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !paymentAmount) return;

    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const newPaidAmount = selectedClient.amountPaid + amount;
    const isFullyPaid = newPaidAmount >= selectedClient.contractValue;
    
    // Update Client
    onUpdateClient(selectedClient.id, {
      amountPaid: newPaidAmount,
      paymentStatus: isFullyPaid ? 'paid' : newPaidAmount > 0 ? 'partial' : 'pending',
      lastPaymentDate: new Date().toISOString()
    });

    setIsPaymentModalOpen(false);
  };

  const handleDownloadInvoice = (client: ClientData) => {
    // Simulating invoice generation
    const invoiceContent = `INVOICE
    Client: ${client.companyName}
    Service: ${client.serviceType}
    Total Contract: ${client.contractValue} ${client.currency}
    Paid: ${client.amountPaid} ${client.currency}
    Remaining: ${client.contractValue - client.amountPaid} ${client.currency}
    Date: ${new Date().toLocaleDateString()}`;

    const blob = new Blob([invoiceContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Invoice_${client.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTrend = () => Math.floor(Math.random() * 15) + 5;

  const revenueHistory = [
    { month: 'May', target: 100000, collected: 92000 },
    { month: 'Jun', target: 110000, collected: 108000 },
    { month: 'Jul', target: 120000, collected: 125000 },
    { month: 'Aug', target: 100000, collected: 85000 },
    { month: 'Sep', target: 130000, collected: 132000 },
    { month: 'Oct', target: 150000, collected: 127500 },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <select 
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value as TimeRange)}
            className="bg-transparent text-sm font-medium text-slate-700 py-1.5 px-3 outline-none cursor-pointer pr-8"
          >
            <option value="this-month">This Month</option>
            <option value="last-month">Last Month</option>
            <option value="3-months">Last 3 Months</option>
            <option value="6-months">Last 6 Months</option>
            <option value="ytd">Year to Date</option>
          </select>
          <Calendar size={16} className="text-slate-400 mr-2" />
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Total Pipeline */}
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-900/10 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 group-hover:opacity-30 transition-opacity translate-x-1/2"></div>
          <div className="relative z-10">
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 bg-slate-800/50 rounded-lg">
                <TrendingUp size={20} className="text-blue-400" />
              </div>
              <span className="text-xs font-medium bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full flex items-center gap-1">
                <ArrowUpRight size={12} /> +{getTrend()}%
              </span>
            </div>
            <p className="text-slate-400 text-sm font-medium uppercase tracking-wider">{t.totalContract}</p>
            <h2 className="text-3xl font-bold mt-1 tracking-tight">
              {totalRevenue.toLocaleString()} <span className="text-lg text-slate-500 font-normal">MAD</span>
            </h2>
            <div className="mt-4 h-1 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>

        {/* Cash Collected */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Banknote size={20} className="text-green-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t.cashCollected}</p>
          <h2 className="text-3xl font-bold mt-1 text-slate-900 tracking-tight">
            {collectedAmount.toLocaleString()} <span className="text-lg text-slate-400 font-normal">MAD</span>
          </h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600">
            <CheckCircle2 size={14} />
            {collectionRate}% {t.collectionRate}
          </div>
        </div>

        {/* Outstanding */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg">
              <PieChart size={20} className="text-amber-600" />
            </div>
          </div>
          <p className="text-slate-500 text-sm font-medium uppercase tracking-wider">{t.outstanding}</p>
          <h2 className="text-3xl font-bold mt-1 text-slate-900 tracking-tight">
            {remainingAmount.toLocaleString()} <span className="text-lg text-slate-400 font-normal">MAD</span>
          </h2>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-amber-600">
            <AlertCircle size={14} />
            {clients.filter(c => c.paymentStatus !== 'paid').length} {t.pendingPayments}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Client Ledger Table - IMPROVED */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {/* Ledger Toolbar */}
          <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CreditCard size={20} className="text-blue-500" />
              {t.clientLedger}
            </h3>

            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-48">
                <Search size={14} className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3" />
                <input 
                  type="text" 
                  placeholder={commonT.search}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full py-1.5 bg-white border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 pl-9 pr-3 placeholder:text-slate-400"
                />
              </div>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg px-2">
                 <Filter size={14} className="text-slate-400" />
                 <select 
                   value={statusFilter}
                   onChange={(e) => setStatusFilter(e.target.value)}
                   className="py-1.5 bg-transparent text-xs font-medium text-slate-600 border-none outline-none cursor-pointer"
                 >
                   <option value="all">All Status</option>
                   <option value="paid">Paid</option>
                   <option value="partial">Partial</option>
                   <option value="pending">Pending</option>
                   <option value="overdue">Overdue</option>
                 </select>
              </div>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase font-bold tracking-wider">
                <tr>
                  <th 
                    className="px-6 py-3 text-start cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort('companyName')}
                  >
                    <div className="flex items-center gap-1">
                      {t.clientList}
                      <ArrowUpDown size={10} className="opacity-0 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-start cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort('contractValue')}
                  >
                     <div className="flex items-center gap-1">
                      Contract
                      <ArrowUpDown size={10} className="opacity-0 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-start cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort('amountPaid')}
                  >
                     <div className="flex items-center gap-1">
                      Paid
                      <ArrowUpDown size={10} className="opacity-0 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th 
                    className="px-6 py-3 text-start cursor-pointer hover:bg-slate-100 transition-colors group"
                    onClick={() => handleSort('outstanding')}
                  >
                     <div className="flex items-center gap-1">
                      Balance
                      <ArrowUpDown size={10} className="opacity-0 group-hover:opacity-100" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-center">{commonT.status}</th>
                  <th className="px-6 py-3 text-end">{commonT.actions}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredAndSortedClients.length > 0 ? (
                  filteredAndSortedClients.map(client => {
                     const percentPaid = (client.amountPaid / client.contractValue) * 100;
                     const remaining = client.contractValue - client.amountPaid;
                     return (
                      <tr key={client.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-500 overflow-hidden">
                              {client.avatarUrl ? (
                                <img src={client.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                client.companyName.charAt(0)
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900 leading-tight">{client.companyName}</p>
                              <p className="text-[10px] text-slate-500">{client.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className="text-sm font-semibold text-slate-700">{client.contractValue.toLocaleString()}</span>
                           <span className="text-[10px] text-slate-400 ml-1">MAD</span>
                        </td>
                        <td className="px-6 py-4">
                           <div className="flex flex-col gap-1">
                              <span className="text-sm font-semibold text-green-600">{client.amountPaid.toLocaleString()}</span>
                              <div className="w-20 h-1 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full ${percentPaid === 100 ? 'bg-green-500' : 'bg-green-400'}`} 
                                  style={{ width: `${percentPaid}%` }}
                                ></div>
                              </div>
                           </div>
                        </td>
                        <td className="px-6 py-4">
                           <span className={`text-sm font-semibold ${remaining > 0 ? 'text-slate-700' : 'text-slate-400'}`}>
                              {remaining.toLocaleString()}
                           </span>
                        </td>
                        <td className="px-6 py-4 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase border ${
                            client.paymentStatus === 'paid' ? 'bg-green-50 text-green-700 border-green-200' :
                            client.paymentStatus === 'overdue' ? 'bg-red-50 text-red-700 border-red-200' :
                            client.paymentStatus === 'partial' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {client.paymentStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-end">
                           <div className="flex items-center justify-end gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                              {remaining > 0 && (
                                <button 
                                  onClick={() => handleOpenPaymentModal(client)}
                                  className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Add Payment"
                                >
                                  <Plus size={16} />
                                </button>
                              )}
                              <button 
                                onClick={() => handleDownloadInvoice(client)}
                                className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Generate Invoice"
                              >
                                <Receipt size={16} />
                              </button>
                              <button className="p-1.5 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors" title="Send Reminder">
                                <Mail size={16} />
                              </button>
                           </div>
                        </td>
                      </tr>
                     );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                      <Search size={32} className="mx-auto mb-2 opacity-20" />
                      <p className="text-sm font-medium">No records found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Footer / Pagination Placeholder */}
          <div className="p-3 border-t border-slate-100 bg-slate-50 text-[10px] text-slate-400 flex justify-between">
             <span>Showing {filteredAndSortedClients.length} records</span>
             <span>Page 1 of 1</span>
          </div>
        </div>

        {/* Right Sidebar - Monthly Targets */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-slate-900">{t.revenueTrends}</h3>
             <div className="flex items-center gap-3">
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                 <span className="text-[10px] text-slate-500 font-medium">{t.target}</span>
               </div>
               <div className="flex items-center gap-1.5">
                 <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                 <span className="text-[10px] text-slate-500 font-medium">{t.actual}</span>
               </div>
             </div>
          </div>
          
          {/* Bar Chart Implementation */}
          <div className="flex-1 flex items-end justify-between gap-2 mb-6 h-64 border-b border-slate-100 pb-2 px-1">
             {revenueHistory.map((item, idx) => {
                const maxVal = 160000; 
                const targetHeight = (item.target / maxVal) * 100;
                const collectedHeight = (item.collected / maxVal) * 100;
                const isTargetMet = item.collected >= item.target;
                
                return (
                  <div key={idx} className="flex flex-col items-center gap-2 w-full group relative cursor-help">
                    {/* Hover Tooltip */}
                     <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-20 pointer-events-none">
                        <div className="bg-slate-800 text-white text-[10px] py-1.5 px-2.5 rounded-lg shadow-xl whitespace-nowrap flex flex-col gap-0.5">
                           <span className="font-bold border-b border-slate-600 pb-1 mb-0.5">{item.month} 2023</span>
                           <div className="flex justify-between gap-3">
                             <span className="text-slate-400">{t.target}:</span>
                             <span className="font-mono">{item.target.toLocaleString()}</span>
                           </div>
                           <div className="flex justify-between gap-3">
                             <span className={isTargetMet ? "text-green-400" : "text-blue-400"}>{t.actual}:</span>
                             <span className="font-mono">{item.collected.toLocaleString()}</span>
                           </div>
                        </div>
                        <div className="w-2 h-2 bg-slate-800 rotate-45 mx-auto -mt-1"></div>
                     </div>

                    <div className="relative w-full flex justify-center items-end h-full">
                      {/* Target Bar */}
                      <div 
                        className="absolute bottom-0 w-full max-w-[32px] bg-slate-100 rounded-t-sm border-x border-t border-slate-200"
                        style={{ height: `${targetHeight}%` }}
                      ></div>
                      
                      {/* Collected Bar */}
                      <div 
                        className={`relative z-10 w-full max-w-[12px] rounded-t-full shadow-lg transition-all duration-500 ${
                          isTargetMet 
                             ? 'bg-gradient-to-t from-emerald-600 to-emerald-400 shadow-emerald-200' 
                             : 'bg-gradient-to-t from-blue-700 to-blue-500 shadow-blue-200'
                        }`}
                        style={{ height: `${collectedHeight}%` }}
                      ></div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.month}</span>
                  </div>
                );
             })}
          </div>

          <div className="space-y-4">
             {/* Current Month KPI */}
             <div className="p-5 bg-slate-50 rounded-xl border border-slate-100 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/40 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               
               <div className="flex justify-between items-start mb-2 relative z-10">
                 <div>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider mb-1">{t.currentProgress}</p>
                    <p className="text-2xl font-bold text-slate-900">85%</p>
                 </div>
                 <div className="p-2 bg-white rounded-lg border border-slate-100 shadow-sm text-blue-600">
                    <TrendingUp size={16} />
                 </div>
               </div>
               
               <div className="relative z-10">
                  <div className="flex justify-between text-xs mb-1.5">
                    <span className="font-medium text-slate-700">127,500 MAD</span>
                    <span className="text-slate-400">{t.target}: 150k</span>
                  </div>
                  <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '85%' }}></div>
                  </div>
               </div>
             </div>
             
             <button className="w-full flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-white hover:border-blue-200 hover:text-blue-600 hover:shadow-md transition-all group">
                {t.downloadReport}
                <Download size={16} className="group-hover:animate-bounce" />
             </button>
          </div>
        </div>
      </div>

      {/* --- Add Payment Modal --- */}
      {isPaymentModalOpen && selectedClient && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsPaymentModalOpen(false)}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-scale-up">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <h3 className="text-lg font-bold text-slate-900">Record Payment</h3>
               <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                 <X size={20} />
               </button>
            </div>
            
            <form onSubmit={handleSubmitPayment} className="p-6 space-y-4">
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-2">
                 <p className="text-xs font-bold text-blue-500 uppercase mb-1">Client</p>
                 <p className="font-bold text-slate-800">{selectedClient.companyName}</p>
                 <div className="flex justify-between mt-2 text-sm">
                    <span className="text-slate-500">Remaining Balance:</span>
                    <span className="font-bold text-slate-900">{(selectedClient.contractValue - selectedClient.amountPaid).toLocaleString()} MAD</span>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Amount (MAD)</label>
                 <div className="relative">
                   <input 
                     type="number"
                     required
                     min="1"
                     max={selectedClient.contractValue - selectedClient.amountPaid}
                     value={paymentAmount}
                     onChange={(e) => setPaymentAmount(e.target.value)}
                     className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-green-500"
                     placeholder="0.00"
                   />
                   <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">MAD</span>
                 </div>
              </div>

              <div>
                 <label className="block text-sm font-medium text-slate-700 mb-1">Note / Reference (Optional)</label>
                 <textarea 
                    rows={2}
                    value={paymentNote}
                    onChange={(e) => setPaymentNote(e.target.value)}
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none placeholder:text-slate-400"
                    placeholder="e.g. Bank Transfer Ref: 123456"
                 ></textarea>
              </div>

              <div className="pt-2 flex gap-3">
                 <button 
                   type="button"
                   onClick={() => setIsPaymentModalOpen(false)}
                   className="flex-1 py-3 bg-white border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-50"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit"
                   className="flex-1 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg shadow-green-200 transition-all transform active:scale-95"
                 >
                   Confirm Payment
                 </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
