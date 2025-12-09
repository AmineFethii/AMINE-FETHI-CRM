
import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Send, 
  Save, 
  Plus, 
  Trash2, 
  MoreVertical, 
  ArrowRight,
  MessageSquare,
  Mail,
  Smartphone,
  CheckCircle,
  Edit2,
  X,
  Check
} from 'lucide-react';
import { ClientData, TimelineStep } from '../types';
import { translations, Language } from '../translations';

interface AdminFollowUpViewProps {
  clients: ClientData[];
  onUpdateClient: (clientId: string, updates: Partial<ClientData>) => void;
  lang: Language;
  initialClientId?: string | null;
}

export const AdminFollowUpView: React.FC<AdminFollowUpViewProps> = ({ clients, onUpdateClient, lang, initialClientId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(initialClientId || null);
  const [filterType, setFilterType] = useState<'all' | 'in-progress' | 'completed'>('all');
  
  // Selected Client Local State for Editing
  const [localClient, setLocalClient] = useState<ClientData | null>(null);
  const [newStepLabel, setNewStepLabel] = useState('');
  const [isDirty, setIsDirty] = useState(false);

  // Step Editing State
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [tempStepLabel, setTempStepLabel] = useState('');

  const t = translations[lang].adminFollowUp;
  const commonT = translations[lang].common;

  // Sync initialClientId when it changes
  useEffect(() => {
    if (initialClientId) {
      setSelectedClientId(initialClientId);
    }
  }, [initialClientId]);

  // Filter clients
  const filteredClients = clients.filter(c => {
    const matchesSearch = c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'completed' && c.progress === 100) ||
                          (filterType === 'in-progress' && c.progress < 100);
    return matchesSearch && matchesFilter;
  });

  // Sync local state when selection changes
  useEffect(() => {
    if (selectedClientId) {
      const found = clients.find(c => c.id === selectedClientId);
      if (found) {
        setLocalClient(JSON.parse(JSON.stringify(found))); // Deep copy
        setIsDirty(false);
        setEditingStepId(null); // Reset editing state on client change
      }
    } else {
      setLocalClient(null);
    }
  }, [selectedClientId, clients]);

  // Timeline handlers
  const handleTimelineStatusChange = (stepId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    if (!localClient) return;

    const updatedTimeline = localClient.timeline.map(step => 
      step.id === stepId ? { ...step, status: newStatus } : step
    );

    setLocalClient({ ...localClient, timeline: updatedTimeline });
    setIsDirty(true);
    
    // Auto-recalculate progress
    recalculateProgress(updatedTimeline);
  };

  const handleAddStep = () => {
    if (!localClient || !newStepLabel.trim()) return;
    const newStep: TimelineStep = {
      id: `t-${Date.now()}`,
      label: newStepLabel,
      status: 'pending'
    };
    const updatedTimeline = [...localClient.timeline, newStep];
    setLocalClient({ ...localClient, timeline: updatedTimeline });
    setNewStepLabel('');
    setIsDirty(true);
    recalculateProgress(updatedTimeline);
  };

  const handleDeleteStep = (stepId: string) => {
    if (!localClient) return;
    const updatedTimeline = localClient.timeline.filter(s => s.id !== stepId);
    setLocalClient({ ...localClient, timeline: updatedTimeline });
    setIsDirty(true);
    recalculateProgress(updatedTimeline);
  };

  // --- Step Editing Handlers ---
  const startEditingStep = (step: TimelineStep) => {
    setEditingStepId(step.id);
    setTempStepLabel(step.label);
  };

  const saveStepLabel = () => {
    if (!localClient || !editingStepId || !tempStepLabel.trim()) return;
    
    const updatedTimeline = localClient.timeline.map(step => 
      step.id === editingStepId ? { ...step, label: tempStepLabel } : step
    );
    
    setLocalClient({ ...localClient, timeline: updatedTimeline });
    setIsDirty(true);
    setEditingStepId(null);
    setTempStepLabel('');
  };

  const cancelEditingStep = () => {
    setEditingStepId(null);
    setTempStepLabel('');
  };

  const recalculateProgress = (timeline: TimelineStep[]) => {
    if (!localClient || timeline.length === 0) return;
    
    const total = timeline.length;
    const completed = timeline.filter(s => s.status === 'completed').length;
    const inProgress = timeline.filter(s => s.status === 'in-progress').length;
    
    // Simple logic: Completed = 1pt, In-Progress = 0.5pt
    const progress = Math.round(((completed + (inProgress * 0.5)) / total) * 100);
    setLocalClient(prev => prev ? ({ ...prev, progress }) : null);
  };

  const handleStatusMessageChange = (msg: string) => {
    setLocalClient(prev => prev ? ({ ...prev, statusMessage: msg }) : null);
    setIsDirty(true);
  };

  const handleSaveChanges = () => {
    if (!localClient) return;
    onUpdateClient(localClient.id, {
      timeline: localClient.timeline,
      progress: localClient.progress,
      statusMessage: localClient.statusMessage
    });
    setIsDirty(false);
  };

  const handleQuickNotify = (type: 'whatsapp' | 'email') => {
     // Simulation
     alert(`Simulated ${type} sent to ${localClient?.email}`);
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fade-in">
      
      {/* LEFT COLUMN: CLIENT DIRECTORY */}
      <div className="w-full md:w-1/3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        
        {/* Header/Filters */}
        <div className="p-4 border-b border-slate-100 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">{t.title}</h2>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3" size={16} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setFilterType('all')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${filterType === 'all' ? 'bg-slate-900 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              {commonT.all}
            </button>
            <button 
              onClick={() => setFilterType('in-progress')}
              className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${filterType === 'in-progress' ? 'bg-blue-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              {commonT.inProgress}
            </button>
            <button 
               onClick={() => setFilterType('completed')}
               className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-colors ${filterType === 'completed' ? 'bg-green-600 text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
            >
              {commonT.completed}
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredClients.map(client => (
            <div 
              key={client.id}
              onClick={() => setSelectedClientId(client.id)}
              className={`p-3 rounded-xl cursor-pointer transition-all border ${
                selectedClientId === client.id 
                  ? 'bg-blue-50 border-blue-200 shadow-sm' 
                  : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden shadow-sm">
                    {client.avatarUrl ? <img src={client.avatarUrl} className="w-full h-full object-cover" /> : client.companyName.charAt(0)}
                  </div>
                  <div>
                    <h4 className={`font-bold text-sm ${selectedClientId === client.id ? 'text-blue-900' : 'text-slate-900'}`}>{client.companyName}</h4>
                    <p className="text-xs text-slate-500">{client.serviceType}</p>
                  </div>
                </div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  client.progress === 100 ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                }`}>
                  {client.progress}%
                </span>
              </div>
              <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                 <div className={`h-full rounded-full transition-all ${client.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${client.progress}%` }}></div>
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && (
            <div className="p-8 text-center text-slate-400 text-sm">
              No clients found.
            </div>
          )}
        </div>
      </div>

      {/* RIGHT COLUMN: WORKSPACE */}
      <div className="w-full md:w-2/3 flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative">
        {localClient ? (
          <>
             {/* Header */}
             <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-start shadow-sm z-10">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-2xl font-bold text-slate-400 overflow-hidden shadow-inner">
                    {localClient.avatarUrl ? <img src={localClient.avatarUrl} className="w-full h-full object-cover" /> : localClient.companyName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900">{localClient.companyName}</h2>
                    <div className="flex items-center gap-3 mt-1 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><Clock size={14} /> Last update: Today</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                      <span className="text-blue-600 font-medium">{localClient.serviceType}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                   <button onClick={() => handleQuickNotify('whatsapp')} className="p-2.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-lg transition-colors border border-green-200" title="WhatsApp">
                      <Smartphone size={20} />
                   </button>
                   <button onClick={() => handleQuickNotify('email')} className="p-2.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200" title="Email">
                      <Mail size={20} />
                   </button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   
                   {/* Timeline Column */}
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                           <CheckCircle2 className="text-blue-600" size={20} />
                           {t.projectTimeline}
                         </h3>
                         <span className="text-xs font-medium text-slate-400">{localClient.timeline.length} Steps</span>
                      </div>

                      <div className="relative pl-4 space-y-6 before:absolute before:left-[23px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                         {localClient.timeline.map((step, index) => (
                           <div key={step.id} className="relative pl-10 group">
                              {/* Connector/Dot */}
                              <button 
                                onClick={() => handleTimelineStatusChange(
                                  step.id, 
                                  step.status === 'completed' ? 'pending' : 
                                  step.status === 'in-progress' ? 'completed' : 'in-progress'
                                )}
                                className={`absolute left-0 top-0 w-12 h-12 rounded-full border-4 border-slate-50 flex items-center justify-center transition-all z-10 shadow-sm ${
                                  step.status === 'completed' ? 'bg-green-500 text-white hover:bg-green-600' :
                                  step.status === 'in-progress' ? 'bg-blue-500 text-white hover:bg-blue-600 ring-4 ring-blue-100' :
                                  'bg-white text-slate-300 border-slate-200 hover:border-blue-300'
                                }`}
                              >
                                {step.status === 'completed' ? <CheckCircle size={20} /> : 
                                 step.status === 'in-progress' ? <Clock size={20} /> : 
                                 <Circle size={20} />}
                              </button>
                              
                              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm group-hover:shadow-md transition-shadow relative">
                                 <div className="flex justify-between items-start">
                                    <div className="flex-1">
                                       {editingStepId === step.id ? (
                                         <div className="flex items-center gap-2 mb-1">
                                            <input 
                                              type="text" 
                                              value={tempStepLabel}
                                              onChange={(e) => setTempStepLabel(e.target.value)}
                                              className="flex-1 px-2 py-1 text-sm font-bold border border-blue-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                              autoFocus
                                              onKeyDown={(e) => {
                                                if (e.key === 'Enter') saveStepLabel();
                                                if (e.key === 'Escape') cancelEditingStep();
                                              }}
                                            />
                                            <button onClick={saveStepLabel} className="p-1 text-green-600 hover:bg-green-50 rounded">
                                              <Check size={16} />
                                            </button>
                                            <button onClick={cancelEditingStep} className="p-1 text-red-500 hover:bg-red-50 rounded">
                                              <X size={16} />
                                            </button>
                                         </div>
                                       ) : (
                                         <p className={`font-bold text-sm ${step.status === 'completed' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                            {step.label}
                                         </p>
                                       )}
                                       
                                       <p className={`text-xs mt-1 font-medium uppercase tracking-wider ${
                                          step.status === 'completed' ? 'text-green-600' : 
                                          step.status === 'in-progress' ? 'text-blue-600' : 'text-slate-400'
                                       }`}>
                                          {step.status.replace('-', ' ')}
                                       </p>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    {editingStepId !== step.id && (
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                         <button 
                                           onClick={() => startEditingStep(step)}
                                           className="text-slate-400 hover:text-blue-600 p-1 rounded hover:bg-slate-100"
                                           title="Edit Step Name"
                                         >
                                            <Edit2 size={14} />
                                         </button>
                                         <button 
                                           onClick={() => handleDeleteStep(step.id)}
                                           className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-slate-100"
                                           title="Delete Step"
                                         >
                                            <Trash2 size={14} />
                                         </button>
                                      </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                         ))}

                         {/* Add Step Input */}
                         <div className="relative pl-10">
                            <div className="absolute left-[14px] top-3 w-5 h-5 bg-slate-200 rounded-full z-10 border-2 border-white"></div>
                            <div className="flex gap-2">
                               <input 
                                 type="text" 
                                 value={newStepLabel}
                                 onChange={(e) => setNewStepLabel(e.target.value)}
                                 placeholder={t.stepName}
                                 className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                 onKeyDown={(e) => e.key === 'Enter' && handleAddStep()}
                               />
                               <button 
                                 onClick={handleAddStep}
                                 disabled={!newStepLabel.trim()}
                                 className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
                               >
                                  <Plus size={20} />
                               </button>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Status & Preview Column */}
                   <div className="space-y-6">
                      
                      {/* Live Status Card */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                         <h3 className="font-bold text-slate-900 text-lg mb-4 flex items-center gap-2">
                            <MessageSquare className="text-blue-600" size={20} />
                            {t.clientView}
                         </h3>
                         
                         <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Public Status Message</label>
                            <textarea 
                              value={localClient.statusMessage}
                              onChange={(e) => handleStatusMessageChange(e.target.value)}
                              className="w-full bg-white border border-slate-200 rounded-lg p-3 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[80px]"
                            />
                         </div>

                         <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                            <div className="flex-1">
                               <div className="flex justify-between items-center mb-1">
                                  <span className="text-xs font-bold text-blue-700 uppercase">Progress Display</span>
                                  <span className="text-lg font-bold text-blue-900">{localClient.progress}%</span>
                               </div>
                               <div className="h-2 w-full bg-white rounded-full overflow-hidden">
                                  <div className="h-full bg-blue-600 rounded-full transition-all duration-500" style={{ width: `${localClient.progress}%` }}></div>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Action Bar */}
                      <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-slate-200 shadow-lg">
                         <div className="flex gap-3">
                            <button 
                              onClick={handleSaveChanges}
                              disabled={!isDirty}
                              className={`flex-1 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                                isDirty 
                                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20 transform hover:-translate-y-0.5' 
                                  : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                              }`}
                            >
                              <Save size={18} />
                              {t.saveChanges}
                            </button>
                            {isDirty && (
                              <button 
                                onClick={() => {
                                  // Reset
                                  const original = clients.find(c => c.id === selectedClientId);
                                  if (original) {
                                    setLocalClient(JSON.parse(JSON.stringify(original)));
                                    setEditingStepId(null);
                                  }
                                  setIsDirty(false);
                                }}
                                className="px-4 py-3.5 rounded-xl font-bold text-sm bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                              >
                                {t.cancelChanges}
                              </button>
                            )}
                         </div>
                      </div>

                   </div>
                </div>
             </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center">
             <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-slate-100">
               <Search size={48} className="text-slate-200" />
             </div>
             <h3 className="text-xl font-bold text-slate-900 mb-2">{t.selectClient}</h3>
             <p className="max-w-xs mx-auto">{t.selectClientSub}</p>
          </div>
        )}
      </div>
    </div>
  );
};
