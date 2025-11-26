
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Globe, 
  Save, 
  Building2, 
  Phone, 
  Camera, 
  Upload,
  Shield,
  Smartphone,
  Mail
} from 'lucide-react';
import { ClientData } from '../types';
import { translations, Language } from '../translations';

interface ClientSettingsViewProps {
  client: ClientData;
  onUpdateProfile: (data: Partial<ClientData>) => void;
  lang: Language;
}

export const ClientSettingsView: React.FC<ClientSettingsViewProps> = ({ client, onUpdateProfile, lang }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const t = translations[lang].settings;
  const commonT = translations[lang].common;
  const isRTL = lang === 'ar';
  
  // Form State
  const [formData, setFormData] = useState<Partial<ClientData>>({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    // Initialize form with client data
    const validCategories = ['Services', 'Import/Export', 'IT Services', 'Construction', 'Retail'];
    const currentCategory = client.companyCategory || '';
    const safeCategory = validCategories.includes(currentCategory) ? currentCategory : 'Services';

    setFormData({
      firstName: client.firstName || client.name.split(' ')[0] || '',
      lastName: client.lastName || client.name.split(' ').slice(1).join(' ') || '',
      nationality: client.nationality || '',
      cin: client.cin || '',
      companyName: client.companyName,
      companyCategory: safeCategory,
      phone: client.phone || '',
      whatsapp: client.whatsapp || '',
      avatarUrl: client.avatarUrl || '',
      email: client.email // Read only usually, but good to have in state
    });
    setIsDirty(false);
  }, [client]);

  const handleChange = (field: keyof ClientData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, avatarUrl: reader.result as string }));
        setIsDirty(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    const updatedName = `${formData.firstName} ${formData.lastName}`.trim();
    onUpdateProfile({
      ...formData,
      name: updatedName
    });
    setIsDirty(false);
  };

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
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <User className="text-blue-500" size={20} /> {t.personalInfo}
                </h3>
              </div>
              
              {/* Avatar Section */}
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100">
                <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-white border-4 border-white shadow-md overflow-hidden flex items-center justify-center">
                      {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <User size={32} className="text-slate-300" />
                      )}
                    </div>
                    <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full border-2 border-white shadow-sm cursor-pointer hover:bg-blue-700 transition-colors">
                       <Camera size={14} />
                       <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                      />
                    </label>
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-slate-900">{t.profilePic}</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-3">
                    {t.uploadMsg} 
                    <br/>Supported formats: JPG, PNG. Max size 800K.
                  </p>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
                    <Upload size={14} />
                    {t.uploadNew}
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Personal Info */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <User size={14} /> {t.personalDetails}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.firstName}</label>
                    <input 
                      type="text" 
                      value={formData.firstName || ''}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.lastName}</label>
                    <input 
                      type="text" 
                      value={formData.lastName || ''}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.nationality}</label>
                    <input 
                      type="text" 
                      value={formData.nationality || ''}
                      onChange={(e) => handleChange('nationality', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.cin}</label>
                    <input 
                      type="text" 
                      value={formData.cin || ''}
                      onChange={(e) => handleChange('cin', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Company Info */}
              <div className="mb-8">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Building2 size={14} /> {t.businessDetails}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyName}</label>
                    <input 
                      type="text" 
                      value={formData.companyName || ''}
                      onChange={(e) => handleChange('companyName', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.companyCategory}</label>
                    <select 
                      value={formData.companyCategory}
                      onChange={(e) => handleChange('companyCategory', e.target.value)}
                      className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="Services">Services & Consulting</option>
                      <option value="Import/Export">Import / Export</option>
                      <option value="IT Services">IT & Technology</option>
                      <option value="Construction">Construction & Real Estate</option>
                      <option value="Retail">Retail & E-commerce</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Phone size={14} /> {t.contactInfo}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{commonT.email}</label>
                    <div className="relative">
                      <Mail className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
                      <input 
                        type="email" 
                        value={formData.email}
                        readOnly
                        className={`w-full py-2 bg-slate-100 border border-slate-200 rounded-lg text-sm text-slate-500 cursor-not-allowed ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{commonT.phone}</label>
                    <div className="relative">
                      <Smartphone className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
                      <input 
                        type="tel" 
                        value={formData.phone || ''}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        className={`w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.whatsapp}</label>
                    <div className="relative">
                      <MessageIcon className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
                      <input 
                        type="tel" 
                        value={formData.whatsapp || ''}
                        onChange={(e) => handleChange('whatsapp', e.target.value)}
                        className={`w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'}`}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end">
                <button 
                  onClick={handleSave}
                  disabled={!isDirty}
                  className={`px-6 py-2 text-sm font-medium rounded-lg flex items-center gap-2 transition-all ${
                    isDirty 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20' 
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
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
                  <input type="password" placeholder="••••••••" className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
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
                      <p className="text-xs text-slate-500">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 text-xs font-bold rounded hover:bg-slate-50 transition-colors">
                      {t.enable}
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

           {/* Notifications Settings */}
           {activeTab === 'notifications' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Bell className="text-blue-500" size={20} /> {t.tabs.notifications}
              </h3>
              
              <div className="space-y-6">
                 <div>
                    <h4 className="text-sm font-bold text-slate-900 mb-3">{t.emailNotifs}</h4>
                    <div className="space-y-3">
                       {['Document Updates', 'Milestone Completions', 'Administrative Alerts'].map((item) => (
                        <div key={item} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                          <span className="text-sm font-medium text-slate-700">{item}</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isRTL ? 'peer-checked:after:-translate-x-full after:right-[2px]' : 'peer-checked:after:translate-x-full after:left-[2px]'}`}></div>
                          </label>
                        </div>
                      ))}
                    </div>
                 </div>

                 <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 mb-3">{t.pushNotifs}</h4>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100">
                          <span className="text-sm font-medium text-slate-700">Browser Alerts</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className={`w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all ${isRTL ? 'peer-checked:after:-translate-x-full after:right-[2px]' : 'peer-checked:after:translate-x-full after:left-[2px]'}`}></div>
                          </label>
                        </div>
                    </div>
                 </div>
              </div>
            </div>
           )}

           {/* System Settings */}
           {activeTab === 'system' && (
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 animate-fade-in">
              <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Globe className="text-blue-500" size={20} /> {t.systemPrefs}
              </h3>

              <div className="grid grid-cols-1 gap-6 max-w-lg">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.language}</label>
                   <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>English (US)</option>
                      <option>Français</option>
                      <option>العربية</option>
                   </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.timezone}</label>
                   <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>(GMT+01:00) Casablanca</option>
                      <option>(GMT+00:00) London</option>
                      <option>(GMT+01:00) Paris</option>
                   </select>
                </div>
                 <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.theme}</label>
                   <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                      <option>System Default</option>
                      <option>Light Mode</option>
                      <option>Dark Mode (Beta)</option>
                   </select>
                </div>
              </div>
            </div>
           )}

        </div>
      </div>
    </div>
  );
};

// Helper Icon component for the form
const MessageIcon = ({ size, className }: { size: number, className: string }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
  </svg>
);
