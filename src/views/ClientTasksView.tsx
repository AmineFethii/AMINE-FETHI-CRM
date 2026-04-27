
import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  AlertCircle,
  Calendar,
  ChevronRight,
  TrendingUp,
  ListTodo,
  CheckCircle,
  Plus,
  Trash2,
  Undo2,
  AlertTriangle,
  Send,
  RefreshCw,
  Zap,
  CloudUpload
} from 'lucide-react';
import { ClientData, ClientTask } from '../types';
import { translations } from '../translations';

interface ClientTasksViewProps {
  client: ClientData;
  onUpdateTask: (taskId: string, status: ClientTask['status']) => void;
  onAddTask: (task: Omit<ClientTask, 'id' | 'createdAt'>) => void;
  onDeleteTask: (taskId: string) => void;
  onPushUpdate?: (clientId: string) => void;
  onNavigate?: (view: string) => void;
}

export const ClientTasksView: React.FC<ClientTasksViewProps> = ({ 
  client, 
  onUpdateTask, 
  onAddTask,
  onDeleteTask,
  onPushUpdate,
  onNavigate 
}) => {
  const t = translations.en.clientPortal;
  const commonT = translations.en.common;

  const [isAdding, setIsAdding] = useState(false);
  const [isPushing, setIsPushing] = useState(false);
  const [lastPush, setLastPush] = useState<Date | null>(null);
  
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as ClientTask['priority'],
    dueDate: ''
  });

  const tasks = client.clientTasks || [];
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks at the bottom
    if (a.status === 'completed' && b.status !== 'completed') return 1;
    if (a.status !== 'completed' && b.status === 'completed') return -1;
    // High priority first
    const priorityMap = { high: 0, medium: 1, low: 2 };
    return priorityMap[a.priority] - priorityMap[b.priority];
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const totalCount = tasks.length;
  const completionRate = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;
    onAddTask({
      title: newTask.title,
      description: newTask.description || 'Personal task for mission follow-up',
      status: 'pending',
      priority: newTask.priority,
      dueDate: newTask.dueDate || undefined
    });
    setNewTask({ title: '', description: '', priority: 'medium', dueDate: '' });
    setIsAdding(false);
  };

  const handlePushUpdates = () => {
    if (!onPushUpdate) return;
    setIsPushing(true);
    // Visual delay to simulate processing
    setTimeout(() => {
      onPushUpdate(client.id);
      setIsPushing(false);
      setLastPush(new Date());
    }, 1500);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{translations.en.layout.myTasks}</h1>
          <p className="text-slate-500 mt-1">Manage your internal items and advisor requests in one place.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button 
            onClick={handlePushUpdates}
            disabled={isPushing}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all border ${
              isPushing 
                ? 'bg-slate-50 text-slate-400 border-slate-200 cursor-not-allowed' 
                : 'bg-white text-blue-600 border-blue-200 hover:bg-blue-50 shadow-sm active:scale-95'
            }`}
          >
            {isPushing ? (
              <><RefreshCw size={18} className="animate-spin" /> Pushing Updates...</>
            ) : (
              <><CloudUpload size={18} /> Push Updates to Advisor</>
            )}
          </button>
          
          <button 
            onClick={() => setIsAdding(!isAdding)}
            className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95 ${
              isAdding 
                ? 'bg-slate-100 text-slate-600 border border-slate-200 shadow-none' 
                : 'bg-blue-600 text-white shadow-blue-600/20 hover:bg-blue-700'
            }`}
          >
            {isAdding ? t.taskForm.cancel : <><Plus size={18} /> {t.taskForm.title}</>}
          </button>
        </div>
      </div>

      {/* Sync Status Banner */}
      {lastPush && !isPushing && (
        <div className="bg-green-50 border border-green-100 p-3 rounded-2xl flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-3 text-green-700">
            <CheckCircle size={18} />
            <p className="text-xs font-bold uppercase tracking-wider">Updates successfully synced with advisor logic</p>
          </div>
          <span className="text-[10px] font-black text-green-600 opacity-60">Last sync: {lastPush.toLocaleTimeString()}</span>
        </div>
      )}

      {/* Quick Add Form */}
      {isAdding && (
        <div className="bg-white rounded-3xl border border-blue-200 p-6 shadow-xl shadow-blue-600/5 animate-slide-in-down">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.taskForm.taskName}</label>
                <input 
                  type="text" 
                  autoFocus
                  required
                  value={newTask.title}
                  onChange={e => setNewTask({...newTask, title: e.target.value})}
                  placeholder={t.taskForm.taskNamePlaceholder}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.taskForm.priority}</label>
                <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200 h-[50px]">
                  {(['low', 'medium', 'high'] as const).map(p => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setNewTask({...newTask, priority: p})}
                      className={`flex-1 rounded-lg text-[10px] font-black uppercase tracking-tighter transition-all ${
                        newTask.priority === p 
                          ? p === 'high' ? 'bg-red-500 text-white shadow-md' : 'bg-blue-600 text-white shadow-md'
                          : 'text-slate-500 hover:text-slate-700'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.taskForm.dueDate}</label>
                <input 
                  type="date" 
                  value={newTask.dueDate}
                  onChange={e => setNewTask({...newTask, dueDate: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-semibold"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{t.taskForm.description}</label>
              <textarea 
                value={newTask.description}
                onChange={e => setNewTask({...newTask, description: e.target.value})}
                placeholder={t.taskForm.descriptionPlaceholder}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none min-h-[80px] text-sm"
              />
            </div>
            <div className="flex justify-end">
              <button 
                type="submit"
                className="bg-slate-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-slate-800 transition-all flex items-center gap-2"
              >
                <Send size={16} /> {t.taskForm.save}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Hero Progress Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden group shadow-xl">
           <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:opacity-30 transition-opacity"></div>
           <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                 <div className="p-3 bg-white/10 rounded-2xl border border-white/10">
                    <ListTodo size={24} className="text-blue-400" />
                 </div>
                 <div>
                    <h3 className="text-xl font-bold">Project Momentum</h3>
                    <p className="text-slate-400 text-sm">Self-managed tasks and advisor requirements summary.</p>
                 </div>
              </div>

              <div className="flex items-end gap-6">
                 <div className="flex-1">
                    <div className="flex justify-between items-center mb-2">
                       <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Completion Velocity</span>
                       <span className="text-2xl font-black text-blue-400">{completionRate}%</span>
                    </div>
                    <div className="h-3 w-full bg-white/10 rounded-full overflow-hidden">
                       <div 
                         className="h-full bg-gradient-to-r from-blue-600 to-blue-400 transition-all duration-1000 ease-out" 
                         style={{ width: `${completionRate}%` }}
                       ></div>
                    </div>
                 </div>
                 <div className="text-center px-6 py-2 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm">
                    <p className="text-2xl font-black">{completedCount}/{totalCount}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Done</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col justify-center gap-4">
           <div className="flex items-center gap-3 text-amber-600">
              <AlertCircle size={20} />
              <span className="text-sm font-bold uppercase tracking-widest">Workflow Tip</span>
           </div>
           <p className="text-slate-600 text-sm leading-relaxed">
             Track your internal business items alongside our requests to ensure a smooth transition and full legal compliance.
           </p>
           <div className="pt-4 border-t border-slate-100 mt-2">
              <div className="flex items-center gap-2 text-blue-600 text-xs font-bold uppercase tracking-wider">
                 <Calendar size={14} /> Total Open Items: {totalCount - completedCount}
              </div>
           </div>
        </div>
      </div>

      {/* Task List Section */}
      <div className="space-y-4">
         <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Personal Checklist</h2>
         
         <div className="grid grid-cols-1 gap-4">
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <div key={task.id} className={`group bg-white rounded-2xl border transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between p-6 ${
                  task.status === 'completed' ? 'border-slate-100 bg-slate-50/30' : 'border-slate-200 hover:border-blue-300 hover:shadow-md'
                }`}>
                  <div className="flex items-start gap-5">
                     <button 
                       onClick={() => onUpdateTask(task.id, task.status === 'completed' ? 'pending' : 'completed')}
                       className={`w-10 h-10 rounded-xl border-2 flex items-center justify-center transition-all flex-shrink-0 ${
                         task.status === 'completed' ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-slate-200 text-slate-200 group-hover:border-blue-200'
                       }`}
                     >
                       {task.status === 'completed' ? <CheckCircle size={20} /> : <Circle size={20} />}
                     </button>
                     <div className="min-w-0">
                        <h3 className={`text-lg font-bold leading-tight ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-900'}`}>{task.title}</h3>
                        <p className={`text-sm mt-1 max-w-xl ${task.status === 'completed' ? 'text-slate-300' : 'text-slate-500'}`}>{task.description}</p>
                        <div className="flex flex-wrap items-center gap-4 mt-3">
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                             task.priority === 'high' ? 'bg-red-50 text-red-600 border-red-100' : 
                             task.priority === 'medium' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                             'bg-slate-50 text-slate-500 border-slate-100'
                           }`}>
                           {task.priority} Priority
                           </span>
                           {task.dueDate && (
                             <span className="text-[10px] text-amber-600 font-bold uppercase flex items-center gap-1">
                               <Clock size={10} /> Due {new Date(task.dueDate).toLocaleDateString()}
                             </span>
                           )}
                           <span className="text-[10px] text-slate-400 font-bold uppercase flex items-center gap-1">
                              <Calendar size={10} /> Created {new Date(task.createdAt).toLocaleDateString()}
                           </span>
                           <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded border ${
                             task.status === 'completed' ? 'bg-green-50 text-green-600 border-green-100' :
                             task.status === 'in-progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                             'bg-slate-50 text-slate-400 border-slate-100'
                           }`}>
                             {task.status}
                           </span>
                        </div>
                     </div>
                  </div>

                  <div className="mt-6 md:mt-0 flex items-center gap-3">
                     {task.status === 'completed' ? (
                       <>
                         <button 
                           onClick={() => onUpdateTask(task.id, 'pending')}
                           className="flex items-center gap-2 text-blue-600 font-bold text-xs px-4 py-2 bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors"
                         >
                            <Undo2 size={14} /> Undo Completion
                         </button>
                         <button 
                           onClick={() => onDeleteTask(task.id)}
                           className="p-2.5 text-slate-300 hover:text-red-500 transition-colors"
                         >
                            <Trash2 size={18} />
                         </button>
                       </>
                     ) : (
                       <div className="flex gap-2 w-full md:w-auto">
                          <button 
                            onClick={() => onUpdateTask(task.id, 'completed')}
                            className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold text-xs shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all active:scale-95"
                          >
                            Mark Done
                          </button>
                          <button 
                            onClick={() => onDeleteTask(task.id)}
                            className="p-2.5 text-slate-300 hover:text-red-500 transition-colors bg-slate-50 rounded-xl border border-slate-100 hover:border-red-100"
                          >
                             <Trash2 size={18} />
                          </button>
                       </div>
                     )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 rounded-3xl border border-dashed border-slate-200 py-20 text-center">
                 <ListTodo size={48} className="mx-auto text-slate-200 mb-4" />
                 <h3 className="text-slate-900 font-bold">Empty Checklist</h3>
                 <p className="text-slate-400 text-sm max-w-xs mx-auto mt-1">Start adding tasks you need to complete for your business mission.</p>
              </div>
            )}
         </div>
      </div>

      {/* Support Call to Action */}
      <div className="bg-white rounded-3xl border border-slate-200 p-8 flex flex-col md:flex-row items-center justify-between gap-6">
         <div className="flex items-center gap-5">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
               <TrendingUp size={24} />
            </div>
            <div>
               <h4 className="font-bold text-slate-900">Mission Obstacles?</h4>
               <p className="text-sm text-slate-500">If you're stuck on a task, don't hesitate to reach out to our legal team.</p>
            </div>
         </div>
         <button 
           onClick={() => onNavigate?.('chat')}
           className="w-full md:w-auto px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
         >
            Ask Legal Advisor <ChevronRight size={16} />
         </button>
      </div>
    </div>
  );
};
