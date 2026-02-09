
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
  ChevronRight,
  Plus
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

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide bg-green-50 text-green-700 border-green-200">
            <CheckCircle size={12} /> {commonT.approved}
          </span>
        );
      case 'rejected': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide bg-red-50 text-red-700 border-red-200">
            <AlertCircle size={12} /> {commonT.rejected}
          </span>
        );
      case 'uploaded': 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide bg-slate-100 text-slate-500 border-slate-200">
            <Clock size={12} /> {commonT.pending}
          </span>
        );
      default: 
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase tracking-wide bg-slate-100 text-slate-500 border-slate-200">
            {status}
          </span>
        );
    }
  };

  // Stats for the view
  const stats = {
    total: client.documents.length,
    pending: client.documents.filter(d => d.status === 'uploaded').length,
    approved: client.documents.filter(d => d.status === 'approved').length,
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header Section */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        <p className="text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      {/* Top Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group transition-all">
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Documents</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.total}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group transition-all">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-colors">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Review</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.pending}</h3>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4 group transition-all">
          <div className="p-3 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-colors">
            <CheckCircle size={24} />
          </div>
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approved Files</p>
            <h3 className="text-2xl font-bold text-slate-900">{stats.approved}</h3>
          </div>
        </div>
      </div>

      {/* Folders Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {folderCategories.map(folder => (
          <button 
            key={folder.id}
            onClick={() => setActiveFolder(folder.id === activeFolder ? 'All' : folder.id)}
            className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${
              activeFolder === folder.id 
                ? 'bg-slate-900 border-slate-900 text-white shadow-lg shadow-slate-900/20 translate-y-[-2px]' 
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <div className={`p-2 rounded-xl flex-shrink-0 ${activeFolder === folder.id ? 'bg-white/10 text-white' : 'bg-blue-50 text-blue-600'}`}>
              <Folder size={18} fill={activeFolder === folder.id ? "white" : "currentColor"} className={activeFolder === folder.id ? "opacity-100" : "opacity-70"} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis">
              {folder.label}
            </span>
          </button>
        ))}
      </div>

      {/* Upload Zone Section */}
      <div className="space-y-3">
        {isUploadDisabled && (
          <div className="flex items-center gap-2 text-blue-600 px-1">
             <AlertCircle size={14} className="flex-shrink-0" />
             <p className="text-[10px] font-bold uppercase tracking-widest">
               Please select a specific folder to enable uploads.
             </p>
          </div>
        )}
        
        <div 
          className={`bg-white border border-slate-200 rounded-2xl p-8 md:p-12 flex flex-col items-center justify-center text-center transition-all shadow-sm ${
            isUploadDisabled 
              ? 'bg-slate-50/50 cursor-not-allowed opacity-60' 
              : 'border-dashed border-2 border-blue-200 hover:bg-blue-50/30 hover:border-blue-300 cursor-pointer group'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={handleClickUpload}
        >
          <div className={`p-4 rounded-xl flex items-center justify-center mb-6 transition-transform shadow-sm ${
            isUploadDisabled ? 'bg-slate-200 text-slate-400' : 'bg-blue-50 text-blue-600 group-hover:scale-110'
          }`}>
            {isUploadDisabled ? <Lock size={32} /> : <UploadCloud size={32} />}
          </div>
          
          <h3 className={`text-xl font-bold ${isUploadDisabled ? 'text-slate-400' : 'text-slate-900'}`}>
            {isUploadDisabled ? 'Upload Area Locked' : t.uploadNew}
          </h3>
          
          <p className="text-slate-500 mt-2 max-w-sm mx-auto text-sm">
            {isUploadDisabled 
              ? "Select a category above to start uploading your documents securely." 
              : <>Drag and drop files here, or <span className="text-blue-600 font-bold">browse your device</span>.</>}
          </p>

          {!isUploadDisabled && (
            <div className="mt-6 flex flex-wrap justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
               <span className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">PDF</span>
               <span className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">JPG</span>
               <span className="px-2.5 py-1 bg-slate-50 rounded-lg border border-slate-100">PNG</span>
               <span className="ml-2">MAX 25MB</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Document Library Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Card Toolbar */}
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/30">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-slate-900 rounded-lg text-white">
                <FolderOpen size={16} />
             </div>
             <h2 className="font-bold text-slate-900 uppercase text-[11px] tracking-widest">
                {activeFolder === 'All' ? 'Complete Library' : activeFolder}
             </h2>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-4" size={16} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm pl-12 pr-4 placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        {/* Desktop View Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-bold tracking-widest border-b border-slate-100">
              <tr>
                <th className="px-8 py-4 text-start">{t.docName}</th>
                <th className="px-8 py-4 text-start">{t.category}</th>
                <th className="px-8 py-4 text-start">{commonT.date}</th>
                <th className="px-8 py-4 text-start">{commonT.status}</th>
                <th className="px-8 py-4 text-end">{commonT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-xl shadow-sm border transition-transform group-hover:scale-105 ${
                          doc.name.endsWith('.pdf') ? 'bg-red-50 text-red-500 border-red-100' : 'bg-blue-50 text-blue-500 border-blue-100'
                        }`}>
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{doc.name}</p>
                          {doc.rejectionReason && doc.status === 'rejected' && (
                             <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-wider">{doc.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-xs font-medium text-slate-400">
                      {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString('en-GB') : '-'}
                    </td>
                    <td className="px-8 py-5">
                       {getStatusBadge(doc.status)}
                    </td>
                    <td className="px-8 py-5 text-end">
                      <button className="bg-white border border-slate-200 text-slate-700 text-[10px] font-bold rounded-lg hover:bg-blue-50 hover:text-blue-600 shadow-sm uppercase tracking-wider px-3 py-1.5 transition-all">
                        <Download size={14} className="inline mr-1" /> {commonT.download}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="flex flex-col items-center gap-4 py-20 px-8 text-center text-slate-400">
                      <div className="p-5 bg-slate-50 rounded-full">
                         <File size={40} className="opacity-20" />
                      </div>
                      <p className="font-bold text-sm uppercase tracking-widest">{t.noDocs}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card List */}
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
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {doc.type} • {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString('en-GB') : '-'}
                      </p>
                    </div>
                  </div>
                  <button className="p-1.5 bg-white border border-slate-200 text-slate-500 rounded-lg">
                    <Download size={16} />
                  </button>
                </div>
                
                <div className="flex items-center justify-between">
                  {getStatusBadge(doc.status)}
                  {doc.rejectionReason && doc.status === 'rejected' && (
                    <span className="text-[9px] text-red-500 font-bold uppercase truncate max-w-[50%]">{doc.rejectionReason}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="py-20 text-center text-slate-400">
              <File size={40} className="mx-auto opacity-20 mb-4" />
              <p className="font-bold text-xs uppercase tracking-widest">{t.noDocs}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
