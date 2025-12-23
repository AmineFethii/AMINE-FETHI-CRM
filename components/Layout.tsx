
import React, { useState, useMemo } from 'react';
import { LogOut, LayoutDashboard, FileText, Settings, Shield, Bell, Banknote, Check, CheckCheck, Users, Briefcase, ChevronDown, Receipt, MonitorPlay, MessageSquare, Key, Activity, BookOpen, Calendar, Clock } from 'lucide-react';
import { User, Notification, ClientData } from '../types';
import { translations } from '../translations';

interface LayoutProps {
  children: React.ReactNode;
  user: User | null;
  notifications?: Notification[];
  activeView?: string;
  onNavigate?: (view: string) => void;
  onLogout: () => void;
  onMarkAsRead?: (id: string) => void;
  onMarkAllAsRead?: () => void;
  onOpenProfile?: () => void;
  clients?: ClientData[];
}

export const Layout: React.FC<LayoutProps> = ({ 
  children, 
  user, 
  onLogout,
  notifications = [],
  activeView = 'dashboard',
  onNavigate,
  onMarkAsRead,
  onMarkAllAsRead,
  onOpenProfile,
  clients = []
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const t = translations.en.layout;

  if (!user) return <>{children}</>;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  // Calculate Yearly Cycle Stats for Clients
  const cycleData = useMemo(() => {
    if (user.role !== 'client' || !clients.length) return null;
    const client = clients.find(c => c.id === user.id);
    if (!client || !client.missionStartDate) return null;

    const startDate = new Date(client.missionStartDate);
    const today = new Date();
    const renewalDate = new Date(startDate);
    renewalDate.setFullYear(startDate.getFullYear() + 1);

    const totalDays = 365;
    const diffTime = renewalDate.getTime() - today.getTime();
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const elapsedDays = totalDays - daysLeft;
    const percentage = Math.min(100, Math.max(0, (elapsedDays / totalDays) * 100));

    return {
      daysLeft,
      percentage,
      renewalDate: renewalDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    };
  }, [user, clients]);

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <div 
      onClick={() => onNavigate && onNavigate(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
        activeView === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside 
        className="hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 fixed h-full transition-all z-20 left-0 border-r border-slate-800"
      >
        <div className="p-6 border-b border-slate-800 flex flex-col gap-2 relative">
          <div className="flex items-center gap-2 justify-center py-2 bg-white rounded-lg shadow-sm">
             <svg viewBox="0 0 300 100" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M40 20 L40 80 M20 30 L60 30" stroke="#B48E43" strokeWidth="4"/>
                <text x="70" y="50" fill="#0F172A" fontFamily="sans-serif" fontWeight="bold" fontSize="24">AMINE EL FETHI</text>
                <text x="70" y="75" fill="#B48E43" fontFamily="sans-serif" fontSize="12" letterSpacing="2">LEGAL ADVISOR</text>
             </svg>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto font-sans">
          <NavItem id="dashboard" icon={LayoutDashboard} label={t.dashboard} />
          
          {user.role === 'admin' && (
            <>
              <NavItem id="follow-up" icon={Activity} label={t.followUp} />
              <NavItem id="clients" icon={Briefcase} label={t.clients} />
              <NavItem id="client-access" icon={Key} label={t.clientAccess} />
              <NavItem id="team" icon={Users} label={t.team} />
              <NavItem id="finance" icon={Banknote} label={t.finance} />
              <NavItem id="invoicing" icon={Receipt} label={t.invoicing} />
              <NavItem id="chat" icon={MessageSquare} label={t.chat} />
              <NavItem id="tutorials" icon={MonitorPlay} label={t.tutorials} />
            </>
          )}

          {user.role === 'client' && (
             <>
               <NavItem id="chat" icon={MessageSquare} label={t.chat} />
               <NavItem id="tutorials" icon={MonitorPlay} label={t.tutorials} />
               <NavItem id="guide" icon={BookOpen} label={t.guide} />
             </>
          )}

          <NavItem id="documents" icon={FileText} label={t.documents} />
          
          <div 
            onClick={onOpenProfile}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
              activeView === 'settings' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            <Settings size={20} />
            <span className="font-medium">{t.settings}</span>
          </div>
        </nav>

        {/* --- NEW CREATIVE Sidebar Footer --- */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 space-y-4">
          
          {/* Yearly Mission Cycle Tracking (Client Only) */}
          {user.role === 'client' && cycleData && (
            <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50 group hover:border-blue-500/30 transition-all duration-300">
               <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="p-1 bg-blue-500/10 rounded text-blue-400">
                      <Calendar size={12} />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Annual Mission</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400">{cycleData.daysLeft}d left</span>
               </div>
               
               {/* Animated Progress Bar */}
               <div className="h-1.5 w-full bg-slate-700 rounded-full overflow-hidden mb-2 relative">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-600 to-blue-400 rounded-full transition-all duration-1000 ease-out"
                    style={{ width: `${cycleData.percentage}%` }}
                  ></div>
                  {/* Subtle pulsing glow at the end of the bar */}
                  <div 
                    className="absolute top-0 w-4 h-full bg-blue-400/50 blur-sm animate-pulse"
                    style={{ left: `${cycleData.percentage - 5}%` }}
                  ></div>
               </div>

               <div className="flex justify-between items-center text-[9px] text-slate-500 font-medium">
                  <span className="flex items-center gap-1"><Clock size={10} /> Active Cycle</span>
                  <span>Ends {cycleData.renewalDate}</span>
               </div>
            </div>
          )}

          {/* User Profile Section */}
          <div className="flex items-center justify-between gap-2 px-2">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border border-slate-700 overflow-hidden shadow-lg shadow-blue-900/20">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className="overflow-hidden text-start">
                <p className="text-sm font-bold text-white truncate leading-tight">{user.name}</p>
                <p className="text-[10px] text-slate-500 capitalize tracking-wider font-semibold">{user.role}</p>
              </div>
            </div>
            
            <button 
              onClick={onLogout}
              className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-all active:scale-95"
              title={t.signout}
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 relative transition-all duration-300 md:ml-64">
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-end gap-4">
           
           <div className="relative">
             <button 
               onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
               className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
             >
               <Bell size={20} />
               {unreadCount > 0 && (
                 <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
               )}
             </button>

             {isNotificationsOpen && (
               <>
                 <div 
                   className="fixed inset-0 z-0" 
                   onClick={() => setIsNotificationsOpen(false)}
                 ></div>
                 <div className="absolute mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-20 overflow-hidden animate-fade-in-down right-0">
                   <div className="p-4 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                     <div className="flex items-center gap-2">
                       <h3 className="font-semibold text-slate-900">{t.notifications}</h3>
                       {unreadCount > 0 && (
                         <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                           {unreadCount} {t.new}
                         </span>
                       )}
                     </div>
                     {unreadCount > 0 && onMarkAllAsRead && (
                       <button 
                         onClick={onMarkAllAsRead}
                         className="text-[10px] font-bold text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded transition-colors uppercase tracking-wider flex items-center gap-1"
                       >
                         <CheckCheck size={12} /> {t.markRead}
                       </button>
                     )}
                   </div>
                   <div className="max-h-[400px] overflow-y-auto">
                     {notifications.length > 0 ? (
                       <div className="divide-y divide-slate-50">
                         {notifications.map((notification) => (
                           <div 
                             key={notification.id}
                             onClick={() => handleNotificationClick(notification.id)}
                             className={`relative p-4 transition-all cursor-pointer flex gap-3 group ${
                               !notification.read 
                                 ? 'bg-blue-50/40 hover:bg-blue-50' 
                                 : 'hover:bg-slate-50'
                             }`}
                           >
                             <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full transition-colors ${
                               !notification.read ? 'bg-blue-500' : 'bg-slate-200'
                             }`}></div>
                             
                             <div className="flex-1 pr-6">
                               <div className="flex justify-between items-start mb-1">
                                 <p className={`text-sm ${!notification.read ? 'font-bold text-slate-900' : 'font-medium text-slate-600'}`}>
                                   {notification.title}
                                 </p>
                                 <span className="text-[10px] text-slate-400 whitespace-nowrap mx-2">
                                   {new Date(notification.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                 </span>
                               </div>
                               <p className={`text-xs leading-relaxed line-clamp-2 ${!notification.read ? 'text-slate-600' : 'text-slate-400'}`}>
                                 {notification.message}
                               </p>
                             </div>

                             {!notification.read && (
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleNotificationClick(notification.id);
                                 }}
                                 className="absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md border border-slate-100 text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transform hover:scale-110 right-3"
                                 title="Mark as read"
                               >
                                 <Check size={14} />
                               </button>
                             )}
                           </div>
                         ))}
                       </div>
                     ) : (
                       <div className="p-8 text-center text-slate-400">
                         <Bell size={24} className="mx-auto mb-2 opacity-20" />
                         <p className="text-sm">{t.noNotifications}</p>
                       </div>
                     )}
                   </div>
                 </div>
               </>
             )}
           </div>
        </header>

        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};
