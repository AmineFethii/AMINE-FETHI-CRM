
import React, { useState, useEffect } from 'react';
import { 
  User, 
  Lock, 
  Bell, 
  Save, 
  Building2, 
  Phone, 
  Briefcase, 
  Mail, 
  MapPin, 
  Calendar, 
  Wallet, 
  AlertCircle, 
  Settings,
  CreditCard,
  ShieldCheck,
  Users,
  UserPlus
} from 'lucide-react';
import { ClientData } from '../types';
import { translations } from '../translations';

interface ClientSettingsViewProps {
  client: ClientData;
  onUpdateProfile: (data: Partial<ClientData>) => void;
}

export const ClientSettingsView: React.FC<ClientSettingsViewProps> = ({ client, onUpdateProfile }) => {
  const t = translations.en.settings;
  
  const [formData, setFormData] = useState<Partial<ClientData>>({
    firstName: '',
    lastName: '',
    nationality: '',
    cin: '',
    email: '',
    phone: '',
    birthDate: '',
    fullAddress: '',
    province: '',
    companyName: '',
    companyNameProposals: ['', '', ''],
    businessActivity: '',
    annualTurnover: '',
    desiredMonthlySalary: '5000',
    moneyTransferMethod: '',
    monthlyTransfer: 'Non',
    paymentPlatforms: '',
    existingEntityLLCLTD: 'Non',
    hasEmployees: 'Non',
    employeeCount: '',
    ownerCount: '',
    plannedStartDate: '',
    monthlyBusinessExpenses: '',
    avatarUrl: '',
    whatsapp: '',
    hasSecondOwner: 'Non',
    secondOwnerFirstName: '',
    secondOwnerLastName: '',
    secondOwnerNationality: '',
    secondOwnerCin: ''
  });
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    setFormData({
      firstName: client.firstName || '',
      lastName: client.lastName || '',
      nationality: client.nationality || '',
      cin: client.cin || '',
      email: client.email || '',
      phone: client.phone || '',
      birthDate: client.birthDate || '',
      fullAddress: client.fullAddress || '',
      province: client.province || '',
      companyName: client.companyName || '',
      companyNameProposals: client.companyNameProposals || ['', '', ''],
      businessActivity: client.businessActivity || '',
      annualTurnover: client.annualTurnover || '',
      desiredMonthlySalary: client.desiredMonthlySalary || '5000',
      moneyTransferMethod: client.moneyTransferMethod || '',
      monthlyTransfer: client.monthlyTransfer || 'Non',
      paymentPlatforms: client.paymentPlatforms || '',
      existingEntityLLCLTD: client.existingEntityLLCLTD || 'Non',
      hasEmployees: client.hasEmployees || 'Non',
      employeeCount: client.employeeCount || '',
      ownerCount: client.ownerCount || '',
      plannedStartDate: client.plannedStartDate || '',
      monthlyBusinessExpenses: client.monthlyBusinessExpenses || '',
      avatarUrl: client.avatarUrl || '',
      whatsapp: client.whatsapp || '',
      hasSecondOwner: client.hasSecondOwner || 'Non',
      secondOwnerFirstName: client.secondOwnerFirstName || '',
      secondOwnerLastName: client.secondOwnerLastName || '',
      secondOwnerNationality: client.secondOwnerNationality || '',
      secondOwnerCin: client.secondOwnerCin || ''
    });
    setIsDirty(false);
  }, [client]);

  const handleChange = (field: keyof ClientData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setIsDirty(true);
  };

  const handleProposalChange = (index: number, value: string) => {
    const proposals = [...(formData.companyNameProposals || ['', '', ''])];
    proposals[index] = value;
    handleChange('companyNameProposals', proposals);
  };

  const handleSave = () => {
    onUpdateProfile({
      ...formData,
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      hasFilledProfile: true // Mark as filled when saving
    });
    setIsDirty(false);
  };

  const SectionTitle = ({ icon: Icon, title }: { icon: any, title: string }) => (
    <div className="flex items-center gap-2 mb-6 mt-10 first:mt-0 opacity-80 border-b border-slate-100 pb-2">
      <Icon size={16} className="text-blue-500" />
      <h4 className="text-xs font-bold text-slate-900 uppercase tracking-widest">
        {title}
      </h4>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      <div className="mb-2">
        <h1 className="text-2xl font-bold text-slate-900">{t.title}</h1>
        <p className="text-slate-500 text-sm">{t.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation - Simplified to only Profile & Business */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden sticky top-24">
            <nav className="flex flex-col p-2 space-y-1">
              <div 
                className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-semibold transition-all bg-blue-50 text-blue-600 shadow-sm"
              >
                <User size={18} className="text-blue-600" />
                <span>Profile & Business</span>
              </div>
            </nav>
            <div className="p-4 bg-slate-50 border-t border-slate-100 mt-4">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Privacy Control</p>
              <p className="text-[11px] text-slate-500 leading-relaxed">Technical settings are restricted for security reasons. Contact Amine directly for credentials resets.</p>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[600px]">
            
            <div className="p-6 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
              <div className="p-2 bg-white rounded-lg border border-slate-200 text-blue-600 shadow-sm">
                 <User size={20} />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Personal & Business Info</h3>
                <p className="text-xs text-slate-500">Update your company details and contact information.</p>
              </div>
            </div>

            <div className="p-8 flex-1">
              <div className="animate-fade-in space-y-8">
                
                {/* 1. PERSONAL DETAILS */}
                <SectionTitle icon={User} title="Primary Owner Details" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">First Name</label>
                    <input type="text" value={formData.firstName || ''} onChange={e => handleChange('firstName', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Last Name</label>
                    <input type="text" value={formData.lastName || ''} onChange={e => handleChange('lastName', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Nationality</label>
                    <input type="text" value={formData.nationality || ''} onChange={e => handleChange('nationality', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">CIN / Passport ID</label>
                    <input type="text" value={formData.cin || ''} onChange={e => handleChange('cin', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium" />
                  </div>
                </div>

                {/* 1.1 MULTI-OWNER OPTION */}
                <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-white rounded-xl text-blue-600 shadow-sm border border-blue-100"><UserPlus size={24} /></div>
                      <div>
                         <h4 className="font-bold text-slate-900">Multiple Owners?</h4>
                         <p className="text-xs text-slate-500">Toggle this if the company has more than one shareholder.</p>
                      </div>
                   </div>
                   <div className="flex gap-2">
                     {['Oui', 'Non'].map(val => (
                       <button 
                        key={val} 
                        onClick={() => handleChange('hasSecondOwner', val)} 
                        className={`px-8 py-2 text-sm font-bold rounded-xl border transition-all ${formData.hasSecondOwner === val ? 'bg-blue-600 text-white border-blue-600 shadow-lg shadow-blue-600/20' : 'bg-white text-slate-500 border-slate-200'}`}
                       >
                         {val}
                       </button>
                     ))}
                   </div>
                </div>

                {/* 1.2 SECOND OWNER DETAILS (CONDITIONAL) */}
                {formData.hasSecondOwner === 'Oui' && (
                  <div className="animate-slide-in-down border-l-4 border-blue-500 pl-6 space-y-6">
                    <SectionTitle icon={Users} title="Second Owner Details" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">First Name (Partner)</label>
                        <input type="text" value={formData.secondOwnerFirstName || ''} onChange={e => handleChange('secondOwnerFirstName', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Last Name (Partner)</label>
                        <input type="text" value={formData.secondOwnerLastName || ''} onChange={e => handleChange('secondOwnerLastName', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">Nationality (Partner)</label>
                        <input type="text" value={formData.secondOwnerNationality || ''} onChange={e => handleChange('secondOwnerNationality', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm font-medium" />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2">CIN / Passport ID (Partner)</label>
                        <input type="text" value={formData.secondOwnerCin || ''} onChange={e => handleChange('secondOwnerCin', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium" />
                      </div>
                    </div>
                  </div>
                )}

                <SectionTitle icon={Calendar} title="General Info" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Date of Birth</label>
                    <input type="date" value={formData.birthDate || ''} onChange={e => handleChange('birthDate', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium" />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Province</label>
                    <input type="text" value={formData.province || ''} onChange={e => handleChange('province', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Address</label>
                    <textarea rows={2} value={formData.fullAddress || ''} onChange={e => handleChange('fullAddress', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium resize-none" />
                  </div>
                </div>

                {/* 2. BUSINESS DETAILS */}
                <SectionTitle icon={Building2} title="Business Details" />
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Company Name Proposals (Top 3)</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {[0, 1, 2].map(idx => (
                        <input 
                          key={idx}
                          type="text" 
                          placeholder={`Proposal #${idx + 1}`}
                          value={formData.companyNameProposals?.[idx] || ''} 
                          onChange={e => handleProposalChange(idx, e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm font-bold"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Business Activity</label>
                      <input type="text" placeholder="Précisez l’activité que vous exercez" value={formData.businessActivity || ''} onChange={e => handleChange('businessActivity', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white outline-none text-sm font-medium" />
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Owners count</label>
                      <div className="relative">
                        <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="text" value={formData.ownerCount || ''} onChange={e => handleChange('ownerCount', e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm font-bold" placeholder="Number of owners" />
                      </div>
                    </div>
                    <div className="md:col-span-1">
                      <label className="block text-sm font-bold text-slate-700 mb-2">Target Launch Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input type="date" value={formData.plannedStartDate || ''} onChange={e => handleChange('plannedStartDate', e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm font-bold" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Annual Turnover</label>
                      <input type="text" value={formData.annualTurnover || ''} onChange={e => handleChange('annualTurnover', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm font-bold" placeholder="MAD" />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-slate-700 mb-2">Desired Salary</label>
                      <div className="flex gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                        {['5000', '7000', '8500'].map(val => (
                          <button key={val} onClick={() => handleChange('desiredMonthlySalary', val)} className={`flex-1 py-1.5 text-[10px] font-black rounded-md transition-all ${formData.desiredMonthlySalary === val ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}>
                            {val} MAD
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. CONTACT INFORMATION */}
                <SectionTitle icon={Phone} title="Contact Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="email" value={formData.email} readOnly className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed text-sm font-medium" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                      <input type="tel" value={formData.phone || ''} onChange={e => handleChange('phone', e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm font-medium" placeholder="+212 ..." />
                    </div>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-bold text-slate-700 mb-2">WhatsApp</label>
                     <div className="relative">
                       <MessageCircleIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                       <input type="text" value={formData.whatsapp || ''} onChange={e => handleChange('whatsapp', e.target.value)} className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 text-sm font-medium" />
                     </div>
                  </div>
                </div>

                {/* 4. COMPLEMENTARY INFO */}
                <SectionTitle icon={AlertCircle} title="Complementary Information" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-10">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-3">Monthly Transfer?</label>
                     <div className="flex gap-2">
                       {['Oui', 'Non'].map(val => (
                         <button key={val} onClick={() => handleChange('monthlyTransfer', val)} className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${formData.monthlyTransfer === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}>
                           {val}
                         </button>
                       ))}
                     </div>
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-3">Existing LLC/LTD?</label>
                     <div className="flex gap-2">
                       {['Oui', 'Non'].map(val => (
                         <button key={val} onClick={() => handleChange('existingEntityLLCLTD', val)} className={`flex-1 py-2 text-sm font-bold rounded-lg border transition-all ${formData.existingEntityLLCLTD === val ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-500 border-slate-200'}`}>
                           {val}
                         </button>
                       ))}
                     </div>
                  </div>
                  <div className="md:col-span-2">
                     <label className="block text-sm font-bold text-slate-700 mb-2">Payment Platforms</label>
                     <input type="text" placeholder="PayPal, Payoneer, etc..." value={formData.paymentPlatforms || ''} onChange={e => handleChange('paymentPlatforms', e.target.value)} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium focus:ring-1 focus:ring-blue-500" />
                  </div>
                </div>
              </div>
            </div>

            {/* Compact Form Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-4">
               {/* SHORTENED TRUST MESSAGE */}
               <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-lg border border-green-100 flex-1 whitespace-nowrap overflow-hidden">
                  <ShieldCheck size={14} className="flex-shrink-0" />
                  <p className="text-[9px] font-black uppercase tracking-wider">YOUR DATA IS PROTECTED</p>
               </div>

               <button 
                onClick={handleSave}
                disabled={!isDirty}
                className={`w-full md:w-auto px-8 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                  isDirty 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-700 active:scale-95' 
                    : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                }`}
               >
                <Save size={14} /> Save Changes
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper components
const MessageCircleIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/></svg>
);
