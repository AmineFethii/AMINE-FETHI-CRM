
import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  Search,
  File,
  Image as ImageIcon,
  Shield,
  FolderOpen,
  Folder,
  Lock,
  User,
  ChevronRight
} from 'lucide-react';
import { ClientData, ClientDocument } from '../types';
import { translations } from '../translations';

interface ClientDocumentsViewProps {
  client: ClientData;
  onUpload: (fileName: string, category: string) => void;
}

export const ClientDocumentsView: React.FC<ClientDocumentsViewProps> = ({ client, onUpload }) => {
  const [activeFolder, setActiveFolder] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const t = translations.en.documents;
  const commonT = translations.en.common;

  const folderCategories = [
    { id: 'RECEIPTS DOC', label: t.folderReceipts },
    { id: 'INVOICES DOC', label: t.folderInvoices },
    { id: 'BANKING DOC', label: t.folderBanking },
    { id: 'LEGAL DOC', label: t.folderLegal },
  ];

  const isUploadDisabled = activeFolder === 'All';

  const filteredDocs = useMemo(() => {
    let docs = client.documents.filter(doc => {
      const matchesFolder = activeFolder === 'All' || doc.type.toUpperCase() === activeFolder.replace(' DOC', '');
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFolder && matchesSearch;
    });

    return docs.sort((a, b) => {
      const dateA = new Date(a.uploadDate || 0).getTime();
      const dateB = new Date(b.uploadDate || 0).getTime();
      return dateB - dateA;
    });
  }, [client.documents, activeFolder, searchTerm]);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (isUploadDisabled) return;
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files[0].name, activeFolder.replace(' DOC', ''));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClickUpload = () => {
    if (isUploadDisabled) return;
    
    const mockFiles = ["Lease_Agreement.pdf", "Passport_Copy.jpg", "Bank_Statement.pdf", "Tax_Return_2023.pdf"];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    onUpload(randomFile, activeFolder.replace(' DOC', ''));
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'identity': return <Shield size={20} />;
      case 'image': return <ImageIcon size={20} />;
      default: return <FileText size={20} />;
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-50 text-green-600 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-600 border-red-200';
      case 'uploaded': return 'bg-blue-50 text-blue-600 border-blue-200';
      default: return 'bg-slate-100 text-slate-600 border-slate-200';
    }
  };

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in pb-12 px-1 md:px-0">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{t.title}</h1>
        <p className="text-slate-500 text-sm md:text-base">{t.subtitle}</p>
      </div>

      {/* --- FOLDER VIEW --- */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {folderCategories.map(folder => (
          <div 
            key={folder.id}
            onClick={() => setActiveFolder(folder.id === activeFolder ? 'All' : folder.id)}
            className={`p-4 md:p-5 rounded-2xl border flex items-center gap-3 md:gap-4 cursor-pointer transition-all duration-300 ${
              activeFolder === folder.id 
                ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-900/20 scale-[1.01]' 
                : 'bg-white border-slate-200 md:border-transparent md:bg-[#f0f4f8] text-slate-700 hover:bg-[#e2eaf1]'
            }`}
          >
            <div className={`p-2 md:p-2.5 rounded-xl flex-shrink-0 ${activeFolder === folder.id ? 'bg-white/20' : 'bg-slate-600 text-white shadow-sm'}`}>
              <Folder size={18} fill="currentColor" />
            </div>
            <span className="text-[10px] md:text-[11px] font-black uppercase tracking-wider whitespace-nowrap overflow-hidden text-ellipsis">
              {folder.label}
            </span>
          </div>
        ))}
      </div>

      {/* --- UPLOAD ZONE --- */}
      <div className="space-y-3">
        {isUploadDisabled && (
          <div className="flex items-center gap-2 text-red-600 px-1 animate-pulse">
             <AlertCircle size={14} className="flex-shrink-0" />
             <p className="text-[10px] md:text-xs font-black uppercase tracking-widest leading-tight">
               Please select a folder above to enable upload.
             </p>
          </div>
        )}
        
        <div 
          className={`bg-white border-2 border-dashed rounded-3xl p-8 md:p-12 flex flex-col items-center justify-center text-center transition-all shadow-sm ${
            isUploadDisabled 
              ? 'border-slate-200 bg-slate-50/50 cursor-not-allowed opacity-60' 
              : 'border-blue-200 hover:bg-blue-50/50 hover:border-blue-300 cursor-pointer group'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClickUpload}
        >
          <div className={`w-14 h-14 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-4 md:mb-6 transition-transform shadow-sm ${
            isUploadDisabled ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-600 group-hover:scale-110'
          }`}>
            {isUploadDisabled ? <Lock size={28} /> : <UploadCloud size={32} className="md:size-10" />}
          </div>
          
          <h3 className={`text-lg md:text-xl font-bold ${isUploadDisabled ? 'text-slate-400' : 'text-slate-900'}`}>
            {isUploadDisabled ? 'Upload Restricted' : t.uploadNew}
          </h3>
          
          <p className="text-slate-500 mt-2 max-w-sm mx-auto text-xs md:text-sm">
            {isUploadDisabled 
              ? "The upload zone is locked. Choose a folder from the cards above to proceed." 
              : <>Drag and drop files here, or <span className="text-blue-600 font-bold underline underline-offset-4 decoration-blue-200">browse computer</span>.</>}
          </p>

          {!isUploadDisabled && (
            <div className="mt-4 md:mt-6 flex flex-wrap justify-center gap-2 text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span className="px-2 py-1 bg-slate-50 rounded border border-slate-100">PDF</span>
               <span className="px-2 py-1 bg-slate-50 rounded border border-slate-100">JPG</span>
               <span className="px-2 py-1 bg-slate-50 rounded border border-slate-100">PNG</span>
               <span>MAX 25MB</span>
            </div>
          )}
        </div>
      </div>

      {/* Document Library List Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 md:p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-2">
             <div className="p-1.5 md:p-2 bg-blue-600 rounded-lg text-white">
                <FolderOpen size={16} className="md:size-[18px]" />
             </div>
             <h2 className="font-bold text-slate-900 uppercase text-[10px] md:text-xs tracking-widest truncate">
                {activeFolder === 'All' ? 'All Documents' : activeFolder}
             </h2>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3 md:left-4" size={16} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 md:py-2.5 bg-white border border-slate-200 rounded-2xl text-xs md:text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all pl-10 md:pl-12 pr-4 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* --- DOCUMENT DISPLAY --- */}
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-black tracking-[0.2em]">
              <tr>
                <th className="px-8 py-5 text-start">{t.docName}</th>
                <th className="px-8 py-5 text-start">{t.category}</th>
                <th className="px-8 py-5 text-start">{commonT.date}</th>
                <th className="px-8 py-5 text-start">{commonT.status}</th>
                <th className="px-8 py-5 text-end">{commonT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-2xl shadow-sm border transition-transform group-hover:scale-110 ${
                          doc.name.endsWith('.pdf') ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                        }`}>
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{doc.name}</p>
                          {doc.rejectionReason && doc.status === 'rejected' && (
                             <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{doc.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="inline-flex items-center px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 border border-slate-200">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-bold text-slate-400">
                      {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="px-8 py-5">
                       <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyles(doc.status)}`}>
                         {doc.status === 'approved' && <CheckCircle size={12} />}
                         {doc.status === 'rejected' && <AlertCircle size={12} />}
                         {doc.status === 'uploaded' && <Clock size={12} />}
                         <span>{
                           doc.status === 'uploaded' ? commonT.pending : 
                           doc.status === 'approved' ? commonT.approved :
                           doc.status === 'rejected' ? commonT.rejected : doc.status
                         }</span>
                       </div>
                    </td>
                    <td className="px-8 py-5 text-end">
                      <button className="text-slate-300 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-xl transition-all active:scale-90">
                        <Download size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <EmptyState t={t} />
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List View */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="p-4 active:bg-slate-50 transition-colors flex flex-col gap-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`p-2.5 rounded-xl shadow-sm border flex-shrink-0 ${
                      doc.name.endsWith('.pdf') ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                    }`}>
                      {getFileIcon(doc.type)}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-sm truncate">{doc.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">
                          {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString('en-GB') : '-'}
                        </span>
                        <span className="text-slate-300">•</span>
                        <span className="text-[9px] font-bold text-blue-500 uppercase tracking-widest">{doc.type}</span>
                      </div>
                    </div>
                  </div>
                  <button className="text-slate-400 hover:text-blue-600 p-1">
                    <Download size={18} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between mt-1">
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(doc.status)}`}>
                    {doc.status === 'approved' && <CheckCircle size={11} />}
                    {doc.status === 'rejected' && <AlertCircle size={11} />}
                    {doc.status === 'uploaded' && <Clock size={11} />}
                    <span>{
                      doc.status === 'uploaded' ? commonT.pending : 
                      doc.status === 'approved' ? commonT.approved :
                      doc.status === 'rejected' ? commonT.rejected : doc.status
                    }</span>
                  </div>
                  {doc.rejectionReason && doc.status === 'rejected' && (
                    <span className="text-[9px] text-red-500 font-bold uppercase truncate max-w-[50%]">{doc.rejectionReason}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-12"><EmptyState t={t} /></div>
          )}
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ t }: { t: any }) => (
  <div className="flex flex-col items-center gap-4 py-12 px-8 text-center text-slate-400">
    <div className="p-5 md:p-6 bg-slate-50 rounded-full">
       <File size={40} className="opacity-10 md:size-12" />
    </div>
    <p className="font-bold text-xs md:text-sm tracking-tight">{t.noDocs}</p>
  </div>
);
