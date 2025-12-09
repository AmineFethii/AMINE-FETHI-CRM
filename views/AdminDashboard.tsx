
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Briefcase, 
  CheckCircle, 
  Search, 
  FileCheck,
  X,
  AlertCircle,
  PlayCircle,
  RotateCcw,
  CheckCircle2,
  Download,
  Plus,
  TrendingUp,
  Clock,
  ArrowRight,
  Bell,
  Calendar
} from 'lucide-react';
import { ClientData, TimelineStep, User } from '../types';
import { translations } from '../translations';

interface AdminDashboardProps {
  clients: ClientData[];
  onUpdateClient: (clientId: string, updates: Partial<ClientData>) => void;
  user: User | null;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ clients, onUpdateClient, user }) => {
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'attention' | 'completed'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations.en.adminDashboard;
  
  // Form State
  const [editProgress, setEditProgress] = useState(0);
  const [editStatusMessage, setEditStatusMessage] = useState('');
  const [editTimeline, setEditTimeline] = useState<TimelineStep[]>([]);
  const [isDirty, setIsDirty] = useState(false);
  
  // Rejection State
  const [rejectingDocId, setRejectingDocId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const selectedClient = clients.find(c => c.id === selectedClientId);

  // Date for Header
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Initialize form when client is selected
  useEffect(() => {
    if (selectedClient) {
      setEditProgress(selectedClient.progress);
      setEditStatusMessage(selectedClient.statusMessage);
      setEditTimeline(JSON.parse(JSON.stringify(selectedClient.timeline)));
      setIsDirty(false);
    }
  }, [selectedClient]);

  const handleEditClick = (client: ClientData) => {
    setSelectedClientId(client.id);
    setRejectingDocId(null);
    setRejectionReason('');
  };

  const handleTimelineChange = (stepId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    const updatedTimeline = editTimeline.map(step => {
      if (step.id === stepId) return { ...step, status: newStatus };
      return step;
    });

    setEditTimeline(updatedTimeline);
    setIsDirty(true);

    const totalSteps = updatedTimeline.length;
    const completedSteps = updatedTimeline.filter(s => s.status === 'completed').length;
    const inProgressSteps = updatedTimeline.filter(s => s.status === 'in-progress').length;
    
    let calculatedProgress = 0;
    if (totalSteps > 0) {
      calculatedProgress = Math.round(((completedSteps + (inProgressSteps * 0.5)) / totalSteps) * 100);
    }
    setEditProgress(calculatedProgress);

    const activeStep = updatedTimeline.find(s => s.status === 'in-progress');
    const nextStep = updatedTimeline.find(s => s.status === 'pending');

    if (activeStep) {
      setEditStatusMessage(activeStep.label);
    } else if (nextStep) {
      setEditStatusMessage(`Pending: ${nextStep.label}`);
    } else {
      const allCompleted = updatedTimeline.every(s => s.status === 'completed');
      if (allCompleted) {
        setEditStatusMessage("Service Completed");
        setEditProgress(100);
      }
    }
  };

  const handleSave = () => {
    if (selectedClient) {
      const updates: Partial<ClientData> = {
        progress: editProgress,
        statusMessage: editStatusMessage,
        timeline: editTimeline
      };
      onUpdateClient(selectedClient.id, updates);
      setIsDirty(false);
    }
  };

  const handleApproveDoc = (clientId: string, docId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    
    const updatedDocs = client.documents.map(d => 
      d.id === docId ? { ...d, status: 'approved' as const, rejectionReason: undefined } : d
    );
    onUpdateClient(clientId, { documents: updatedDocs });
  };

  const handleConfirmReject = (clientId: string, docId: string) => {
    if (!rejectionReason.trim()) return;

    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const updatedDocs = client.documents.map(d => 
      d.id === docId ? { ...d, status: 'rejected' as const, rejectionReason: rejectionReason } : d
    );
    
    onUpdateClient(clientId, { documents: updatedDocs });
    setRejectingDocId(null);
    setRejectionReason('');
  };

  const handleDownloadReport = () => {
    // Define headers
    const headers = ['Client Name', 'Company Name', 'Service Type', 'Progress (%)', 'Contract Value (MAD)', 'Amount Paid (MAD)', 'Remaining Amount (MAD)', 'Status'];
    
    // Map client data to CSV rows
    const rows = clients.map(client => {
      const remaining = client.contractValue - client.amountPaid;
      // Escape quotes and wrap fields in quotes to handle commas within data
      return [
        `"${client.name.replace(/"/g, '""')}"`,
        `"${client.companyName.replace(/"/g, '""')}"`,
        `"${client.serviceType.replace(/"/g, '""')}"`,
        client.progress,
        client.contractValue,
        client.amountPaid,
        remaining,
        `"${client.statusMessage.replace(/"/g, '""')}"`
      ].join(',');
    });

    // Combine headers and rows
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    // Create Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `client_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ---- DERIVED METRICS ----
  const pendingActionsCount = clients.reduce((acc, client) => acc + client.documents.filter(d => d.status === 'uploaded').length, 0);
  const activeClientsCount = clients.filter(c => c.progress < 100).length;
  const completedClientsCount = clients.filter(c => c.progress === 100).length;
  
  // Global Pending Documents List (for the priority feed)
  const globalPendingDocs = clients.flatMap(client => 
    client.documents
      .filter(d => d.status === 'uploaded')
      .map(d => ({ ...d, client }))
  );

  const filteredClients = clients.filter(c => {
    // 1. Status Filter
    let matchesFilter = true;
    if (filterType === 'attention') {
       matchesFilter = c.documents.some(d => d.status === 'uploaded') || c.paymentStatus === 'overdue';
    } else if (filterType === 'completed') {
       matchesFilter = c.progress === 100;
    }

    // 2. Search Filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      c.companyName.toLowerCase().includes(searchLower) ||
      c.name.toLowerCase().includes(searchLower) ||
      c.email.toLowerCase().includes(searchLower) ||
      c.serviceType.toLowerCase().includes(searchLower) ||
      (c.cin && c.cin.toLowerCase().includes(searchLower));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      
      {/* Enhanced Hero Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 shadow-xl">
        {/* Decorative Abstract Blobs */}
        <div className="absolute top-0 right-0 -translate-y-1/2 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 animate-pulse translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 translate-y-1/2 w-96 h-96 bg-purple-600 rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/3"></div>

        <div className="relative z-10 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-8">
          
          {/* Profile & Greeting */}
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer" onClick={() => {}}>
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 p-1 shadow-lg transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-xl overflow-hidden bg-slate-800 flex items-center justify-center relative">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl font-bold text-white">{user?.name?.charAt(0) || 'A'}</span>
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center shadow-sm">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-2.5 py-0.5 rounded-md bg-blue-500/20 border border-blue-500/30 text-blue-300 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm">
                  {t.adminConsole}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
                  <Calendar size={12} className="text-slate-500" />
                  {currentDate}
                </span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-white mb-1.5 flex items-center gap-2">
                {t.goodMorning}, {user?.name.split(' ')[0]} <span className="text-2xl">👋</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-lg leading-relaxed">
                <span className="text-white font-semibold border-b border-white/20 pb-0.5">{pendingActionsCount}</span> {t.actionsRequired}
              </p>
            </div>
          </div>

          {/* Quick Actions & Stats */}
          <div className="flex flex-col sm:flex-row gap-4 w-full xl:w-auto">
            
            {/* Quick Stats Pill */}
            <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-sm shadow-lg">
               <div className="px-5 py-1 text-center border-r border-white/10">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">{translations.en.common.pending}</p>
                  <div className="flex items-center justify-center gap-2">
                     <span className={`text-xl font-bold ${pendingActionsCount > 0 ? 'text-amber-400' : 'text-white'}`}>
                       {pendingActionsCount}
                     </span>
                     {pendingActionsCount > 0 && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-ping"></span>}
                  </div>
               </div>
               <div className="px-5 py-1 text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Active</p>
                  <div className="flex items-center justify-center gap-2">
                     <span className="text-xl font-bold text-blue-400">{activeClientsCount}</span>
                     <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  </div>
               </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={handleDownloadReport}
                className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white border border-white/10 px-5 py-3 rounded-xl text-sm font-semibold transition-all backdrop-blur-sm hover:border-white/30"
              >
                  <Download size={18} />
                  <span>{t.report}</span>
              </button>
              <button className="flex-1 xl:flex-none flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-lg shadow-blue-900/50 transition-all hover:shadow-blue-500/30 hover:-translate-y-0.5">
                  <Plus size={18} />
                  <span>{t.newMission}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Active Cases */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
           <div className="flex justify-between items-start mb-4 relative z-10">
             <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
               <Briefcase size={22} />
             </div>
             <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center gap-1">
               <TrendingUp size={12} /> +12%
             </span>
           </div>
           <div className="relative z-10">
             <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{activeClientsCount}</h3>
             <p className="text-slate-500 text-sm font-medium mt-1">{t.activeMissions}</p>
           </div>
        </div>

        {/* Metric 2: Actions Required */}
        <div className={`p-5 rounded-2xl border shadow-sm transition-all group relative overflow-hidden ${
          pendingActionsCount > 0 
            ? 'bg-amber-50 border-amber-200 hover:border-amber-300' 
            : 'bg-white border-slate-200'
        }`}>
           <div className="flex justify-between items-start mb-4 relative z-10">
             <div className={`p-3 rounded-xl transition-colors ${
               pendingActionsCount > 0 ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-500'
             }`}>
               <AlertCircle size={22} />
             </div>
           </div>
           <div className="relative z-10">
             <h3 className={`text-3xl font-bold tracking-tight ${pendingActionsCount > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
               {pendingActionsCount}
             </h3>
             <p className={`text-sm font-medium mt-1 ${pendingActionsCount > 0 ? 'text-amber-600' : 'text-slate-500'}`}>
               {t.actionsReqLabel}
             </p>
           </div>
        </div>

        {/* Metric 3: Completed */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
           <div className="flex justify-between items-start mb-4">
             <div className="p-3 rounded-xl bg-green-50 text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
               <CheckCircle size={22} />
             </div>
           </div>
           <div>
             <h3 className="text-3xl font-bold text-slate-900 tracking-tight">{completedClientsCount}</h3>
             <p className="text-slate-500 text-sm font-medium mt-1">{t.completedYtd}</p>
           </div>
        </div>

        {/* Metric 4: Total Revenue (Mock) */}
        <div className="bg-slate-900 p-5 rounded-2xl shadow-lg relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-10 group-hover:opacity-20 transition-opacity translate-x-10 -translate-y-10"></div>
           
           <div className="relative z-10">
             <div className="flex justify-between items-start mb-4">
               <div className="p-3 rounded-xl bg-slate-800 text-blue-400">
                 <Users size={22} />
               </div>
               <span className="text-xs font-medium text-slate-400">{t.monthlyGoal}</span>
             </div>
             <div>
               <h3 className="text-3xl font-bold text-white tracking-tight">85<span className="text-lg text-slate-500">%</span></h3>
               <p className="text-slate-400 text-sm font-medium mt-1">{t.clientCapacity}</p>
               <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                 <div className="bg-blue-500 h-full rounded-full" style={{ width: '85%' }}></div>
               </div>
             </div>
           </div>
        </div>
      </div>

      {/* Main Content Area - Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column: Client Directory */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Filters & Search */}
          <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
             <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-lg w-full md:w-auto overflow-x-auto">
                <button 
                  onClick={() => setFilterType('all')}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterType === 'all' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t.allClients}
                </button>
                <button 
                  onClick={() => setFilterType('attention')}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-2 ${
                    filterType === 'attention' ? 'bg-white text-amber-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {t.needsAttention}
                  {pendingActionsCount > 0 && (
                    <span className="w-5 h-5 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center text-[10px]">
                      {pendingActionsCount}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setFilterType('completed')}
                  className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap ${
                    filterType === 'completed' ? 'bg-white text-green-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  {translations.en.common.completed}
                </button>
             </div>

             <div className="relative w-full md:w-64 px-2 md:px-0">
               <Search className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-4 md:left-2" size={16} />
               <input 
                 type="text" 
                 placeholder={translations.en.common.search}
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
                 className="w-full py-2 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-lg pl-10 md:pl-8 pr-4 placeholder:text-slate-400"
               />
               {searchTerm && (
                 <button 
                   onClick={() => setSearchTerm('')}
                   className="absolute top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 right-4"
                 >
                   <X size={14} />
                 </button>
               )}
             </div>
          </div>

          {/* Client List */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px]">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase font-bold tracking-wider border-b border-slate-100">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-start">{t.clientList}</th>
                    <th className="px-6 py-4 font-semibold text-start">{t.progress}</th>
                    <th className="px-6 py-4 font-semibold text-start">{translations.en.common.status}</th>
                    <th className="px-6 py-4 font-semibold text-end">{t.lastUpdate}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredClients.length > 0 ? (
                    filteredClients.map(client => {
                       const hasPending = client.documents.some(d => d.status === 'uploaded');
                       return (
                        <tr 
                          key={client.id} 
                          onClick={() => handleEditClick(client)}
                          className={`group cursor-pointer transition-all hover:bg-slate-50 ${selectedClientId === client.id ? 'bg-blue-50/40' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-slate-200 text-slate-500 font-bold overflow-hidden">
                                  {client.avatarUrl ? (
                                    <img src={client.avatarUrl} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    client.companyName.charAt(0)
                                  )}
                                </div>
                                {hasPending && (
                                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full border-2 border-white animate-pulse"></span>
                                )}
                              </div>
                              <div>
                                <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{client.companyName}</p>
                                <p className="text-xs text-slate-500">{client.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 w-1/3">
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-xs">
                                <span className="font-medium text-slate-700">{client.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    client.progress === 100 ? 'bg-green-500' : 'bg-blue-600'
                                  }`} 
                                  style={{ width: `${client.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                               client.progress === 100 
                                 ? 'bg-green-50 text-green-700 border-green-100'
                                 : hasPending 
                                   ? 'bg-amber-50 text-amber-700 border-amber-100'
                                   : 'bg-blue-50 text-blue-700 border-blue-100'
                            }`}>
                              {client.progress === 100 ? <CheckCircle2 size={12} /> : hasPending ? <AlertCircle size={12} /> : <Clock size={12} />}
                              <span className="max-w-[100px] truncate">{client.statusMessage}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-end">
                            <p className="text-xs font-medium text-slate-400 group-hover:text-slate-600">
                               2h ago
                            </p>
                          </td>
                        </tr>
                       );
                    })
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-400">
                          <Search size={32} className="mb-2 opacity-20" />
                          <p className="text-sm font-medium">No clients found matching "{searchTerm}"</p>
                          <button 
                            onClick={() => { setSearchTerm(''); setFilterType('all'); }} 
                            className="mt-2 text-xs text-blue-600 hover:underline"
                          >
                            Clear filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Workflow Editor OR Priority Feed */}
        <div className="lg:col-span-1">
          {selectedClient ? (
             // --- WORKFLOW EDITOR PANEL ---
             <div className="bg-white rounded-2xl border border-slate-200 shadow-lg shadow-slate-200/50 h-full flex flex-col sticky top-24 max-h-[calc(100vh-120px)] animate-slide-in-right">
                {/* Panel Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl backdrop-blur-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 p-1 shadow-sm">
                        {selectedClient.avatarUrl ? <img src={selectedClient.avatarUrl} className="w-full h-full object-cover rounded-md" /> : <div className="w-full h-full bg-slate-100 rounded-md"></div>}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 leading-tight">{selectedClient.companyName}</h3>
                      <p className="text-xs text-slate-500 font-medium">{selectedClient.serviceType}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSelectedClientId(null)} 
                    className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto">
                  {/* Status & Actions */}
                  <div className="p-5 border-b border-slate-100">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.missionStatus}</h4>
                      <div className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded border border-blue-100">
                        {editProgress}% {translations.en.common.completed}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                       <div className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                          <p className="text-xs text-slate-500 mb-1">{t.publicStatus}</p>
                          <p className="text-sm font-semibold text-slate-900">{editStatusMessage}</p>
                       </div>
                    </div>
                  </div>

                  {/* Document Queue */}
                  <div className="p-5 border-b border-slate-100 bg-slate-50/30">
                     <div className="flex items-center justify-between mb-3">
                       <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.reviewQueue}</h4>
                       {selectedClient.documents.filter(d => d.status === 'uploaded').length > 0 && (
                         <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
                       )}
                     </div>
                     
                     <div className="space-y-3">
                       {selectedClient.documents.map(doc => (
                         <div key={doc.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
                           <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <FileCheck size={16} className={doc.name.endsWith('pdf') ? 'text-red-500' : 'text-blue-500'} />
                                <span className="text-sm font-medium text-slate-700 truncate max-w-[140px]" title={doc.name}>{doc.name}</span>
                              </div>
                              <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                                doc.status === 'uploaded' ? 'bg-amber-100 text-amber-700' :
                                doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                                doc.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-500'
                              }`}>
                                {doc.status}
                              </span>
                           </div>
                           
                           {/* Rejection UI */}
                           {rejectingDocId === doc.id ? (
                             <div className="mt-2 pt-2 border-t border-slate-100">
                               <textarea 
                                 className="w-full text-xs p-2 border border-red-200 rounded bg-red-50 focus:outline-none focus:ring-1 focus:ring-red-500"
                                 placeholder={t.reason}
                                 value={rejectionReason}
                                 onChange={e => setRejectionReason(e.target.value)}
                               />
                               <div className="flex justify-end gap-2 mt-2">
                                 <button onClick={() => setRejectingDocId(null)} className="text-xs text-slate-500">{translations.en.common.cancel}</button>
                                 <button onClick={() => handleConfirmReject(selectedClient.id, doc.id)} className="text-xs bg-red-600 text-white px-2 py-1 rounded">{t.reject}</button>
                               </div>
                             </div>
                           ) : doc.status === 'uploaded' ? (
                             <div className="flex gap-2 mt-2">
                               <button 
                                 onClick={() => handleApproveDoc(selectedClient.id, doc.id)}
                                 className="flex-1 bg-green-50 text-green-700 text-xs font-bold py-1.5 rounded-lg hover:bg-green-100 border border-green-200 transition-colors"
                               >
                                 {t.approve}
                               </button>
                               <button 
                                 onClick={() => { setRejectingDocId(doc.id); setRejectionReason(''); }}
                                 className="flex-1 bg-white text-slate-600 text-xs font-bold py-1.5 rounded-lg hover:bg-red-50 hover:text-red-600 border border-slate-200 hover:border-red-200 transition-colors"
                               >
                                 {t.reject}
                               </button>
                             </div>
                           ) : null}
                         </div>
                       ))}
                       {selectedClient.documents.length === 0 && <p className="text-xs text-slate-400 italic text-center py-2">{t.noPending}</p>}
                     </div>
                  </div>

                  {/* Timeline Editor */}
                  <div className="p-5">
                    <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">{t.phaseControl}</h4>
                    <div className="relative space-y-4 pl-2">
                       <div className="absolute top-2 bottom-2 w-0.5 bg-slate-100 left-[15px]"></div>
                       {editTimeline.map((step, idx) => (
                         <div key={step.id} className="relative pl-8">
                            <div className={`absolute top-0.5 w-8 h-8 rounded-full border-2 flex items-center justify-center bg-white z-10 transition-colors left-0 ${
                              step.status === 'completed' ? 'border-green-500 text-green-500' :
                              step.status === 'in-progress' ? 'border-blue-500 text-blue-500 shadow-lg shadow-blue-200' :
                              'border-slate-200 text-slate-300'
                            }`}>
                               {step.status === 'completed' && <CheckCircle2 size={16} />}
                               {step.status === 'in-progress' && <div className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse" />}
                               {step.status === 'pending' && <span className="text-[10px] font-bold">{idx + 1}</span>}
                            </div>
                            
                            <div className="flex justify-between items-start">
                              <div>
                                <p className={`text-sm font-semibold ${
                                  step.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'
                                }`}>{step.label}</p>
                                <p className="text-[10px] text-slate-400 capitalize">{step.status.replace('-', ' ')}</p>
                              </div>
                              
                              <div className="flex gap-1">
                                {step.status !== 'completed' && (
                                  <button onClick={() => handleTimelineChange(step.id, 'completed')} className="text-green-600 p-1 hover:bg-green-50 rounded"><CheckCircle2 size={14} /></button>
                                )}
                                {step.status !== 'in-progress' && (
                                  <button onClick={() => handleTimelineChange(step.id, 'in-progress')} className="text-blue-600 p-1 hover:bg-blue-50 rounded"><PlayCircle size={14} /></button>
                                )}
                                {step.status !== 'pending' && (
                                  <button onClick={() => handleTimelineChange(step.id, 'pending')} className="text-slate-400 p-1 hover:bg-slate-100 rounded"><RotateCcw size={14} /></button>
                                )}
                              </div>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-4 border-t border-slate-100 bg-slate-50 rounded-b-2xl">
                   <button 
                     onClick={handleSave}
                     disabled={!isDirty}
                     className={`w-full py-3 rounded-xl font-bold text-sm shadow-sm transition-all ${
                       isDirty 
                         ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-slate-900/20 transform hover:-translate-y-0.5' 
                         : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                     }`}
                   >
                     {isDirty ? t.saveWorkflow : t.saved}
                   </button>
                </div>
             </div>
          ) : (
            // --- GLOBAL PRIORITY FEED (DEFAULT VIEW) ---
            <div className="h-full flex flex-col space-y-6">
              
              {/* Priority Feed Card */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex-1">
                <div className="flex items-center justify-between mb-6">
                   <h3 className="font-bold text-slate-900 flex items-center gap-2">
                     <Bell size={18} className="text-amber-500" />
                     {t.priorityFeed}
                   </h3>
                   <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-bold">
                     {globalPendingDocs.length} {t.pendingCount}
                   </span>
                </div>

                <div className="space-y-4">
                  {globalPendingDocs.length > 0 ? (
                    globalPendingDocs.map((item, idx) => (
                      <div key={`${item.client.id}-${item.id}`} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-200 transition-colors cursor-pointer group" onClick={() => handleEditClick(item.client)}>
                         <div className="mt-1">
                           <div className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold text-xs">
                             {item.client.companyName.charAt(0)}
                           </div>
                         </div>
                         <div className="flex-1">
                           <div className="flex justify-between items-start">
                             <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600">{item.client.companyName}</h4>
                             <span className="text-[10px] text-slate-400 whitespace-nowrap">Today</span>
                           </div>
                           <p className="text-xs text-slate-600 mt-1">
                             Uploaded <span className="font-medium text-slate-800">{item.name}</span> for review.
                           </p>
                           <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-100 px-2 py-0.5 rounded">
                             {t.reviewNow} <ArrowRight size={10} />
                           </div>
                         </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 size={32} />
                      </div>
                      <p className="text-slate-900 font-bold">{t.caughtUp}</p>
                      <p className="text-slate-500 text-xs mt-1">{t.noPending}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Shortcuts Card */}
              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="font-bold mb-4">{t.quickActions}</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-start transition-colors">
                    <Users size={18} className="mb-2 text-blue-400" />
                    <p className="text-xs font-medium">{t.addClient}</p>
                  </button>
                  <button className="bg-white/10 hover:bg-white/20 p-3 rounded-xl text-start transition-colors">
                    <FileCheck size={18} className="mb-2 text-green-400" />
                    <p className="text-xs font-medium">{t.docAudit}</p>
                  </button>
                </div>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};
