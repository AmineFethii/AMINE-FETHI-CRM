
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
  FolderOpen
} from 'lucide-react';
import { ClientData } from '../types';
import { translations, Language } from '../translations';

interface AdminClientsViewProps {
  clients: ClientData[];
  lang: Language;
}

type GroupBy = 'category' | 'service';

export const AdminClientsView: React.FC<AdminClientsViewProps> = ({ clients, lang }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [groupBy, setGroupBy] = useState<GroupBy>('category');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const t = translations[lang].clients;
  const commonT = translations[lang].common;
  const isRTL = lang === 'ar';

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

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
          <button 
            onClick={() => setGroupBy('category')}
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
            onClick={() => setGroupBy('service')}
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
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.totalPortfolio}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{totalClients} <span className="text-sm font-medium text-slate-400">Clients</span></h3>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{translations[lang].adminDashboard.activeMissions}</p>
            <h3 className="text-3xl font-bold text-slate-900 mt-1">{activeMissions} <span className="text-sm font-medium text-slate-400">{t.ongoing}</span></h3>
          </div>
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <Briefcase size={24} />
          </div>
        </div>
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-lg flex items-center justify-between relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t.estValue}</p>
            <h3 className="text-3xl font-bold mt-1">{(totalContractValue / 1000).toFixed(1)}k <span className="text-sm font-medium text-slate-500">MAD</span></h3>
          </div>
          <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center relative z-10">
            <PieChart size={24} />
          </div>
          <div className={`absolute -bottom-4 w-24 h-24 bg-blue-500 rounded-full blur-3xl opacity-20 ${isRTL ? '-left-4' : '-right-4'}`}></div>
        </div>
      </div>

      {/* Analysis Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Left Sidebar: Categories List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="relative">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
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
                <span className="bg-white px-2 py-0.5 rounded-full text-xs border border-slate-100 text-slate-400">{totalClients}</span>
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
                  <span className="bg-slate-100 px-2 py-0.5 rounded-full text-xs text-slate-500">{groupedClients[cat].length}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content: Client Cards */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-xl">
              {selectedCategory || t.allCategories}
              <span className="text-slate-400 font-normal text-base ml-2">
                ({selectedCategory ? (groupedClients[selectedCategory]?.length || 0) : totalClients})
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {categories
              .filter(cat => selectedCategory ? cat === selectedCategory : true)
              .map(cat => (
                <React.Fragment key={cat}>
                  {/* Category Header (Only if showing all) */}
                  {!selectedCategory && (
                    <div className="col-span-full mt-4 first:mt-0 flex items-center gap-3">
                      <div className="h-px bg-slate-200 flex-1"></div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
                        {cat}
                      </span>
                      <div className="h-px bg-slate-200 flex-1"></div>
                    </div>
                  )}
                  
                  {groupedClients[cat].map(client => (
                    <div key={client.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 group cursor-pointer">
                      <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-bold border border-slate-200 shadow-inner">
                            {client.avatarUrl ? (
                              <img src={client.avatarUrl} className="w-full h-full object-cover rounded-lg" alt="" />
                            ) : (
                              client.companyName.substring(0, 2).toUpperCase()
                            )}
                          </div>
                          <button className="text-slate-300 hover:text-blue-600 transition-colors">
                            <MoreHorizontal size={20} />
                          </button>
                        </div>
                        
                        <h3 className="font-bold text-slate-900 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                          {client.companyName}
                        </h3>
                        <p className="text-xs text-slate-500 font-medium mb-4 flex items-center gap-1">
                          {client.name}
                        </p>

                        <div className="space-y-3">
                           <div className="bg-slate-50 rounded-lg p-2.5 border border-slate-100">
                              <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-1">Service</p>
                              <p className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                                <Briefcase size={12} className="text-blue-500" />
                                {client.serviceType}
                              </p>
                           </div>

                           <div className="flex items-center justify-between text-xs">
                             <span className="text-slate-500">{translations[lang].adminDashboard.progress}</span>
                             <span className={`font-bold ${client.progress === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                               {client.progress}%
                             </span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                             <div 
                               className={`h-full rounded-full ${client.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                               style={{ width: `${client.progress}%` }}
                             ></div>
                           </div>
                        </div>
                      </div>
                      
                      <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 rounded-b-xl flex justify-between items-center">
                         <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                           client.companyCategory === 'Investment' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                           client.companyCategory === 'Consulting' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                           'bg-slate-100 text-slate-600 border-slate-200'
                         }`}>
                           {client.companyCategory}
                         </span>
                         <button className="text-slate-400 hover:text-slate-700">
                           <FolderOpen size={16} />
                         </button>
                      </div>
                    </div>
                  ))}
                </React.Fragment>
              ))}
          </div>
        </div>

      </div>
    </div>
  );
};
