import React, { useState, useEffect } from 'react';
import { 
  Search, 
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
  Check,
  ListTodo,
  UserCheck,
  AlertTriangle
} from 'lucide-react';
import { ClientData, TimelineStep, ClientTask } from '../types';
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
  const [localClient, setLocalClient] = useState<ClientData | null>(null);
  const [newStepLabel, setNewStepLabel] = useState('');
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [isDirty, setIsDirty] = useState(false);
  const [editingStepId, setEditingStepId] = useState<string | null>(null);
  const [tempStepLabel, setTempStepLabel] = useState('');

  const t = translations[lang].adminFollowUp;
  const commonT = translations[lang].common;

  useEffect(() => {
    if (initialClientId) {
      setSelectedClientId(initialClientId);
    }
  }, [initialClientId]);

  const filteredClients = clients.filter(c => {
    const matchesSearch = c.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || 
                          (filterType === 'completed' && c.progress === 100) ||
                          (filterType === 'in-progress' && c.progress < 100);
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (selectedClientId) {
      const found = clients.find(c => c.id === selectedClientId);
      if (found) {
        setLocalClient(JSON.parse(JSON.stringify(found)));
        setIsDirty(false);
        setEditingStepId(null);
      }
    } else {
      setLocalClient(null);
    }
  }, [selectedClientId, clients]);

  const handleTimelineStatusChange = (stepId: string, newStatus: 'pending' | 'in-progress' | 'completed') => {
    if (!localClient) return;
    const updatedTimeline = localClient.timeline.map(step => 
      step.id === stepId ? { ...step, status: newStatus } : step
    );
    setLocalClient({ ...localClient, timeline: updatedTimeline });
    setIsDirty(true);
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

  const handleAddTaskToClient = () => {
    if (!localClient || !newTaskTitle.trim()) return;
    const newTask: ClientTask = {
      id: `task-${Date.now()}`,
      title: newTaskTitle,
      description: 'Requirement from Legal Advisor',
      status: 'pending',
      priority: newTaskPriority,
      createdAt: new Date().toISOString()
    };
    const updatedTasks = [...(localClient.clientTasks || []), newTask];
    setLocalClient({ ...localClient, clientTasks: updatedTasks });
    setNewTaskTitle('');
    setNewTaskPriority('medium');
    setIsDirty(true);
  };

  const handleDeleteTask = (taskId: string) => {
    if (!localClient) return;
    const updatedTasks = localClient.clientTasks.filter(t => t.id !== taskId);
    setLocalClient({ ...localClient, clientTasks: updatedTasks });
    setIsDirty(true);
  };

  const recalculateProgress = (timeline: TimelineStep[]) => {
    if (!localClient || timeline.length === 0) return;
    const total = timeline.length;
    const completed = timeline.filter(s => s.status === 'completed').length;
    const inProgress = timeline.filter(s => s.status === 'in-progress').length;
    const progress = Math.round(((completed + (inProgress * 0.5)) / total) * 100);
    setLocalClient(prev => prev ? ({ ...prev, progress }) : null);
  };

  const handleSaveChanges = () => {
    if (!localClient) return;
    onUpdateClient(localClient.id, {
      timeline: localClient.timeline,
      clientTasks: localClient.clientTasks,
      progress: localClient.progress,
      statusMessage: localClient.statusMessage
    });
    setIsDirty(false);
  };

  const clientCompletionRate = localClient ? (
    localClient.clientTasks?.length > 0 
      ? Math.round((localClient.clientTasks.filter(t => t.status === 'completed').length / localClient.clientTasks.length) * 100)
      : 0
  ) : 0;

  const handleWhatsApp = () => {
    if (!localClient?.phone) {
      alert("No phone number registered for this client.");
      return;
    }
    const cleanPhone = localClient.phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanPhone}`, '_blank');
  };

  const handleEmail = () => {
    if (!localClient?.email) return;
    window.location.href = `mailto:${localClient.email}`;
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col md:flex-row gap-6 animate-fade-in font-sans">
      <div className="w-full md:w-1/3 flex flex-col bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">{t.title}</h2>
          <div className="relative">
            <Search className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3" size={16} />
            <input type="text" placeholder={commonT.search} value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full py-2 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {filteredClients.map(client => (
            <div key={client.id} onClick={() => setSelectedClientId(client.id)} className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedClientId === client.id ? 'bg-blue-50 border-blue-200 shadow-sm' : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-100'}`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-xs font-bold text-slate-500 overflow-hidden shadow-sm">{client.companyName.charAt(0)}</div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{client.companyName}</h4>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{client.serviceType}</p>
                  </div>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                 <div className={`h-full rounded-full transition-all ${client.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`} style={{ width: `${client.progress}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="w-full md:w-2/3 flex flex-col bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative">
        {localClient ? (
          <>
             <div className="bg-white p-6 border-b border-slate-200 flex justify-between items-center shadow-sm z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-600 border border-blue-500 flex items-center justify-center text-white font-bold text-xl shadow-md">{localClient.companyName.charAt(0)}</div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">{localClient.companyName}</h2>
                    <p className="text-xs text-slate-500 font-medium">{localClient.serviceType}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button onClick={handleSaveChanges} disabled={!isDirty} className={`px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 transition-all ${isDirty ? 'bg-slate-900 text-white shadow-lg' : 'bg-slate-100 text-slate-400'}`}><Save size={14} /> {isDirty ? t.saveChanges : commonT.save}</button>
                </div>
             </div>

             <div className="flex-1 overflow-y-auto p-6 md:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2"><Clock className="text-blue-600" size={16} />{t.projectTimeline}</h3>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm">
                         {localClient.timeline.map((step) => (
                           <div key={step.id} className="flex items-center gap-3 group">
                              <button onClick={() => handleTimelineStatusChange(step.id, step.status === 'completed' ? 'pending' : step.status === 'in-progress' ? 'completed' : 'in-progress')} className={`w-8 h-8 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${step.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : step.status === 'in-progress' ? 'border-blue-500 text-blue-500' : 'border-slate-200 text-slate-200'}`}>{step.status === 'completed' ? <Check size={14} /> : <div className={`w-1.5 h-1.5 rounded-full ${step.status === 'in-progress' ? 'bg-blue-500 animate-pulse' : 'bg-slate-200'}`} />}</button>
                              <div className="flex-1"><p className={`text-sm font-bold ${step.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-700'}`}>{step.label}</p></div>
                              <button onClick={() => setLocalClient({...localClient, timeline: localClient.timeline.filter(s => s.id !== step.id), progress: 0})} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-opacity"><Trash2 size={14} /></button>
                           </div>
                         ))}
                         <div className="pt-4 flex gap-2">
                            <input type="text" value={newStepLabel} onChange={(e) => setNewStepLabel(e.target.value)} placeholder="New milestone..." className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:ring-1 focus:ring-blue-500" />
                            <button onClick={handleAddStep} className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"><Plus size={16} /></button>
                         </div>
                      </div>

                      {/* CONTACT CLIENT SECTION */}
                      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                         <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2"><Smartphone className="text-green-600" size={16} /> Contact Client</h3>
                         <div className="flex gap-3">
                            <button 
                              onClick={handleWhatsApp}
                              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-[#25D366] text-white rounded-xl font-bold text-sm shadow-md shadow-green-200 hover:bg-[#20bd5a] transition-all"
                            >
                               <Smartphone size={18} /> WhatsApp
                            </button>
                            <button 
                              onClick={handleEmail}
                              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-md shadow-slate-200 hover:bg-slate-800 transition-all"
                            >
                               <Mail size={18} /> Email
                            </button>
                         </div>
                      </div>
                   </div>

                   <div className="space-y-6">
                      <div className="flex items-center justify-between">
                         <h3 className="font-bold text-slate-900 text-sm uppercase tracking-widest flex items-center gap-2"><UserCheck className="text-amber-600" size={16} />{t.clientActionItems}</h3>
                         <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-100">{clientCompletionRate}% DONE</span>
                      </div>
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4 shadow-sm border-t-4 border-t-amber-400">
                         {localClient.clientTasks?.map((task) => (
                           <div key={task.id} className="flex items-start gap-3 group p-2 hover:bg-slate-50 rounded-lg transition-colors">
                              <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 flex items-center justify-center ${task.status === 'completed' ? 'bg-green-500' : task.status === 'in-progress' ? 'bg-blue-500' : 'bg-slate-200'}`}>{task.priority === 'high' && <div className="w-1 h-1 bg-white rounded-full animate-ping" />}</div>
                              <div className="flex-1 min-w-0"><p className={`text-sm font-bold truncate ${task.status === 'completed' ? 'text-slate-400' : 'text-slate-800'}`}>{task.title}</p>
                                 <div className="flex items-center gap-2 mt-0.5"><span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter">{task.status}</span><span className={`text-[9px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded border ${task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : task.priority === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-slate-50 text-slate-500 border-slate-100'}`}>{task.priority}</span></div>
                              </div>
                              <button onClick={() => handleDeleteTask(task.id)} className="opacity-0 group-hover:opacity-100 p-1 text-slate-300 hover:text-red-500 transition-opacity"><Trash2 size={14} /></button>
                           </div>
                         ))}
                         {(!localClient.clientTasks || localClient.clientTasks.length === 0) && <p className="text-center py-4 text-xs text-slate-400 italic">No tasks assigned to client yet.</p>}
                         <div className="pt-4 border-t border-slate-50 space-y-3">
                            <div className="flex items-center gap-2 p-1 bg-slate-50 rounded-xl border border-slate-200 w-fit">
                               {(['low', 'medium', 'high'] as const).map(p => (
                                 <button key={p} type="button" onClick={() => setNewTaskPriority(p)} className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-tighter transition-all ${newTaskPriority === p ? p === 'high' ? 'bg-red-500 text-white shadow-md' : p === 'medium' ? 'bg-amber-500 text-white shadow-md' : 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>{p}</button>
                               ))}<span className="text-[9px] font-bold text-slate-300 uppercase tracking-widest px-2">Set Urgency</span>
                            </div>
                            <div className="flex gap-2">
                               <input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder={t.assignTask} className="flex-1 px-3 py-2 bg-slate-50 border border-slate-100 rounded-lg text-xs focus:ring-1 focus:ring-amber-500 font-semibold" />
                               <button onClick={handleAddTaskToClient} className={`p-2 rounded-lg transition-all active:scale-95 ${newTaskPriority === 'high' ? 'bg-red-500 hover:bg-red-600' : 'bg-amber-600 hover:bg-amber-700'} text-white shadow-lg`}><Plus size={16} /></button>
                            </div>
                         </div>
                      </div>
                      <div className="bg-blue-900 rounded-2xl p-6 text-white shadow-xl shadow-blue-900/20 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform"></div>
                         <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Public Status Display</p>
                         <textarea value={localClient.statusMessage || ''} onChange={(e) => setLocalClient({...localClient, statusMessage: e.target.value})} className="w-full bg-transparent border-none p-0 text-sm font-semibold text-slate-200 focus:ring-0 resize-none min-h-[60px]" />
                         <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase text-blue-400"><span>Mission Progress</span><span>{localClient.progress}%</span></div>
                         <div className="mt-2 w-full bg-white/10 h-1.5 rounded-full overflow-hidden"><div className="h-full bg-blue-500 transition-all duration-700" style={{ width: `${localClient.progress}%` }}></div></div>
                      </div>
                   </div>
                </div>
             </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center"><ListTodo size={64} className="mb-4 opacity-10" /><h3 className="text-xl font-bold text-slate-900 mb-2">{t.selectClient}</h3><p className="max-w-xs mx-auto text-sm">{t.selectClientSub}</p></div>
        )}
      </div>
    </div>
  );
};
