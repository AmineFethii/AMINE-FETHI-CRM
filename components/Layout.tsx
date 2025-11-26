
import React, { useState } from 'react';
import { LogOut, LayoutDashboard, FileText, Settings, Shield, Bell, Banknote, Check, CheckCheck, Users, Briefcase, Globe, ChevronDown, Receipt, MonitorPlay, MessageSquare, Key } from 'lucide-react';
import { User, Notification } from '../types';
import { translations, Language } from '../translations';

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
  currentLanguage?: Language;
  onLanguageChange?: (lang: Language) => void;
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
  currentLanguage = 'en',
  onLanguageChange
}) => {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const t = translations[currentLanguage].layout;
  const isRTL = currentLanguage === 'ar';

  if (!user) return <>{children}</>;

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    if (onMarkAsRead) {
      onMarkAsRead(id);
    }
  };

  const NavItem = ({ id, icon: Icon, label }: { id: string, icon: any, label: string }) => (
    <div 
      onClick={() => onNavigate && onNavigate(id)}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-200 ${
        activeView === id 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
      }`}
    >
      <Icon size={20} className={isRTL ? "flip-if-needed" : ""} />
      <span className="font-medium">{label}</span>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar - Dynamically positioned based on RTL */}
      <aside 
        className={`hidden md:flex flex-col w-64 bg-slate-900 text-slate-300 fixed h-full transition-all z-20 
        ${isRTL ? 'right-0 border-l border-slate-800' : 'left-0 border-r border-slate-800'}`}
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

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <NavItem id="dashboard" icon={LayoutDashboard} label={t.dashboard} />
          
          {user.role === 'admin' && (
            <>
              <NavItem id="clients" icon={Briefcase} label={t.clients} />
              <NavItem id="client-access" icon={Key} label={t.clientAccess} />
              <NavItem id="team" icon={Users} label={t.team} />
              <NavItem id="finance" icon={Banknote} label={t.finance} />
              <NavItem id="invoicing" icon={Receipt} label={t.invoicing} />
              <NavItem id="tutorials" icon={MonitorPlay} label={t.tutorials} />
            </>
          )}

          {user.role === 'client' && (
             <NavItem id="chat" icon={MessageSquare} label={t.chat} />
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

        <div className="p-4 border-t border-slate-800">
          {/* User Profile Section in Sidebar Footer */}
          <div className="flex items-center justify-between gap-2 mb-4 px-2 group">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0 border border-slate-700 overflow-hidden">
                {user.avatarUrl ? (
                  <img src={user.avatarUrl} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user.name.charAt(0)
                )}
              </div>
              <div className="overflow-hidden text-start">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
            </div>
            
            {/* Settings Trigger in Footer */}
            {user.role === 'client' && (
              <button 
                onClick={onOpenProfile}
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-md transition-colors"
                title={t.editProfile}
              >
                <Settings size={16} />
              </button>
            )}
          </div>

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
          >
            <LogOut size={16} className={isRTL ? "rotate-180" : ""} />
            <span>{t.signout}</span>
          </button>
        </div>
      </aside>

      {/* Main Content - Margin flipped based on RTL */}
      <main className={`flex-1 relative transition-all duration-300 ${isRTL ? 'md:mr-64' : 'md:ml-64'}`}>
        {/* Top Header Bar */}
        <header className="h-16 bg-white border-b border-slate-200 sticky top-0 z-10 px-4 md:px-8 flex items-center justify-end gap-4">
           
           {/* Language Selector */}
           <div className="relative">
             <button 
               onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
               className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-slate-600"
             >
               <Globe size={18} className="text-slate-400" />
               <span className="text-sm font-medium uppercase">{currentLanguage}</span>
               <ChevronDown size={14} className="text-slate-400" />
             </button>

             {isLangMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsLangMenuOpen(false)}></div>
                  <div className={`absolute top-full mt-2 w-40 bg-white rounded-lg shadow-xl border border-slate-100 z-20 py-1 overflow-hidden animate-fade-in-down ${isRTL ? 'left-0' : 'right-0'}`}>
                     <button onClick={() => { onLanguageChange?.('en'); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-3 ${currentLanguage === 'en' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}>
                        <span className="text-lg">🇺🇸</span> English
                     </button>
                     <button onClick={() => { onLanguageChange?.('fr'); setIsLangMenuOpen(false); }} className={`w-full text-left px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-3 ${currentLanguage === 'fr' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}>
                        <span className="text-lg">🇫🇷</span> Français
                     </button>
                     <button onClick={() => { onLanguageChange?.('ar'); setIsLangMenuOpen(false); }} className={`w-full text-right px-4 py-2 text-sm hover:bg-slate-50 flex items-center gap-3 justify-end ${currentLanguage === 'ar' ? 'text-blue-600 bg-blue-50' : 'text-slate-700'}`}>
                        Arabic <span className="text-lg">🇲🇦</span>
                     </button>
                  </div>
                </>
             )}
           </div>

           {/* Notifications */}
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

             {/* Notifications Dropdown */}
             {isNotificationsOpen && (
               <>
                 <div 
                   className="fixed inset-0 z-0" 
                   onClick={() => setIsNotificationsOpen(false)}
                 ></div>
                 <div className={`absolute mt-3 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-slate-100 z-20 overflow-hidden animate-fade-in-down ${isRTL ? 'left-0' : 'right-0'}`}>
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
                             {/* Status Indicator Dot */}
                             <div className={`mt-1.5 flex-shrink-0 w-2 h-2 rounded-full transition-colors ${
                               !notification.read ? 'bg-blue-500' : 'bg-slate-200'
                             }`}></div>
                             
                             <div className={`flex-1 ${isRTL ? 'pl-6' : 'pr-6'}`}>
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

                             {/* Individual Mark as Read Action */}
                             {!notification.read && (
                               <button
                                 onClick={(e) => {
                                   e.stopPropagation();
                                   handleNotificationClick(notification.id);
                                 }}
                                 className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-md border border-slate-100 text-blue-600 p-1.5 rounded-full hover:bg-blue-50 transform hover:scale-110 ${isRTL ? 'left-3' : 'right-3'}`}
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
