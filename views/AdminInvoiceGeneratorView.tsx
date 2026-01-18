
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Printer, 
  Download, 
  Send, 
  Plus, 
  Trash2, 
  Sparkles, 
  Loader2, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  ChevronRight,
  Hash,
  Briefcase,
  User,
  MapPin,
  Globe,
  FileDown,
  Check
} from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import { ClientData } from '../types';
import { translations, Language } from '../translations';

interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
}

interface AdminInvoiceGeneratorViewProps {
  clients: ClientData[];
  lang: Language;
}

export const AdminInvoiceGeneratorView: React.FC<AdminInvoiceGeneratorViewProps> = ({ clients, lang }) => {
  const t = translations[lang].invoicing.generator;
  const commonT = translations[lang].common;

  const [invoiceData, setInvoiceData] = useState({
    number: "25094",
    date: new Date().toISOString().split('T')[0],
    recipientType: 'portfolio' as 'portfolio' | 'custom',
    clientId: clients[0]?.id || "",
    customClient: {
      companyName: "",
      ice: "",
      address: ""
    },
    items: [
      { id: "1", description: "Rédaction et adaptation du contrat de franchise", quantity: 1, unitPrice: 5000 }
    ] as InvoiceItem[],
    remise: 0,
    expedition: 0,
    tvaRate: 20
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  const recipientInfo = useMemo(() => {
    if (invoiceData.recipientType === 'portfolio') {
      const c = clients.find(c => c.id === invoiceData.clientId);
      return {
        companyName: c?.companyName || "N/A",
        ice: c?.cin || "000000000000000",
        address: c?.nationality || "Maroc"
      };
    }
    return {
      companyName: invoiceData.customClient.companyName || "NOM DE L'ENTREPRISE",
      ice: invoiceData.customClient.ice || "ICE DU CLIENT",
      address: invoiceData.customClient.address || "ADRESSE DU CLIENT"
    };
  }, [invoiceData, clients]);

  // Calculations
  const subTotalHt = invoiceData.items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
  const subTotalAfterRemise = subTotalHt - invoiceData.remise;
  const tvaAmount = (subTotalAfterRemise * invoiceData.tvaRate) / 100;
  const totalTtc = subTotalAfterRemise + tvaAmount + invoiceData.expedition;

  const handleAddItem = () => {
    setInvoiceData({
      ...invoiceData,
      items: [...invoiceData.items, { id: Date.now().toString(), description: "", quantity: 1, unitPrice: 0 }]
    });
  };

  const handleUpdateItem = (id: string, updates: Partial<InvoiceItem>) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.map(item => item.id === id ? { ...item, ...updates } : item)
    });
  };

  const handleRemoveItem = (id: string) => {
    setInvoiceData({
      ...invoiceData,
      items: invoiceData.items.filter(item => item.id !== id)
    });
  };

  const handleAIFill = async () => {
    setIsGenerating(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const context = invoiceData.recipientType === 'portfolio' 
        ? `portfolio client '${recipientInfo.companyName}' receiving '${clients.find(c => c.id === invoiceData.clientId)?.serviceType}'`
        : `custom client '${recipientInfo.companyName}'`;

      const prompt = `Generate a detailed, professional single-line service description in French for a Moroccan business invoice. The client is ${context}. Respond with ONLY the text of the description.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: prompt
      });

      const text = response.text?.trim() || "";
      if (invoiceData.items.length > 0) {
        handleUpdateItem(invoiceData.items[0].id, { description: text });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In modern browsers, PDF download is effectively a "Print to PDF" operation
    // We trigger the print dialog which provides the "Save as PDF" option as the default high-fidelity method.
    window.print();
  };

  const handleSave = async () => {
    setSaveStatus('saving');
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Persist to localStorage
    const savedInvoices = JSON.parse(localStorage.getItem('crm_generated_invoices') || '[]');
    const newInvoiceRecord = {
      ...invoiceData,
      id: `inv-${Date.now()}`,
      totalTtc,
      timestamp: new Date().toISOString(),
      clientDisplayName: recipientInfo.companyName
    };
    
    savedInvoices.push(newInvoiceRecord);
    localStorage.setItem('crm_generated_invoices', JSON.stringify(savedInvoices));

    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 3000);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleDownloadPDF}
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            title="Download as PDF"
          >
            <FileDown size={18} /> 
            <span className="hidden sm:inline">PDF</span>
          </button>
          <button 
            onClick={handlePrint} 
            className="flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-5 py-2.5 rounded-xl font-bold shadow-sm hover:bg-slate-50 transition-all active:scale-95"
            title="Print Invoice"
          >
            <Printer size={18} />
            <span className="hidden sm:inline">Print</span>
          </button>
          <button 
            onClick={handleSave}
            disabled={saveStatus !== 'idle'}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold shadow-lg transition-all active:scale-95 min-w-[140px] justify-center ${
              saveStatus === 'saved' 
                ? 'bg-green-600 text-white shadow-green-200' 
                : 'bg-blue-600 text-white shadow-blue-900/20 hover:bg-blue-700 disabled:opacity-70'
            }`}
          >
            {saveStatus === 'saving' ? (
              <Loader2 size={18} className="animate-spin" />
            ) : saveStatus === 'saved' ? (
              <Check size={18} />
            ) : (
              <Send size={18} />
            )}
            {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Saved' : commonT.save}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start">
        
        {/* --- FORM COLUMN --- */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Hash size={18} className="text-blue-500" /> {t.details}
              </h3>
              <button 
                onClick={handleAIFill}
                disabled={isGenerating}
                className="flex items-center gap-2 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-lg hover:bg-purple-100 disabled:opacity-50 transition-all"
              >
                {isGenerating ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
                Auto-Fill with AI
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Invoice Number</label>
                  <input 
                    type="text" 
                    value={invoiceData.number}
                    onChange={(e) => setInvoiceData({...invoiceData, number: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Invoice Date</label>
                  <input 
                    type="date" 
                    value={invoiceData.date}
                    onChange={(e) => setInvoiceData({...invoiceData, date: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* RECIPIENT SECTION */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t.clientInfo}</label>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button 
                      onClick={() => setInvoiceData({...invoiceData, recipientType: 'portfolio'})}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${invoiceData.recipientType === 'portfolio' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      Portfolio
                    </button>
                    <button 
                      onClick={() => setInvoiceData({...invoiceData, recipientType: 'custom'})}
                      className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${invoiceData.recipientType === 'custom' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                    >
                      Custom
                    </button>
                  </div>
                </div>

                {invoiceData.recipientType === 'portfolio' ? (
                  <div className="relative group">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none group-focus-within:text-blue-500 transition-colors">
                      <Briefcase size={18} />
                    </div>
                    <select 
                      value={invoiceData.clientId}
                      onChange={(e) => setInvoiceData({...invoiceData, clientId: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none"
                    >
                      {clients.map(c => <option key={c.id} value={c.id}>{c.companyName} ({c.name})</option>)}
                    </select>
                  </div>
                ) : (
                  <div className="space-y-3 animate-fade-in">
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="Nom de l'entreprise"
                        value={invoiceData.customClient.companyName}
                        onChange={(e) => setInvoiceData({...invoiceData, customClient: {...invoiceData.customClient, companyName: e.target.value}})}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                      <input 
                        type="text" 
                        placeholder="ICE (Identifiant Commun de l'Entreprise)"
                        value={invoiceData.customClient.ice}
                        onChange={(e) => setInvoiceData({...invoiceData, customClient: {...invoiceData.customClient, ice: e.target.value}})}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-slate-400" size={16} />
                      <textarea 
                        rows={2}
                        placeholder="Adresse Complète"
                        value={invoiceData.customClient.address}
                        onChange={(e) => setInvoiceData({...invoiceData, customClient: {...invoiceData.customClient, address: e.target.value}})}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-blue-500 outline-none resize-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* ITEMS SECTION */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{t.items}</label>
                  <button onClick={handleAddItem} className="text-blue-600 hover:text-blue-700 font-bold text-xs flex items-center gap-1">
                    <Plus size={14} /> Add Line
                  </button>
                </div>

                <div className="space-y-3">
                  {invoiceData.items.map((item) => (
                    <div key={item.id} className="flex gap-3 group">
                      <div className="flex-1">
                        <input 
                          type="text" 
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => handleUpdateItem(item.id, { description: e.target.value })}
                          className="w-full px-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:ring-1 focus:ring-blue-500 focus:bg-white transition-all"
                        />
                      </div>
                      <div className="w-16">
                        <input 
                          type="number" 
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => handleUpdateItem(item.id, { quantity: parseInt(e.target.value) || 0 })}
                          className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-center"
                        />
                      </div>
                      <div className="w-24">
                        <input 
                          type="number" 
                          placeholder="Price"
                          value={item.unitPrice}
                          onChange={(e) => handleUpdateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })}
                          className="w-full px-2 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-right font-mono"
                        />
                      </div>
                      <button onClick={() => handleRemoveItem(item.id)} className="p-2 text-slate-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-100">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Discount (Remise)</label>
                  <input 
                    type="number" 
                    value={invoiceData.remise}
                    onChange={(e) => setInvoiceData({...invoiceData, remise: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Expedition / Manutention</label>
                  <input 
                    type="number" 
                    value={invoiceData.expedition}
                    onChange={(e) => setInvoiceData({...invoiceData, expedition: parseFloat(e.target.value) || 0})}
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- PREVIEW COLUMN (ACT TEMPLATE) --- */}
        <div className="flex flex-col items-center">
           <div className="text-xs font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">{t.preview}</div>
           
           {/* THE TEMPLATE BOX */}
           <div className="w-full max-w-[800px] bg-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] aspect-[1/1.414] p-[5%] flex flex-col font-sans text-slate-900 border border-slate-100 print:shadow-none print:p-0" id="invoice-printable">
              
              {/* Header section from PDF */}
              <div className="flex justify-between items-start mb-12">
                 <div className="space-y-1">
                    <div className="flex items-baseline gap-2">
                       <h1 className="text-3xl font-black text-[#1e3a8a] tracking-tight">ACT <span className="text-[#fbbf24]">Consulting</span></h1>
                       <span className="text-[10px] font-bold text-[#1e3a8a]">S.A.R.L AU</span>
                    </div>
                    <div className="text-[10px] text-slate-500 leading-tight pt-2">
                       <p>Adresse : Bur n 6 , Etage 2 , AV 11 janvier</p>
                       <p>Centre d'affaires Jihane - marrakech</p>
                    </div>
                    <div className="grid grid-cols-[50px_1fr] gap-x-2 text-[10px] pt-4">
                       <span className="text-slate-400">Fixe</span> <span className="font-semibold">05 25375968</span>
                       <span className="text-slate-400">Mobile</span> <span className="font-semibold">0713125021</span>
                       <span className="text-slate-400">Email</span> <span className="font-semibold text-blue-600 underline">contact@actconsulting.ma</span>
                    </div>
                 </div>
                 
                 <div className="relative">
                    <div className="w-32 h-20 flex items-center justify-center">
                       {/* Logo matching ACT style */}
                       <svg viewBox="0 0 200 80" className="w-full h-full">
                          <path d="M40 20 L60 60 L80 20" stroke="#1e3a8a" strokeWidth="8" fill="none" />
                          <circle cx="100" cy="40" r="10" stroke="#fbbf24" strokeWidth="4" fill="none" />
                          <text x="115" y="45" fill="#1e3a8a" fontWeight="900" fontSize="24">ACT</text>
                          <text x="115" y="65" fill="#fbbf24" fontWeight="700" fontSize="12">Consulting</text>
                       </svg>
                    </div>
                 </div>
              </div>

              {/* Client Info Block */}
              <div className="flex justify-between items-end mb-10 border-b border-slate-100 pb-8">
                 <div className="max-w-[60%] space-y-2">
                    <p className="text-[11px] font-black text-[#1e3a8a] underline uppercase">{t.billTo}</p>
                    <div className="text-[13px] space-y-1">
                      <p className="font-black text-slate-800 uppercase">CLIENT : STE {recipientInfo.companyName}</p>
                      <p className="text-slate-600 font-bold uppercase">ICE : {recipientInfo.ice}</p>
                      <p className="text-slate-500 leading-snug uppercase">ADRESSE : {recipientInfo.address}</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-[13px] font-bold text-slate-800">{t.doneAt} {new Date(invoiceData.date).toLocaleDateString('fr-FR')}</p>
                 </div>
              </div>

              {/* Main Table */}
              <div className="flex-1 flex relative">
                 {/* Vertical Invoice # text on the left */}
                 <div className="absolute left-[-45px] top-0 bottom-0 flex items-center justify-center">
                    <div className="rotate-[-90deg] whitespace-nowrap text-xl font-bold text-slate-300">
                       Facture N° <span className="text-[#fbbf24] ml-2"># {invoiceData.number}</span>
                    </div>
                 </div>

                 <div className="w-full">
                    <table className="w-full border-collapse">
                       <thead>
                          <tr className="bg-[#1e3a8a] text-white text-[10px] font-black uppercase tracking-wider">
                             <th className="px-4 py-2.5 text-left border border-[#1e3a8a] w-[55%]">DESCRIPTION</th>
                             <th className="px-4 py-2.5 text-center border border-[#1e3a8a]">QUANTITÉ</th>
                             <th className="px-4 py-2.5 text-center border border-[#1e3a8a]">PRIX UNITAIRE</th>
                             <th className="px-4 py-2.5 text-right border border-[#1e3a8a]">TOTAL</th>
                          </tr>
                       </thead>
                       <tbody className="text-[11px] font-bold text-slate-700">
                          {invoiceData.items.map((item, i) => (
                             <tr key={i} className="h-10">
                                <td className="px-4 py-3 border-x border-b border-slate-200">{item.description}</td>
                                <td className="px-4 py-3 border-r border-b border-slate-200 text-center">{item.quantity}</td>
                                <td className="px-4 py-3 border-r border-b border-slate-200 text-center">{item.unitPrice.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                                <td className="px-4 py-3 border-r border-b border-slate-200 text-right">{(item.quantity * item.unitPrice).toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</td>
                             </tr>
                          ))}
                          {Array.from({ length: Math.max(0, 8 - invoiceData.items.length) }).map((_, i) => (
                             <tr key={`empty-${i}`} className="h-10">
                                <td className="px-4 py-3 border-x border-b border-slate-50"></td>
                                <td className="px-4 py-3 border-r border-b border-slate-50 text-center">-</td>
                                <td className="px-4 py-3 border-r border-b border-slate-50 text-center">-</td>
                                <td className="px-4 py-3 border-r border-b border-slate-50 text-right">-</td>
                             </tr>
                          ))}
                       </tbody>
                    </table>

                    {/* Calculations area */}
                    <div className="flex justify-end mt-4">
                       <div className="w-[45%] text-[10px] font-black text-[#1e3a8a]">
                          <div className="grid grid-cols-[1fr_80px] gap-2 py-1.5 border-b border-slate-100">
                             <span>{t.subTotal}</span>
                             <span className="text-right text-slate-800">{subTotalHt.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="grid grid-cols-[1fr_80px] gap-2 py-1.5 border-b border-slate-100">
                             <span>{t.discount}</span>
                             <span className="text-right text-slate-800">{invoiceData.remise > 0 ? invoiceData.remise.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '-'}</span>
                          </div>
                          <div className="grid grid-cols-[1fr_80px] gap-2 py-1.5 border-b border-slate-100 bg-slate-50/50">
                             <span>{t.subTotalAfterDiscount}</span>
                             <span className="text-right text-slate-800">{subTotalAfterRemise.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="grid grid-cols-[1fr_80px] gap-2 py-1.5 border-b border-slate-100">
                             <span>{t.vat}</span>
                             <span className="text-right text-slate-800">{tvaAmount.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
                          </div>
                          <div className="grid grid-cols-[1fr_80px] gap-2 py-1.5 border-b border-slate-200">
                             <span>{t.shipping}</span>
                             <span className="text-right text-slate-800">{invoiceData.expedition > 0 ? invoiceData.expedition.toLocaleString('fr-FR', { minimumFractionDigits: 2 }) : '-'}</span>
                          </div>
                          <div className="grid grid-cols-[1fr_100px] gap-2 py-3 bg-[#cbd5e1] mt-2 px-2 rounded-sm border border-slate-300">
                             <span className="text-sm">{t.totalTtc}</span>
                             <span className="text-sm text-right text-[#1e3a8a]">{totalTtc.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Bottom Stamp area */}
              <div className="mt-12 flex justify-end">
                 <div className="relative w-48 h-32 flex flex-col items-center justify-center opacity-70">
                    <div className="absolute inset-0 border-4 border-blue-800/30 rounded-[2rem] rotate-[-5deg] border-double"></div>
                    <p className="text-[10px] font-black text-blue-900/80 uppercase text-center rotate-[-5deg] px-4 leading-tight">
                       ACT CONSULTING - SARL AU<br/>
                       Marrakech, Maroc<br/>
                       IF: 45958003 | RC: 142141
                    </p>
                 </div>
              </div>

              {/* Footer legal info */}
              <div className="mt-auto border-t-[8px] border-[#1e3a8a] pt-4">
                 <p className="text-[8px] text-center text-slate-400 font-bold leading-relaxed uppercase tracking-tight">
                    ACT Consulting S.A.R.L.AU - ICE : 002610187000010 - IF : 45958003 - TP : 43001874 - RC : 142141 - Capital : 100.000,00 DH<br/>
                    Raison sociale : Bur n 6 , Etage 2 , AV 11 janvier Centre d'affaires Jihane - marrakech
                 </p>
              </div>
           </div>
        </div>

      </div>

      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-printable, #invoice-printable * { visibility: visible; }
          #invoice-printable {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            box-shadow: none !important;
            border: none !important;
            background: white !important;
            padding: 2cm !important;
          }
        }
      `}</style>
    </div>
  );
};
