
import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  BookOpen, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Layout, 
  MessageSquare,
  FileText,
  Download,
  FileBadge,
  ScrollText,
  Gavel,
  FileSpreadsheet
} from 'lucide-react';
import { translations } from '../translations';

interface Asset {
  id: string;
  title: string;
  description: string;
  type: 'PDF' | 'DOCX' | 'XLSX';
  icon: React.ReactNode;
}

const MOCK_ASSETS: Asset[] = [
  {
    id: 'a1',
    title: 'Standard NDA Template',
    description: 'Protect your business secrets with our lawyer-approved non-disclosure agreement.',
    type: 'PDF',
    icon: <ShieldCheck size={24} className="text-blue-500" />
  },
  {
    id: 'a2',
    title: 'Company Creation Form',
    description: 'Mandatory information form required to initiate SARL creation in Morocco.',
    type: 'DOCX',
    icon: <ScrollText size={24} className="text-amber-500" />
  },
  {
    id: 'a3',
    title: 'Shareholder Agreement',
    description: 'Framework template for multi-partner company governance.',
    type: 'PDF',
    icon: <Gavel size={24} className="text-purple-500" />
  },
  {
    id: 'a4',
    title: 'Fiscal Planning Sheet',
    description: 'Estimate your monthly VAT and social contributions using this tracker.',
    type: 'XLSX',
    icon: <FileSpreadsheet size={24} className="text-green-500" />
  }
];

interface ClientGuideViewProps {
  onNavigate?: (view: string) => void;
}

