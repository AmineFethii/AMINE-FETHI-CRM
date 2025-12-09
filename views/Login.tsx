
import React, { useState } from 'react';
import { Shield, ArrowRight, UserCheck, Briefcase, Lock, ShieldCheck, Server, AlertCircle } from 'lucide-react';
import { Role } from '../types';
import { translations } from '../translations';

interface LoginProps {
  onLogin: (email: string, password: string, role: Role) => Promise<boolean>;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [role, setRole] = useState<Role>('client');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const t = translations.en.login;
  const commonT = translations.en.common;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      const success = await onLogin(email, password, role);
      if (!success) {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Pre-fill for demo purposes if fields are empty when switching roles
  const handleRoleChange = (newRole: Role) => {
    setRole(newRole);
    setError(null);
    if (newRole === 'admin') {
      setEmail('amine@admin.com');
      setPassword(''); 
    } else {
      setEmail('');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 p-4 relative overflow-hidden">
      
      {/* Animated Background Layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Blue Blob - Top Left */}
        <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px] animate-blob"></div>
        
        {/* Gold/Amber Blob - Top Right */}
        <div className="absolute top-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-[#B48E43]/10 blur-[100px] animate-blob animation-delay-2000"></div>
        
        {/* Indigo Blob - Bottom Left */}
        <div className="absolute -bottom-[20%] left-[20%] w-[50%] h-[50%] rounded-full bg-indigo-500/20 blur-[100px] animate-blob animation-delay-4000"></div>
        
        {/* Subtle Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 10s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px] relative z-10 animate-fade-in-up">
        
        {/* Left Side: Brand & Visual */}
        <div className="md:w-1/2 bg-slate-800 text-white p-12 flex flex-col justify-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500 via-slate-900 to-black"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8 bg-white/95 backdrop-blur-sm p-3 rounded-xl w-fit shadow-lg shadow-black/10">
               {/* Logo */}
               <svg viewBox="0 0 300 100" className="h-10 w-auto" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M40 20 L40 80 M20 30 L60 30" stroke="#B48E43" strokeWidth="4"/>
                  <text x="70" y="50" fill="#0F172A" fontFamily="sans-serif" fontWeight="bold" fontSize="24">AMINE EL FETHI</text>
                  <text x="70" y="75" fill="#B48E43" fontFamily="sans-serif" fontSize="12" letterSpacing="2">LEGAL ADVISOR</text>
               </svg>
            </div>
            <h2 className="text-4xl font-light mb-6 leading-tight">
              {t.heroTitle} <span className="text-blue-400 font-semibold">{t.heroHighlight}</span>.
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              {t.heroSubtitle}
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-12 flex flex-col justify-center bg-white relative">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.welcome}</h3>
            <p className="text-slate-500">{t.selectType}</p>
          </div>

          <div className="flex gap-4 mb-8 p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => handleRoleChange('client')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                role === 'client' 
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <UserCheck size={18} />
              {t.clientPortal}
            </button>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                role === 'admin' 
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-blue-100' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Briefcase size={18} />
              {t.consultant}
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600 animate-fade-in">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{commonT.email}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'client' ? "contact@company.com" : "amine@admin.com"}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">{t.password}</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-300"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-wait hover:shadow-lg hover:shadow-slate-900/20"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              ) : (
                <>
                  <span>{t.accessPortal}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Trust Footer */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-3">
              <div className="p-1.5 bg-green-100 rounded-full">
                <Lock size={14} />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider">{t.secured}</span>
            </div>
            
            <div className="flex justify-between items-center px-4">
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck size={16} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium">{t.encrypted}</span>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="flex flex-col items-center gap-1">
                <Server size={16} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium">{t.privateCloud}</span>
              </div>
              <div className="w-px h-8 bg-slate-100"></div>
              <div className="flex flex-col items-center gap-1">
                <Shield size={16} className="text-slate-400" />
                <span className="text-[10px] text-slate-400 font-medium">{t.gdpr}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
