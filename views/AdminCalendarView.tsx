
import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  User, 
  MoreHorizontal,
  X,
  CheckCircle2,
  AlertCircle,
  FileText
} from 'lucide-react';
import { translations } from '../translations';
import { ClientData } from '../types';

interface CalendarEvent {
  id: string;
  title: string;
  type: 'meeting' | 'deadline' | 'followup';
  time: string;
  duration?: string;
  client?: string;
  location?: string;
  date: number; // Day of month
}

interface AdminCalendarViewProps {
  clients: ClientData[];
}

export const AdminCalendarView: React.FC<AdminCalendarViewProps> = ({ clients }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isAddEventOpen, setIsAddEventOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());

  const t = translations.en.calendar;
  const commonT = translations.en.common;

  // Mock Events for the current month
  const events: CalendarEvent[] = [
    { id: 'e1', title: 'Consultation - SARL Setup', type: 'meeting', time: '10:00 AM', duration: '1h', client: 'MPL DIGITAL', date: 15 },
    { id: 'e2', title: 'Tax Filing Deadline', type: 'deadline', time: 'All Day', date: 20 },
    { id: 'e3', title: 'Follow-up Call', type: 'followup', time: '02:30 PM', client: 'The Brain', date: 10 },
    { id: 'e4', title: 'NDA Signing', type: 'meeting', time: '11:00 AM', client: 'New Tech', date: 15 },
    { id: 'e5', title: 'Document Audit', type: 'followup', time: '09:00 AM', date: 5 },
  ];

  // Calendar Math
  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();
  
  const monthName = currentMonth.toLocaleString('default', { month: 'long' });
  const year = currentMonth.getFullYear();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const getDayEvents = (day: number) => events.filter(e => e.date === day);

  const selectedDayEvents = useMemo(() => {
    return selectedDay ? getDayEvents(selectedDay) : [];
  }, [selectedDay]);

  return (
    <div className="animate-fade-in space-y-8 pb-12">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        
        <button 
          onClick={() => setIsAddEventOpen(true)}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-blue-900/20 transition-all hover:-translate-y-0.5 active:scale-95"
        >
          <Plus size={18} />
          {t.addEvent}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* --- MAIN CALENDAR GRID --- */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Calendar Controls */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
               <div className="flex items-center gap-4">
                  <h2 className="text-xl font-bold text-slate-900">{monthName} {year}</h2>
                  <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                     <button onClick={handlePrevMonth} className="p-1.5 hover:bg-slate-50 rounded text-slate-600"><ChevronLeft size={18}/></button>
                     <button onClick={() => setCurrentMonth(new Date())} className="px-3 text-xs font-bold text-slate-500 hover:text-blue-600">{t.today}</button>
                     <button onClick={handleNextMonth} className="p-1.5 hover:bg-slate-50 rounded text-slate-600"><ChevronRight size={18}/></button>
                  </div>
               </div>
               <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                  <button className="px-3 py-1.5 bg-white shadow-sm rounded-md text-xs font-bold text-blue-600">{t.month}</button>
                  <button className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:bg-white/50">{t.week}</button>
                  <button className="px-3 py-1.5 rounded-md text-xs font-bold text-slate-500 hover:bg-white/50">{t.day}</button>
               </div>
            </div>

            {/* Weekday Labels */}
            <div className="grid grid-cols-7 border-b border-slate-100">
               {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                 <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">{day}</div>
               ))}
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-7 h-[600px]">
               {/* Empty cells for leading days */}
               {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                 <div key={`empty-${i}`} className="border-r border-b border-slate-50 bg-slate-50/30"></div>
               ))}

               {/* Month Days */}
               {Array.from({ length: daysInMonth }).map((_, i) => {
                 const day = i + 1;
                 const isToday = new Date().getDate() === day && new Date().getMonth() === currentMonth.getMonth();
                 const isSelected = selectedDay === day;
                 const dayEvents = getDayEvents(day);

                 return (
                   <div 
                     key={day}
                     onClick={() => setSelectedDay(day)}
                     className={`border-r border-b border-slate-100 p-2 transition-all cursor-pointer group relative overflow-hidden ${
                        isSelected ? 'bg-blue-50/30' : 'bg-white hover:bg-slate-50'
                     }`}
                   >
                     <div className="flex justify-between items-start">
                        <span className={`w-7 h-7 flex items-center justify-center text-xs font-bold rounded-lg transition-colors ${
                          isToday ? 'bg-blue-600 text-white shadow-md shadow-blue-200' : 
                          isSelected ? 'bg-blue-100 text-blue-700' :
                          'text-slate-500 group-hover:text-slate-900'
                        }`}>
                          {day}
                        </span>
                        {dayEvents.length > 0 && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse mt-1"></span>}
                     </div>

                     <div className="mt-2 space-y-1 overflow-hidden h-[70px]">
                        {dayEvents.map(event => (
                           <div 
                             key={event.id}
                             className={`text-[9px] font-bold px-1.5 py-1 rounded border leading-tight truncate ${
                               event.type === 'meeting' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                               event.type === 'deadline' ? 'bg-red-50 text-red-700 border-red-100' :
                               'bg-amber-50 text-amber-700 border-amber-100'
                             }`}
                           >
                             {event.time === 'All Day' ? '' : `${event.time} `}{event.title}
                           </div>
                        ))}
                     </div>
                   </div>
                 );
               })}
            </div>
          </div>
        </div>

        {/* --- SIDEBAR: AGENDA --- */}
        <div className="lg:col-span-1 space-y-6">
           <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 transition-transform duration-700 group-hover:scale-125"></div>
              
              <div className="relative z-10 flex items-center justify-between mb-6">
                 <h3 className="font-bold text-lg">{t.upcomingEvents}</h3>
                 <CalendarIcon size={20} className="text-blue-400" />
              </div>

              <div className="relative z-10 space-y-4">
                 {selectedDayEvents.length > 0 ? (
                   selectedDayEvents.map(event => (
                     <div key={event.id} className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/15 transition-all cursor-default">
                        <div className="flex justify-between items-start mb-2">
                           <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${
                              event.type === 'meeting' ? 'bg-blue-500 text-white' :
                              event.type === 'deadline' ? 'bg-red-500 text-white' :
                              'bg-amber-500 text-white'
                           }`}>
                             {event.type}
                           </span>
                           <button className="text-white/40 hover:text-white"><MoreHorizontal size={14} /></button>
                        </div>
                        <h4 className="font-bold text-sm mb-3">{event.title}</h4>
                        <div className="space-y-2">
                           <div className="flex items-center gap-2 text-xs text-slate-300">
                              <Clock size={12} className="text-blue-400" />
                              <span>{event.time} {event.duration && `(${event.duration})`}</span>
                           </div>
                           {event.client && (
                             <div className="flex items-center gap-2 text-xs text-slate-300">
                                <User size={12} className="text-blue-400" />
                                <span>{event.client}</span>
                             </div>
                           )}
                        </div>
                     </div>
                   ))
                 ) : (
                   <div className="text-center py-12 text-slate-400">
                      <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-3">
                         <AlertCircle size={24} className="opacity-20" />
                      </div>
                      <p className="text-sm">{t.noEvents}</p>
                   </div>
                 )}
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 relative z-10">
                 <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Quick Strategy</p>
                 <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    <p className="text-xs text-slate-300">Focus on SARL setups today</p>
                 </div>
              </div>
           </div>

           {/* Fiscal Calendar Summary */}
           <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="text-amber-500" size={18} />
                Monthly Deliverables
              </h3>
              <div className="space-y-4">
                 {[
                   { label: 'Negative Certificates', count: 4, color: 'blue' },
                   { label: 'Fiscal Declarations', count: 12, color: 'amber' },
                   { label: 'Statute Revisions', count: 2, color: 'purple' }
                 ].map((item, idx) => (
                   <div key={idx} className="flex items-center justify-between">
                      <span className="text-xs text-slate-600 font-medium">{item.label}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        item.color === 'blue' ? 'bg-blue-50 text-blue-600' :
                        item.color === 'amber' ? 'bg-amber-50 text-amber-600' :
                        'bg-purple-50 text-purple-600'
                      }`}>{item.count}</span>
                   </div>
                 ))}
              </div>
           </div>
        </div>
      </div>

      {/* --- ADD EVENT MODAL --- */}
      {isAddEventOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-md transition-opacity" onClick={() => setIsAddEventOpen(false)}></div>
           <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
              <div className="p-8">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                       <h3 className="text-2xl font-bold text-slate-900">{t.addEvent}</h3>
                       <p className="text-slate-500 mt-1">Configure your new strategy block.</p>
                    </div>
                    <button onClick={() => setIsAddEventOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-all">
                       <X size={24} />
                    </button>
                 </div>

                 <form className="space-y-6">
                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.eventTitle}</label>
                       <input 
                         type="text" 
                         placeholder="e.g. Audit with OCP" 
                         className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all"
                       />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.eventTime}</label>
                          <div className="relative">
                             <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                             <input type="time" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all" />
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.eventCategory}</label>
                          <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                             <option value="meeting">{t.meeting}</option>
                             <option value="deadline">{t.deadline}</option>
                             <option value="followup">{t.followup}</option>
                          </select>
                       </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{t.selectClient}</label>
                       <select className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer">
                          <option value="">No specific client</option>
                          {clients.map(c => <option key={c.id} value={c.id}>{c.companyName}</option>)}
                       </select>
                    </div>

                    <div className="pt-6 flex gap-4">
                       <button 
                         type="button" 
                         onClick={() => setIsAddEventOpen(false)}
                         className="flex-1 py-4 bg-slate-50 text-slate-600 font-bold rounded-2xl hover:bg-slate-100 transition-all active:scale-95"
                       >
                          {commonT.cancel}
                       </button>
                       <button 
                         type="submit" 
                         className="flex-1 py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 shadow-xl shadow-slate-900/20 transition-all active:scale-95 flex items-center justify-center gap-2"
                       >
                          <CheckCircle2 size={20} />
                          {t.saveEvent}
                       </button>
                    </div>
                 </form>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};
