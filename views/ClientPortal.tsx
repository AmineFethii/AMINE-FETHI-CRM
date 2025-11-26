
import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  Building2,
  TrendingUp,
  Bell,
  ArrowRight
} from 'lucide-react';
import { ClientData } from '../types';
import { translations, Language } from '../translations';

interface ClientPortalProps {
  client: ClientData;
  onNavigateToDocs: () => void;
  lang: Language;
}

export const ClientPortal: React.FC<ClientPortalProps> = ({ client, onNavigateToDocs, lang }) => {
  const t = translations[lang].clientPortal;
  const isRTL = lang === 'ar';

  // Progress Circle Math
  const radius = 80;
  const strokeWidth = 16;
  const normalizedRadius = radius - strokeWidth / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference - (client.progress / 100) * circumference;

  const isComplete = client.progress === 100;

  // Get recent notifications for the summary card
  const recentNotifications = client.notifications.slice(0, 3);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-5 w-full md:w-auto">
          <div className="w-16 h-16 rounded-full bg-slate-100 p-1 border border-slate-200 shadow-sm flex-shrink-0">
            <div className="w-full h-full rounded-full overflow-hidden bg-slate-200 relative">
              {client.avatarUrl ? (
                <img src={client.avatarUrl} alt={client.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 text-white text-xl font-bold">
                  {client.name.charAt(0)}
                </div>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
              {t.greeting}, {client.firstName || client.name.split(' ')[0]}
              <span className="inline-block origin-[70%_70%] hover:animate-pulse cursor-default">👋</span>
            </h1>
            <p className="text-slate-500 text-sm mt-1">{t.overview}</p>
          </div>
        </div>
        
        <div className="w-full md:w-auto flex items-center gap-3 bg-slate-50 px-5 py-3 rounded-xl border border-slate-100">
          <div className="p-2 bg-white text-blue-600 rounded-lg shadow-sm border border-slate-100">
            <Building2 size={20} />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{t.currentMission}</p>
            <p className="font-semibold text-slate-800 text-sm">{client.serviceType}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Progress Card */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 relative overflow-hidden min-h-[400px] flex flex-col justify-center">
             {/* Background decorative gradients */}
            <div className={`absolute top-0 w-96 h-96 bg-gradient-to-br from-blue-50/80 to-slate-100/50 rounded-full blur-3xl -z-10 -translate-y-1/3 ${isRTL ? 'left-0 -translate-x-1/3' : 'right-0 translate-x-1/3'}`}></div>
            
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
                      <defs>
                        <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563EB" /> {/* blue-600 */}
                          <stop offset="100%" stopColor="#0F172A" /> {/* slate-900 */}
                        </linearGradient>
                        <linearGradient id="completeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#22c55e" /> {/* green-500 */}
                          <stop offset="100%" stopColor="#15803d" /> {/* green-700 */}
                        </linearGradient>
                      </defs>

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
                        stroke={isComplete ? "url(#completeGradient)" : "url(#progressGradient)"}
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
                          {isComplete ? translations[lang].common.completed : translations[lang].common.inProgress}
                        </p>
                      </div>
                    </div>
                 </div>
              </div>

              {/* Status Description */}
              <div className={`flex-1 w-full text-center ${isRTL ? 'md:text-right' : 'md:text-left'}`}>
                <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-4 border ${
                  isComplete 
                    ? 'bg-green-50 text-green-700 border-green-100' 
                    : 'bg-blue-50 text-blue-700 border-blue-100'
                }`}>
                  {isComplete ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                  <span>{isComplete ? t.serviceCompleted : t.currentPhase}</span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-3">
                  {client.statusMessage}
                </h2>
                
                <p className="text-slate-500 leading-relaxed text-sm">
                  {isComplete 
                    ? t.downloadDocs
                    : t.workInProgress
                  }
                </p>

                <div className={`flex flex-wrap justify-center gap-x-8 gap-y-4 mt-8 pt-6 border-t border-slate-100 ${isRTL ? 'md:justify-end' : 'md:justify-start'}`}>
                   <div>
                     <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">{t.estimatedTime}</p>
                     <p className="text-slate-900 font-semibold text-sm">{isComplete ? translations[lang].common.completed : `~ 3-5 ${t.businessDays}`}</p>
                   </div>
                   <div>
                     <p className="text-slate-400 text-[10px] uppercase tracking-wider font-bold mb-1">{t.priority}</p>
                     <p className={`${isComplete ? 'text-green-600' : 'text-blue-600'} font-semibold text-sm flex items-center gap-1`}>
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
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Bell className="text-amber-500" size={20} />
                {t.recentUpdates}
              </h3>
              <button className="text-xs text-blue-600 font-medium hover:underline">{t.viewAll}</button>
            </div>
            
            <div className="space-y-4">
              {recentNotifications.length > 0 ? (
                recentNotifications.map(note => (
                  <div key={note.id} className="flex gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
                    <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                      note.type === 'alert' ? 'bg-red-500' : 
                      note.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
                    }`} />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{note.title}</p>
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">{note.message}</p>
                      <p className="text-[10px] text-slate-400 mt-1">
                        {new Date(note.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-slate-400 text-sm">{translations[lang].layout.noNotifications}</div>
              )}
              
              <button 
                onClick={onNavigateToDocs}
                className="w-full mt-2 py-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-dashed border-slate-300 flex items-center justify-center gap-2"
              >
                {t.goToDocs} <ArrowRight size={14} className={isRTL ? "rotate-180" : ""} />
              </button>
            </div>
          </div>

        </div>

        {/* Timeline Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 h-full">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="text-blue-500" size={20} />
              {t.timeline}
            </h3>
            
            <div className={`relative space-y-8 ${isRTL ? 'pr-4 border-r-2 border-slate-100' : 'pl-4 border-l-2 border-slate-100'}`}>
              {client.timeline.map((step) => (
                <div key={step.id} className="relative group">
                  <div className={`absolute top-1 w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                    isRTL ? '-right-[21px]' : '-left-[21px]'
                  } ${
                    step.status === 'completed' ? 'bg-green-500 border-green-500' :
                    step.status === 'in-progress' ? 'bg-white border-blue-500 ring-4 ring-blue-50 scale-110' :
                    'bg-slate-100 border-slate-300'
                  }`}>
                    {step.status === 'completed' && <CheckCircle2 size={12} className="text-white absolute top-0 left-0" />}
                    {step.status === 'in-progress' && <div className="absolute inset-0 m-auto w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping" />}
                  </div>
                  
                  <div className={`transition-all duration-300 ${
                    step.status === 'pending' ? 'opacity-50 group-hover:opacity-80' : 'opacity-100'
                  }`}>
                    <p className={`text-sm font-bold ${
                      step.status === 'completed' ? 'text-green-700' : 
                      step.status === 'in-progress' ? 'text-blue-700' : 'text-slate-700'
                    }`}>
                      {step.label}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {step.status === 'completed' ? translations[lang].common.completed : 
                       step.status === 'in-progress' ? translations[lang].common.inProgress : translations[lang].common.pending}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
               <p className="text-xs text-blue-700 font-medium leading-relaxed">
                  {isComplete 
                    ? t.projectCompleted
                    : t.projectMoving}
               </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
