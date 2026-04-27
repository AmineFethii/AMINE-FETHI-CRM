
import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Building2,
  TrendingUp,
  Bell,
  ArrowRight,
  User,
  Circle,
  MoreHorizontal
} from 'lucide-react';
import { ClientData } from '../types';
import { translations } from '../translations';

interface ClientPortalProps {
  client: ClientData;
  onNavigateToDocs: () => void;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ client, onNavigateToDocs }) => {
  const t = translations.en.clientPortal;
  const commonT = translations.en.common;

  // Progress Circle Math
  const radius = 80;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (client.progress / 100) * circumference;

  const isComplete = client.progress === 100;

  // Get recent notifications for the summary card
  const recentNotifications = (client.notifications || []).slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-full bg-blue-50 p-1 border border-slate-100 shadow-sm flex-shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-blue-600 relative flex items-center justify-center shadow-inner">
              <User size={32} className="text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2 tracking-tight">
              {t.greeting}, {client.companyName}
              <span className="inline-block origin-[70%_70%] hover:animate-pulse cursor-default">👋</span>
            </h1>
            <p className="text-slate-500 text-sm mt-0.5">{t.overview}</p>
          </div>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
          <div className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-slate-100">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{t.currentMission}</p>
            <p className="font-bold text-slate-900 text-sm">{client.serviceType}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Progress Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
             {/* Background decorative gradients */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-50/80 to-slate-100/50 rounded-full blur-3xl -z-10 translate-x-1/3 -translate-y-1/3"></div>
            
            <div className="flex flex-col md:flex-row items-center gap-12">
              
              {/* Creative Circular Progress */}
              <div className="relative flex-shrink-0 group">
                 <div className="w-60 h-60 relative flex items-center justify-center">
                    <div className={`absolute inset-0 rounded-full blur-2xl animate-pulse ${isComplete ? 'bg-green-500/10' : 'bg-blue-500/5'}`}></div>

                    <svg 
                      height="100%" 
                      width="100%" 
                      viewBox="0 0 200 200" 
                      className="transform -rotate-90 drop-shadow-xl"
                    >
                      <circle
                        stroke="#E2E8F0"
                        strokeWidth="1"
                        fill="transparent"
                        r="98"
                        cx="100"
                        cy="100"
                      />

                      <circle
                        stroke="#94A3B8"
                        strokeWidth="1"
                        fill="transparent"
                        strokeDasharray="4 6"
                        r="65"
                        cx="100"
                        cy="100"
                        opacity="0.3"
                      />

                      <circle
                        stroke="#F8FAFC"
                        strokeWidth={strokeWidth}
                        fill="transparent"
                        r={normalizedRadius}
                        cx="100"
                        cy="100"
                        className="stroke-slate-100"
                      />

                      <circle
                        stroke={isComplete ? "#22c55e" : "#2563EB"}
                        strokeWidth={strokeWidth}
                        strokeDasharray={`${circumference} ${circumference}`}
                        style={{ strokeDashoffset }}
                        strokeLinecap="round"
                        fill="transparent"
                        r={normalizedRadius}
                        cx="100"
                        cy="100"
                        className="transition-[stroke-dashoffset] duration-1000 ease-out"
                      />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <div className="flex items-start">
                        <span className={`text-6xl font-bold tracking-tighter leading-none ${isComplete ? 'text-green-700' : 'text-slate-900'}`}>
                          {client.progress}
                        </span>
                        <span className="text-xl font-medium text-slate-400 mt-1">%</span>
                      </div>
                      <div className={`mt-2 px-3 py-1 border shadow-sm rounded-full transition-colors ${
                        isComplete ? 'bg-green-50 border-green-100' : 'bg-white border-slate-100'
                      }`}>
                        <p className={`text-[10px] uppercase tracking-widest font-bold ${
                          isComplete ? 'text-green-600' : 'text-slate-500'
                        }`}>
                          {isComplete ? commonT.completed : commonT.inProgress}
                        </p>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Status Description */}
              <div className="flex-1 w-full text-center md:text-left">
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide mb-4 border ${
                  isComplete 
                    ? 'bg-green-50 text-green-700 border-green-200' 
                    : 'bg-blue-50 text-blue-700 border-blue-200'
                }`}>
                  {isComplete ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  <span>{isComplete ? t.serviceCompleted : t.currentPhase}</span>
                </div>
                
                <h2 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                  {client.statusMessage}
                </h2>
                
                <p className="text-slate-500 leading-relaxed text-sm">
                  {isComplete 
                    ? t.downloadDocs
                    : t.workInProgress
                  }
                </p>

                <div className="flex flex-wrap justify-center md:justify-start gap-x-8 gap-y-4 mt-8 pt-6 border-t border-slate-100">
                   <div>
                     <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">{t.estimatedTime}</p>
                     <p className="text-slate-900 font-bold text-sm">{isComplete ? commonT.completed : `~ 3-5 ${t.businessDays}`}</p>
                   </div>
                   <div>
                     <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold mb-1">{t.priority}</p>
                     <p className={`${isComplete ? 'text-green-600' : 'text-blue-600'} font-bold text-sm flex items-center gap-1.5`}>
                       {!isComplete && <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>}
                       {isComplete ? t.resolved : t.high}
                     </p>
                   </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Notifications Summary Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 text-sm uppercase tracking-widest">
                <Bell className="text-amber-500" size={18} />
                {t.recentUpdates}
              </h3>
              <button className="text-[10px] text-blue-600 font-bold uppercase tracking-widest hover:text-blue-700 transition-colors">{t.viewAll}</button>
            </div>
            
            <div className="space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.map(note => (
                  <div key={note.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 transition-colors hover:bg-slate-100/50">
                    <div className={`mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      note.type === 'alert' ? 'bg-red-500' : 
                      note.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{note.title}</p>
                      <p className="text-xs text-slate-500 mt-1 line-clamp-1">{note.message}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-2 tracking-widest">
                        {new Date(note.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-slate-400 text-sm font-medium">{translations.en.layout.noNotifications}</div>
              )}
              
              <button 
                onClick={onNavigateToDocs}
                className="w-full mt-2 py-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 rounded-xl transition-all border border-dashed border-slate-200 flex items-center justify-center gap-2"
              >
                {t.goToDocs} <ArrowRight size={14} />
              </button>
            </div>
          </div>

        </div>

        {/* --- ORGANIZED PROCESS TIMELINE SIDEBAR REDESIGNED --- */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">
            <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl shadow-sm border border-blue-100">
                   <TrendingUp size={18} />
                </div>
                <h3 className="text-[11px] font-bold text-slate-900 uppercase tracking-widest">{t.timeline}</h3>
              </div>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                 <MoreHorizontal size={18} />
              </button>
            </div>
            
            <div className="flex-1 p-6 relative">
              {/* Path connector line */}
              <div className="absolute left-[39px] top-8 bottom-8 w-0.5 bg-slate-100"></div>

              <div className="space-y-6">
                {(client.timeline || []).map((step, idx) => {
                  const isActive = step.status === 'in-progress';
                  const isDone = step.status === 'completed';

                  return (
                    <div key={step.id} className="relative flex items-start gap-4 group">
                      {/* Step Indicator */}
                      <div className="relative z-10 flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full border-4 border-white shadow-sm flex items-center justify-center transition-all duration-500 ${
                          isDone ? 'bg-green-500 text-white' :
                          isActive ? 'bg-blue-600 text-white scale-110 ring-4 ring-blue-50' :
                          'bg-white text-slate-200 border border-slate-200'
                        }`}>
                           {isDone ? <CheckCircle2 size={18} /> :
                            isActive ? <Clock size={18} className="animate-pulse" /> :
                            <Circle size={14} className="opacity-40" />}
                        </div>
                      </div>

                      {/* Step Content Card */}
                      <div className={`flex-1 p-4 rounded-xl border transition-all duration-300 ${
                        isActive ? 'bg-blue-50 border-blue-200 shadow-md' :
                        isDone ? 'bg-white border-slate-100' :
                        'bg-slate-50/30 border-transparent opacity-60'
                      }`}>
                        <div className="flex justify-between items-start">
                          <p className={`text-sm font-bold leading-tight ${
                            isDone ? 'text-slate-500 line-through' :
                            isActive ? 'text-blue-900' :
                            'text-slate-700'
                          }`}>
                            {step.label}
                          </p>
                        </div>
                        
                        <div className="mt-2.5">
                          <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold border uppercase tracking-wide ${
                            isDone 
                              ? 'bg-green-50 text-green-700 border-green-200' 
                              : isActive 
                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                          }`}>
                            {step.status === 'completed' ? commonT.completed : 
                             step.status === 'in-progress' ? commonT.inProgress : commonT.pending}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Progress Summary Card at bottom of timeline */}
              <div className="mt-10 p-5 bg-slate-900 rounded-2xl text-white shadow-xl shadow-slate-900/20 relative overflow-hidden group">
                 {/* Subtle decorative background */}
                 <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 rounded-full blur-[40px] opacity-10 -translate-y-1/2 translate-x-1/2 group-hover:opacity-20 transition-opacity"></div>
                 
                 <p className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">Status Update</p>
                 <p className="text-xs font-semibold leading-relaxed text-slate-200">
                    {isComplete 
                      ? t.projectCompleted
                      : "Your process is currently being handled with priority by our legal advisors."}
                 </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
