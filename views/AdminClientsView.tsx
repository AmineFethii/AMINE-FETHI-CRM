
import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  PieChart, 
  Briefcase, 
  Building2, 
  ArrowUpRight, 
  Users,
  Layers,
  MoreHorizontal,
  FolderOpen,
  MapPin,
  Clock,
  TrendingUp,
  CheckCircle2
} from 'lucide-react';
import { ClientData } from '../types';
import { translations } from '../translations';

interface AdminClientsViewProps {
  clients: ClientData[];
  onManageClient: (clientId: string) => void;
}

type GroupBy = 'category' | 'service';

export const AdminClientsView: React.FC<AdminClientsViewProps> = ({ clients, onManageClient }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const t = translations.en.clients;
  const commonT = translations.en.common;

  // Filter clients based on search
  const filteredClients = useMemo(() => {
    return clients.filter(c => 
      c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [clients, searchTerm]);

  // Group clients
  const groupedClients = useMemo(() => {
    const groups: Record<string, ClientData[]> = {};
    
    filteredClients.forEach(client => {
      const key = groupBy === 'category' ? (client.companyCategory || 'Uncategorized') : client.serviceType;
      if (!groups[key]) groups[key] = [];
      groups[key].push(client);
    });

    return groups;
  }, [filteredClients, groupBy]);

  // Statistics
  const totalClients = clients.length;
  const totalContractValue = clients.reduce((sum, c) => sum + c.contractValue, 0);
  const activeMissions = clients.filter(c => c.progress < 100).length;

  const categories = Object.keys(groupedClients).sort();

  // Clients to display based on selection
  const displayClients = selectedCategory 
    ? (groupedClients[selectedCategory] || [])
    : filteredClients;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button 
            onClick={() => { setGroupBy('category'); setSelectedCategory(null); }}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              groupBy === 'category' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Building2 size={14} />
            {t.byIndustry}
          </button>
          <button 
            onClick={() => { setGroupBy('service'); setSelectedCategory(null); }}
            className={`px-4 py-2 rounded-md text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 ${
              groupBy === 'service' 
                ? 'bg-slate-900 text-white shadow-md' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            <Layers size={14} />
            {t.byService}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-blue-300 transition-colors">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalPortfolio}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalClients} <span className="text-sm font-medium text-slate-400">Clients</span></h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between group hover:border-green-300 transition-colors">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{translations.en.adminDashboard.activeMissions}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{activeMissions} <span className="text-sm font-medium text-slate-400">{t.ongoing}</span></h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
            <Briefcase size={24} />
          </div>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.estValue}</p>
            <h3 className="text-3xl font-bold mt-1">{(totalContractValue / 1000).toFixed(1)}k <span className="text-sm font-medium text-slate-500">MAD</span></h3>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center relative z-10 group-hover:scale-110 transition-transform">
            <PieChart size={24} />
          </div>
          <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity"></div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Categories List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3" size={16} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm pl-9 pr-4 placeholder:text-slate-400"
            />
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm">
                {groupBy === 'category' ? t.byIndustry : t.byService} {t.breakdown}
              </h3>
            </div>
            <div className="divide-y divide-slate-50">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center transition-colors ${
                  selectedCategory === null ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <span>{t.allCategories}</span>
                <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-slate-100 text-slate-400 font-bold">{totalClients}</span>
              </button>
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`w-full text-left px-4 py-3 text-sm flex justify-between items-center transition-colors ${
                    selectedCategory === cat ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate pr-2">{cat}</span>
                  <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs text-slate-500 font-bold">{groupedClients[cat].length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Client Cards */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-xl flex items-center gap-2">
              {selectedCategory || t.allCategories}
              <span className="text-sm font-normal text-slate-400">({displayClients.length})</span>
            </h2>
            <div className="text-xs text-slate-500">
               Showing {displayClients.length} results
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {displayClients.map(client => (
              <div key={client.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group overflow-hidden flex flex-col">
                {/* Card Header Pattern */}
                <div className="h-20 bg-slate-900 relative overflow-hidden">
                   <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
                   <div className="absolute top-2 right-2">
                      <button className="p-1.5 bg-black/20 text-white rounded-lg hover:bg-black/40 transition-colors">
                         <MoreHorizontal size={16} />
                      </button>
                   </div>
                </div>

                <div className="px-5 pb-5 flex-1 flex flex-col">
                   {/* Avatar & Info */}
                   <div className="relative -mt-10 mb-3 flex justify-between items-end">
                      <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-md">
                         <div className="w-full h-full rounded-lg bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100 text-slate-400 font-bold text-xl">
                            {client.avatarUrl ? <img src={client.avatarUrl} className="w-full h-full object-cover" /> : client.companyName.charAt(0)}
                         </div>
                      </div>
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${
                        client.progress === 100 
                          ? 'bg-green-50 text-green-700 border-green-100' 
                          : 'bg-blue-50 text-blue-700 border-blue-100'
                      }`}>
                        {client.progress === 100 ? commonT.completed : commonT.inProgress}
                      </span>
                   </div>

                   <h3 className="font-bold text-slate-900 text-lg leading-tight mb-1 truncate" title={client.companyName}>
                     {client.companyName}
                   </h3>
                   <p className="text-xs text-slate-500 mb-4">{client.name}</p>

                   <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                         <Layers size={14} className="text-slate-400" />
                         <span className="font-medium">{client.serviceType}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                         <Building2 size={14} className="text-slate-400" />
                         <span>{client.companyCategory}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                         <Clock size={14} className="text-slate-400" />
                         <span>Updated today</span>
                      </div>
                   </div>

                   <div className="mt-auto">
                      <div className="flex justify-between items-center text-xs mb-1.5">
                         <span className="font-bold text-slate-700">{client.progress}% Progress</span>
                         {client.progress === 100 && <CheckCircle2 size={14} className="text-green-500" />}
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                         <div 
                           className={`h-full rounded-full transition-all duration-500 ${client.progress === 100 ? 'bg-green-500' : 'bg-blue-600'}`} 
                           style={{ width: `${client.progress}%` }}
                         ></div>
                      </div>

                      <div className="flex gap-2">
                        <button className="flex-1 py-2 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 hover:text-blue-600 transition-colors flex items-center justify-center gap-2">
                           <FolderOpen size={14} />
                           View
                        </button>
                        <button 
                          onClick={() => onManageClient(client.id)}
                          className="flex-1 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 shadow-sm transition-colors"
                        >
                           Manage
                        </button>
                      </div>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          {displayClients.length === 0 && (
             <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-slate-900 font-bold text-lg">No clients found</h3>
                <p className="text-slate-500 text-sm mt-1">Try adjusting your filters or search terms.</p>
                <button 
                  onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
                  className="mt-4 px-4 py-2 bg-white border border-slate-300 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
                >
                   Clear Filters
                </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};
