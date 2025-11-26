
import React, { useState } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  MoreHorizontal, 
  Mail, 
  Phone, 
  Briefcase, 
  Building,
  X,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { Employee } from '../types';
import { translations, Language } from '../translations';

interface AdminEmployeesViewProps {
  employees: Employee[];
  onAddEmployee: (employee: Employee) => void;
  lang: Language;
}

export const AdminEmployeesView: React.FC<AdminEmployeesViewProps> = ({ employees, onAddEmployee, lang }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations[lang].employees;
  const commonT = translations[lang].common;
  const isRTL = lang === 'ar';
  
  // New Employee Form State
  const [newEmp, setNewEmp] = useState<Partial<Employee>>({
    name: '',
    role: '',
    department: '',
    email: '',
    phone: '',
    status: 'active'
  });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newEmp.name && newEmp.role && newEmp.email) {
      onAddEmployee({
        id: `emp-${Date.now()}`,
        name: newEmp.name,
        role: newEmp.role,
        department: newEmp.department || 'General',
        email: newEmp.email,
        phone: newEmp.phone || '',
        status: 'active',
        joinDate: new Date().toISOString(),
        avatarUrl: undefined
      } as Employee);
      setIsAdding(false);
      setNewEmp({ name: '', role: '', department: '', email: '', phone: '', status: 'active' });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        
        <button 
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-lg shadow-slate-900/20 transition-all transform hover:-translate-y-0.5"
        >
          <UserPlus size={18} />
          {t.addMember}
        </button>
      </div>

      {/* Add Employee Form / Modal Area */}
      {isAdding && (
        <div className="bg-white rounded-xl border border-blue-100 shadow-xl shadow-blue-500/5 overflow-hidden animate-slide-in-down mb-8">
          <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-bold text-slate-900">{t.createProfile}</h3>
            <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-600">
              <X size={20} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.fullName}</label>
                <input 
                  type="text" 
                  required
                  value={newEmp.name}
                  onChange={e => setNewEmp({...newEmp, name: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. John Doe"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.role}</label>
                <input 
                  type="text" 
                  required
                  value={newEmp.role}
                  onChange={e => setNewEmp({...newEmp, role: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Marketing Manager"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{t.department}</label>
                <select 
                  value={newEmp.department}
                  onChange={e => setNewEmp({...newEmp, department: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Department</option>
                  <option value="Sales">Sales</option>
                  <option value="Design">Creative & Design</option>
                  <option value="Administration">Administration</option>
                  <option value="Finance">Finance</option>
                  <option value="Legal">Legal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{commonT.email}</label>
                <input 
                  type="email" 
                  required
                  value={newEmp.email}
                  onChange={e => setNewEmp({...newEmp, email: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="john@company.com"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{commonT.phone} (Optional)</label>
                <input 
                  type="tel" 
                  value={newEmp.phone}
                  onChange={e => setNewEmp({...newEmp, phone: e.target.value})}
                  className="w-full px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+212..."
                />
              </div>
            </div>
            <div className="mt-8 flex justify-end gap-3">
              <button 
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-6 py-2 bg-white border border-slate-200 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                {commonT.cancel}
              </button>
              <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <CheckCircle2 size={16} /> {t.createProfile}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
             <Users size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{t.totalMembers}</p>
            <h3 className="text-2xl font-bold text-slate-900">{employees.length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl">
             <CheckCircle2 size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{t.activeStatus}</p>
            <h3 className="text-2xl font-bold text-slate-900">{employees.filter(e => e.status === 'active').length}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
             <Building size={24} />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{t.departments}</p>
            <h3 className="text-2xl font-bold text-slate-900">{new Set(employees.map(e => e.department)).size}</h3>
          </div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex items-center gap-4 bg-white p-2 rounded-xl border border-slate-200 shadow-sm max-w-md">
        <Search className={`text-slate-400 ${isRTL ? 'mr-2' : 'ml-2'}`} size={20} />
        <input 
          type="text" 
          placeholder={t.searchPlaceholder} 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-transparent text-sm focus:outline-none"
        />
      </div>

      {/* Employee Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredEmployees.map((employee) => (
          <div key={employee.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group overflow-hidden">
            {/* Card Header with Banner */}
            <div className="h-24 bg-gradient-to-r from-slate-800 to-slate-900 relative">
               <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                 <button className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition-colors">
                    <MoreHorizontal size={20} />
                 </button>
               </div>
            </div>
            
            <div className="px-6 pb-6">
               <div className="relative flex justify-between items-end -mt-10 mb-4">
                 <div className="w-20 h-20 rounded-2xl bg-white p-1 shadow-md">
                    <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden border border-slate-100">
                      {employee.avatarUrl ? (
                        <img src={employee.avatarUrl} alt={employee.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-2xl font-bold text-slate-400">{employee.name.charAt(0)}</span>
                      )}
                    </div>
                 </div>
                 <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                   employee.status === 'active' 
                     ? 'bg-green-50 text-green-700 border-green-100' 
                     : 'bg-slate-100 text-slate-500 border-slate-200'
                 }`}>
                   {employee.status}
                 </span>
               </div>
               
               <div>
                 <h3 className="text-lg font-bold text-slate-900">{employee.name}</h3>
                 <p className="text-sm font-medium text-blue-600 mb-1">{employee.role}</p>
                 <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                    <Briefcase size={12} />
                    <span>{employee.department}</span>
                 </div>
               </div>

               <div className="space-y-2 pt-4 border-t border-slate-100">
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate">{employee.email}</span>
                  </div>
                  {employee.phone && (
                    <div className="flex items-center gap-3 text-sm text-slate-600">
                      <Phone size={16} className="text-slate-400" />
                      <span>{employee.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 text-sm text-slate-600">
                    <Calendar size={16} className="text-slate-400" />
                    <span>{t.joined} {new Date(employee.joinDate).toLocaleDateString()}</span>
                  </div>
               </div>

               <button className="w-full mt-6 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 hover:text-blue-600 transition-colors">
                 {t.viewProfile}
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
