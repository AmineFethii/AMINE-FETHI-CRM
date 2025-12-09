
import React, { useState } from 'react';
import { 
  FileText, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download, 
  Filter, 
  Search,
  File,
  Image as ImageIcon,
  Shield
} from 'lucide-react';
import { ClientData, ClientDocument } from '../types';
import { translations } from '../translations';

interface ClientDocumentsViewProps {
  client: ClientData;
  onUpload: (fileName: string) => void;
}

export const ClientDocumentsView: React.FC<ClientDocumentsViewProps> = ({ client, onUpload }) => {
  const [filter, setFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const t = translations.en.documents;
  const commonT = translations.en.common;

  const categories = ['All', 'Identity', 'Legal', 'Financial', 'Other'];

  const filteredDocs = client.documents.filter(doc => {
    const matchesFilter = filter === 'All' || doc.type === filter;
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      onUpload(files[0].name);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleClickUpload = () => {
    const mockFiles = ["Lease_Agreement.pdf", "Passport_Copy.jpg", "Bank_Statement.pdf", "Tax_Return_2023.pdf"];
    const randomFile = mockFiles[Math.floor(Math.random() * mockFiles.length)];
    onUpload(randomFile);
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'identity': return <Shield size={20} />;
      case 'image': return <ImageIcon size={20} />;
      default: return <FileText size={20} />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
        <p className="text-slate-500 mt-1">{t.subtitle}</p>
      </div>

      {/* Upload Area */}
      <div 
        className="bg-white border-2 border-dashed border-blue-200 rounded-xl p-10 flex flex-col items-center justify-center text-center hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer group shadow-sm"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={handleClickUpload}
      >
        <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-inner">
          <UploadCloud size={32} />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">{t.uploadNew}</h3>
        <p className="text-slate-500 mt-2 max-w-md mx-auto">
          {t.dragDrop} <span className="text-blue-600 font-medium underline decoration-blue-300 underline-offset-2">{t.browse}</span>.
        </p>
        <p className="text-xs text-slate-400 mt-4">{t.supportedFormats}</p>
      </div>

      {/* Document Library */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50">
          
          {/* Categories */}
          <div className="flex items-center bg-slate-200/50 p-1 rounded-lg overflow-x-auto max-w-full">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap ${
                  filter === cat 
                    ? 'bg-white text-slate-900 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                }`}
              >
                {cat === 'All' ? commonT.all : cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <Search className="absolute top-1/2 -translate-y-1/2 text-slate-400 left-3" size={16} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow pl-9 pr-4 placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* File List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold">
              <tr>
                <th className="px-6 py-4 text-start">{t.docName}</th>
                <th className="px-6 py-4 text-start">{t.category}</th>
                <th className="px-6 py-4 text-start">{commonT.date}</th>
                <th className="px-6 py-4 text-start">{commonT.status}</th>
                <th className="px-6 py-4 text-end">{commonT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-lg ${
                          doc.name.endsWith('.pdf') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {getFileIcon(doc.type)}
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{doc.name}</p>
                          {doc.rejectionReason && doc.status === 'rejected' && (
                             <p className="text-xs text-red-500 font-medium mt-0.5">{doc.rejectionReason}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500">
                      {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                       <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                         doc.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                         doc.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                         doc.status === 'uploaded' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                         'bg-slate-100 text-slate-600 border-slate-200'
                       }`}>
                         {doc.status === 'approved' && <CheckCircle size={12} />}
                         {doc.status === 'rejected' && <AlertCircle size={12} />}
                         {doc.status === 'uploaded' && <Clock size={12} />}
                         <span className="capitalize">{
                           doc.status === 'uploaded' ? commonT.pending : 
                           doc.status === 'approved' ? commonT.approved :
                           doc.status === 'rejected' ? commonT.rejected : doc.status
                         }</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <button className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-full transition-colors">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-2">
                      <File size={32} className="opacity-20" />
                      <p>{t.noDocs}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