export const ClientGuideView: React.FC<ClientGuideViewProps> = ({ onNavigate }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const t = translations.en.clientGuide;
  const commonT = translations.en.common;
  const steps = t.steps;
  const totalSteps = steps.length;

  const handleNext = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const icons = [
    <Layout size={64} className="text-blue-500" />,
    <FileText size={64} className="text-amber-500" />,
    <MessageSquare size={64} className="text-green-500" />,
    <ShieldCheck size={64} className="text-indigo-500" />
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
      
      {/* --- HERO SECTION & SLIDESHOW --- */}
      <div className="space-y-6">
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden min-h-[500px] flex flex-col transition-all duration-300">
          {/* Progress Bar */}
          <div className="h-1.5 w-full bg-slate-100">
             <div 
               className="h-full bg-blue-600 transition-all duration-500 ease-out" 
               style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
             ></div>
          </div>

          <div className="flex-1 p-8 md:p-12 flex flex-col items-center justify-center text-center">
             {/* Decorative Elements */}
             <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-500/10 blur-[60px] rounded-full scale-150"></div>
                <div className="relative w-32 h-32 bg-slate-50 rounded-3xl border border-slate-100 shadow-inner flex items-center justify-center animate-scale-up">
                   {icons[currentStep] || <BookOpen size={64} className="text-blue-600" />}
                </div>
                <div className="absolute -top-4 -right-4 bg-white p-2 rounded-xl shadow-lg border border-slate-50 animate-bounce">
                   <Sparkles size={20} className="text-amber-400" />
                </div>
             </div>

             <div className="max-w-2xl animate-fade-in" key={currentStep}>
                <h2 className="text-3xl font-extrabold text-slate-900 mb-6 tracking-tight">
                  {steps[currentStep].title}
                </h2>
                <p className="text-lg text-slate-600 leading-relaxed">
                  {steps[currentStep].description}
                </p>
             </div>
          </div>

          {/* Footer Navigation */}
          <div className="p-6 md:p-8 border-t border-slate-100 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                {t.stepOf.replace('{current}', (currentStep + 1).toString()).replace('{total}', totalSteps.toString())}
             </div>

             <div className="flex items-center gap-3 w-full md:w-auto">
                <button 
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${
                    currentStep === 0 
                      ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                      : 'bg-white border border-slate-200 text-slate-700 hover:bg-white hover:border-blue-500 hover:text-blue-600'
                  }`}
                >
                  <ChevronLeft size={20} />
                  {t.back}
                </button>

                <button 
                  onClick={handleNext}
                  className="flex-1 md:flex-none flex items-center justify-center gap-2 px-10 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                >
                  {currentStep === totalSteps - 1 ? t.finish : t.next}
                  {currentStep < totalSteps - 1 && <ChevronRight size={20} />}
                  {currentStep === totalSteps - 1 && <CheckCircle2 size={20} />}
                </button>
             </div>

             <div className="hidden md:flex items-center gap-2">
                {steps.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === currentStep ? 'w-8 bg-blue-600' : 'w-2 bg-slate-300'
                    }`}
                  />
                ))}
             </div>
          </div>
        </div>
      </div>

      {/* --- ASSETS & DOWNLOADS SECTION --- */}
      <div className="space-y-8 pt-8 border-t border-slate-200">
         <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
            <div className="text-center md:text-left">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3 justify-center md:justify-start">
                 <FileBadge className="text-blue-600" size={28} />
                 {t.assetsTitle}
              </h2>
              <p className="text-slate-500 mt-1">{t.assetsSubtitle}</p>
            </div>
            <div className="hidden md:block">
               <div className="flex items-center gap-2 bg-green-50 text-green-700 px-4 py-1.5 rounded-full border border-green-100 shadow-sm transition-all hover:bg-green-100 group cursor-default">
                  <ShieldCheck size={14} className="fill-green-600/10 group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">
                    Verified by Amine Fethi
                  </span>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MOCK_ASSETS.map((asset) => (
              <div key={asset.id} className="group bg-white rounded-2xl border border-slate-200 p-6 flex items-start gap-5 hover:border-blue-300 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 cursor-default">
                 <div className="p-4 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors border border-slate-100 group-hover:border-blue-100">
                    {asset.icon}
                 </div>
                 <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                       <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors truncate">{asset.title}</h3>
                       <span className="text-[10px] font-bold text-slate-400 uppercase bg-slate-50 px-1.5 py-0.5 rounded border border-slate-100">{asset.type}</span>
                    </div>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-2 mb-4">
                       {asset.description}
                    </p>
                    <button className="flex items-center gap-2 text-xs font-bold text-blue-600 bg-blue-50/50 group-hover:bg-blue-600 group-hover:text-white px-4 py-2 rounded-lg transition-all duration-300 transform active:scale-95 shadow-sm">
                       <Download size={14} />
                       {commonT.download}
                    </button>
                 </div>
              </div>
            ))}
         </div>
      </div>

      {/* --- QUICK HELP GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8">
         <div className="bg-slate-900 p-8 rounded-3xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700"></div>
            <div className="relative z-10 flex items-start gap-5">
               <div className="p-3 bg-white/10 text-blue-400 rounded-2xl backdrop-blur-sm border border-white/10">
                  <Clock size={28} />
               </div>
               <div>
                  <h4 className="font-bold text-xl mb-2">Need immediate help?</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Our priority support team is available from 9 AM to 6 PM (Casablanca Time) for any legal or technical queries.</p>
                  <button className="text-sm font-bold bg-white text-slate-900 px-6 py-2.5 rounded-xl hover:bg-blue-50 transition-colors">
                     Contact Support
                  </button>
               </div>
            </div>
         </div>

         <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex items-start gap-5 relative group overflow-hidden">
            <div className="absolute inset-0 bg-blue-50/0 group-hover:bg-blue-50/50 transition-colors duration-500"></div>
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 relative z-10">
               <BookOpen size={28} />
            </div>
            <div className="relative z-10">
               <h4 className="font-bold text-xl text-slate-900 mb-2">Watch Video Guides</h4>
               <p className="text-sm text-slate-500 leading-relaxed mb-6">Prefer visual learning? Visit the tutorials section for detailed step-by-step walk-throughs of our platform features.</p>
               <button 
                 onClick={() => onNavigate && onNavigate('tutorials')}
                 className="text-sm font-bold text-blue-600 hover:underline flex items-center gap-2"
               >
                  Browse Tutorials <ChevronRight size={16} />
               </button>
            </div>
         </div>
      </div>

    </div>
  );
};
