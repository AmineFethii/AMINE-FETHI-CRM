
import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Save, 
  Shield, 
  Mail, 
  Smartphone,
  Building 
} from 'lucide-react';
import { User as UserType } from '../types';
import { translations } from '../translations';

interface AdminSettingsViewProps {
  user: UserType;
}

export const AdminSettingsView: React.FC<AdminSettingsViewProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const t = translations.en.settings;
  const commonT = translations.en.common;
  
  // Mock form state
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        <p className="text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Settings Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <nav className="flex flex-col p-2 space-y-1">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'profile' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <User size={18} /> {t.tabs.profile}
              </button>
              <button 
                onClick={() => setActiveTab('security')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'security' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Lock size={18} /> {t.tabs.security}
              </button>
              <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'notifications' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Bell size={18} /> {t.tabs.notifications}
              </button>
              <button 
                onClick={() => setActiveTab('system')}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === 'system' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Globe size={18} /> {t.tabs.system}
              </button>
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-3 space-y-6">
          
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <User className="text-blue-500" size={20} /> {t.personalInfo}
              </h3>
              
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-lg flex items-center justify-center text-2xl font-bold text-slate-400">
                  {user.name.charAt(0)}
                </div>
                <div>
                   <button className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors">
                     {t.uploadNew}
                   </button>
                   <p className="text-xs text-slate-400 mt-2">{t.uploadMsg}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.fullName}</label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{commonT.email}</label>
                  <div className="relative">
                    <Mail className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3" size={16} />
                    <input 
                      type="email" 
                      value={email}
                      readOnly
                      className="w-full py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed pl-10 pr-4"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <div className="relative">
                    <Shield className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3" size={16} />
                    <input 
                      type="text" 
                      value="Super Admin"
                      readOnly
                      className="w-full py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed pl-10 pr-4"
                    />
                  </div>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{commonT.phone}</label>
                  <div className="relative">
                    <Smartphone className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3" size={16} />
                    <input 
                      type="tel" 
                      defaultValue="+212 600-000000"
                      className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pl-10 pr-4"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Save size={16} /> {commonT.save}
                </button>
              </div>
            </div>
          )}

           {/* Security Settings */}
           {activeTab === 'security' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in">
               <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Lock className="text-blue-500" size={20} /> {t.securityTitle}
              </h3>

              <div className="space-y-4 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.currentPwd}</label>
                  <input type="password" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.newPwd}</label>
                  <input type="password" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.confirmPwd}</label>
                  <input type="password" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
               
              <div className="mt-8 pt-6 border-t border-slate-100">
                 <h4 className="text-sm font-bold text-slate-900 mb-3">{t.twoFa}</h4>
                 <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-900">Authenticator App</p>
                      <p className="text-xs text-slate-500">Secure your account with TOTP (Google Authenticator, Authy).</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded hover:bg-slate-50">
                      {t.setup}
                    </button>
                 </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                  <Save size={16} /> {t.updateSecurity}
                </button>
              </div>
            </div>
           )}

           {/* System Settings */}
           {activeTab === 'system' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Building className="text-blue-500" size={20} /> {t.systemPrefs}
              </h3>

              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyName}</label>
                   <input 
                    type="text" 
                    defaultValue="Amine El Fethi Business Solutions"
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Support Email</label>
                     <input 
                      type="email" 
                      defaultValue="support@amineelfethi.com"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                   <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Support Phone / WhatsApp</label>
                     <input 
                      type="text" 
                      defaultValue="+212 713-125021"
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>
           )}

           {/* Notifications Settings - Placeholder */}
           {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="text-blue-500" size={20} /> {t.tabs.notifications}
              </h3>
              
              <div className="space-y-4">
                {['New Client Registration', 'Document Uploads', 'Payment Receipts', 'System Updates'].map((item) => (
                  <div key={item} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors">
                    <span className="text-sm font-medium text-slate-700">{item}</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full after:left-[2px]"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
           )}

        </div>
      </div>
    </div>
  );
};
