
import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Search, 
  Filter, 
  Download, 
  Eye,
  Clock,
  FileCheck,
  Plus,
  UploadCloud,
  X,
  File,
  Image as ImageIcon,
  Shield,
  Briefcase,
  MoreVertical,
  ChevronRight,
  User
} from 'lucide-react';
import { ClientData, ClientDocument } from '../types';
import { translations, Language } from '../translations';

interface AdminDocumentsViewProps {
  clients: ClientData[];
  onUpdateClient: (clientId: string, updates: Partial<ClientData>) => void;
  lang: Language;
}

type DocStatusFilter = 'pending' | 'approved' | 'rejected' | 'all';

export const AdminDocumentsView: React.FC<AdminDocumentsViewProps> = ({ clients, onUpdateClient, lang }) => {
  const [statusFilter, setStatusFilter] = useState<DocStatusFilter>('pending');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals State
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<{ doc: ClientDocument, client: ClientData } | null>(null);
  
  // Upload Form State
  const [uploadClientId, setUploadClientId] = useState('');
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadDocType, setUploadDocType] = useState('Legal');
  
  // Rejection State
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const t = translations[lang].documents;
  const commonT = translations[lang].common;
  const isRTL = lang === 'ar';

  // Flatten all documents
  const allDocuments = clients.flatMap(client => 
    client.documents.map(doc => ({
      ...doc,
      clientId: client.id,
      clientName: client.name,
      companyName: client.companyName,
      avatarUrl: client.avatarUrl,
      clientData: client // Keep ref to full client for actions
    }))
  );

  const filteredDocs = allDocuments.filter(doc => {
    // Status Filter
    const matchesStatus = statusFilter === 'all' 
      ? true 
      : statusFilter === 'pending' 
        ? doc.status === 'uploaded' 
        : doc.status === statusFilter;

    // Type Filter
    const matchesType = typeFilter === 'all' || doc.type === typeFilter;

    // Search Filter
    const matchesSearch = 
      doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      doc.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesType && matchesSearch;
  });

  // --- Actions ---

  const handleApprove = (clientId: string, docId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const updatedDocs = client.documents.map(d => 
      d.id === docId ? { ...d, status: 'approved' as const, rejectionReason: undefined } : d
    );
    onUpdateClient(clientId, { documents: updatedDocs });
    if (previewDoc && previewDoc.doc.id === docId) {
      setPreviewDoc(null);
    }
  };

  const handleReject = (clientId: string, docId: string) => {
    if (!rejectionReason.trim()) return;

    const client = clients.find(c => c.id === clientId);
    if (!client) return;

    const updatedDocs = client.documents.map(d => 
      d.id === docId ? { ...d, status: 'rejected' as const, rejectionReason } : d
    );
    onUpdateClient(clientId, { documents: updatedDocs });
    
    setRejectingId(null);
    setRejectionReason('');
    if (previewDoc && previewDoc.doc.id === docId) {
      setPreviewDoc(null);
    }
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadClientId || !uploadFile) return;

    const client = clients.find(c => c.id === uploadClientId);
    if (!client) return;

    const newDoc: ClientDocument = {
      id: `admin-up-${Date.now()}`,
      name: uploadFile.name,
      type: uploadDocType,
      status: 'approved', // Admin uploads are auto-approved
      uploadDate: new Date().toISOString()
    };

    onUpdateClient(uploadClientId, { 
      documents: [...client.documents, newDoc] 
    });

    // Reset and close
    setIsUploadModalOpen(false);
    setUploadClientId('');
    setUploadFile(null);
    setUploadDocType('Legal');
  };

  const getFileIcon = (fileName: string, type: string) => {
    if (type === 'Identity') return <Shield size={18} />;
    if (fileName.endsWith('.pdf')) return <FileText size={18} />;
    if (fileName.match(/\.(jpg|jpeg|png)$/i)) return <ImageIcon size={18} />;
    return <File size={18} />;
  };

  const uniqueTypes = Array.from(new Set(allDocuments.map(d => d.type)));

  return (
    <div className="space-y-6 animate-fade-in relative">
      
      {/* --- Header Section --- */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">{t.title}</h1>
          <p className="text-slate-500 mt-1">{t.subtitle}</p>
        </div>
        
        <div className="flex gap-3">
           <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
            {(['pending', 'all', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-all capitalize ${
                  statusFilter === tab 
                    ? 'bg-slate-900 text-white shadow-md' 
                    : 'text-slate-500 hover:bg-slate-100'
                }`}
              >
                {tab === 'pending' ? t.pendingReview : commonT[tab]}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setIsUploadModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium shadow-sm transition-colors"
          >
            <Plus size={18} />
            <span className="hidden sm:inline">{t.uploadNew}</span>
          </button>
        </div>
      </div>

      {/* --- Stats Cards --- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">{t.pendingReview}</p>
            <p className="text-xl font-bold text-slate-900">
              {allDocuments.filter(d => d.status === 'uploaded').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-green-50 text-green-600 rounded-lg">
            <FileCheck size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">{t.approvedTotal}</p>
            <p className="text-xl font-bold text-slate-900">
              {allDocuments.filter(d => d.status === 'approved').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-red-50 text-red-600 rounded-lg">
            <XCircle size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">Rejected</p>
            <p className="text-xl font-bold text-slate-900">
              {allDocuments.filter(d => d.status === 'rejected').length}
            </p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-slate-50 text-slate-600 rounded-lg">
            <FileText size={24} />
          </div>
          <div>
            <p className="text-xs text-slate-400 font-bold uppercase">{t.totalDocs}</p>
            <p className="text-xl font-bold text-slate-900">{allDocuments.length}</p>
          </div>
        </div>
      </div>

      {/* --- Main Table --- */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-50/50">
          <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-2 sm:pb-0">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-lg">
               <Filter size={14} className="text-slate-400" />
               <select 
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                  className="bg-transparent text-sm text-slate-600 font-medium focus:outline-none cursor-pointer"
               >
                 <option value="all">All Types</option>
                 {uniqueTypes.map(type => <option key={type} value={type}>{type}</option>)}
               </select>
             </div>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isRTL ? 'right-3' : 'left-3'}`} size={16} />
            <input 
              type="text" 
              placeholder={commonT.search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm ${isRTL ? 'pr-9 pl-4' : 'pl-9 pr-4'}`}
            />
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-semibold border-b border-slate-100">
              <tr>
                <th className="px-6 py-4 text-start font-bold">{translations[lang].adminDashboard.clientList}</th>
                <th className="px-6 py-4 text-start font-bold">{t.docName}</th>
                <th className="px-6 py-4 text-start font-bold">{t.category}</th>
                <th className="px-6 py-4 text-start font-bold">{commonT.date}</th>
                <th className="px-6 py-4 text-start font-bold">{commonT.status}</th>
                <th className="px-6 py-4 text-end font-bold">{commonT.actions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.length > 0 ? (
                filteredDocs.map((doc) => (
                  <tr 
                    key={`${doc.clientId}-${doc.id}`} 
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => setPreviewDoc({ doc, client: doc.clientData })}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm text-slate-500 font-bold text-xs">
                           {doc.avatarUrl ? <img src={doc.avatarUrl} className="w-full h-full object-cover" /> : doc.clientName.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900 truncate max-w-[150px]">{doc.companyName}</p>
                          <p className="text-xs text-slate-500 truncate max-w-[150px]">{doc.clientName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          doc.name.endsWith('.pdf') ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {getFileIcon(doc.name, doc.type)}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900 max-w-[180px] truncate" title={doc.name}>
                            {doc.name}
                          </p>
                          {/* Inline Rejection Form */}
                          {rejectingId === doc.id && (
                            <div className="mt-2 animate-fade-in" onClick={e => e.stopPropagation()}>
                              <input 
                                type="text" 
                                placeholder={translations[lang].adminDashboard.reason}
                                value={rejectionReason}
                                onChange={(e) => setRejectionReason(e.target.value)}
                                className="w-full text-xs p-2 border border-red-300 rounded bg-white text-slate-900 mb-2 focus:outline-none focus:ring-1 focus:ring-red-500 shadow-sm"
                                autoFocus
                              />
                              <div className="flex gap-2">
                                <button 
                                  onClick={() => handleReject(doc.clientId, doc.id)}
                                  className="text-xs bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700 shadow-sm"
                                >
                                  {t.confirmReject}
                                </button>
                                <button 
                                  onClick={() => { setRejectingId(null); setRejectionReason(''); }}
                                  className="text-xs bg-white border border-slate-200 text-slate-600 px-2 py-1 rounded hover:bg-slate-50"
                                >
                                  {t.cancelReject}
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {doc.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-500 font-medium">
                      {doc.uploadDate ? new Date(doc.uploadDate).toLocaleDateString() : '-'}
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                         doc.status === 'approved' ? 'bg-green-50 text-green-700 border-green-200' :
                         doc.status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                         doc.status === 'uploaded' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                         'bg-slate-100 text-slate-600 border-slate-200'
                       }`}>
                         {doc.status === 'approved' && <CheckCircle size={12} />}
                         {doc.status === 'rejected' && <XCircle size={12} />}
                         {doc.status === 'uploaded' && <Clock size={12} />}
                         <span className="capitalize">
                           {doc.status === 'uploaded' ? commonT.pending : commonT[doc.status] || doc.status}
                         </span>
                       </span>
                    </td>
                    <td className="px-6 py-4 text-end">
                      <div className="flex items-center justify-end gap-1" onClick={e => e.stopPropagation()}>
                        {doc.status === 'uploaded' && !rejectingId && (
                          <>
                            <button 
                              onClick={() => handleApprove(doc.clientId, doc.id)}
                              className="p-1.5 rounded-lg text-green-600 hover:bg-green-100 transition-colors"
                              title="Approve"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => setRejectingId(doc.id)}
                              className="p-1.5 rounded-lg text-red-600 hover:bg-red-100 transition-colors"
                              title="Reject"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button 
                           onClick={() => setPreviewDoc({ doc, client: doc.clientData })}
                           className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-colors"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-slate-400">
                    <div className="flex flex-col items-center gap-3">
                       <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center">
                          <Filter size={24} className="opacity-20" />
                       </div>
                       <p className="font-medium">{t.noDocs}</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- Upload Modal --- */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsUploadModalOpen(false)}></div>
           <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-scale-up">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                 <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <UploadCloud className="text-blue-600" size={20} />
                    {t.uploadNew}
                 </h3>
                 <button onClick={() => setIsUploadModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                    <X size={20} />
                 </button>
              </div>
              
              <form onSubmit={handleUploadSubmit} className="p-6 space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{translations[lang].adminDashboard.clientList}</label>
                    <select 
                       required
                       value={uploadClientId}
                       onChange={(e) => setUploadClientId(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                       <option value="">Select a Client...</option>
                       {clients.map(c => (
                          <option key={c.id} value={c.id}>{c.companyName} ({c.name})</option>
                       ))}
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">{t.category}</label>
                    <select 
                       value={uploadDocType}
                       onChange={(e) => setUploadDocType(e.target.value)}
                       className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                       <option value="Legal">Legal</option>
                       <option value="Financial">Financial</option>
                       <option value="Identity">Identity</option>
                       <option value="Contract">Contract</option>
                       <option value="Other">Other</option>
                    </select>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">File</label>
                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                       <input 
                          type="file" 
                          required
                          onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                       />
                       <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                          {uploadFile ? <FileText size={24} /> : <UploadCloud size={24} />}
                       </div>
                       {uploadFile ? (
                          <div>
                             <p className="text-sm font-bold text-slate-900">{uploadFile.name}</p>
                             <p className="text-xs text-slate-500">{(uploadFile.size / 1024).toFixed(1)} KB</p>
                          </div>
                       ) : (
                          <div>
                             <p className="text-sm font-medium text-slate-900">Click to browse</p>
                             <p className="text-xs text-slate-400 mt-1">PDF, PNG, JPG up to 10MB</p>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="pt-4 flex justify-end gap-3">
                    <button 
                       type="button"
                       onClick={() => setIsUploadModalOpen(false)}
                       className="px-4 py-2 bg-white border border-slate-200 text-slate-700 text-sm font-medium rounded-lg hover:bg-slate-50"
                    >
                       {commonT.cancel}
                    </button>
                    <button 
                       type="submit"
                       disabled={!uploadClientId || !uploadFile}
                       className="px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                       <UploadCloud size={16} />
                       {commonT.upload}
                    </button>
                 </div>
              </form>
           </div>
        </div>
      )}

      {/* --- Preview Modal --- */}
      {previewDoc && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setPreviewDoc(null)}></div>
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl h-[85vh] flex flex-col overflow-hidden animate-scale-up">
               
               {/* Modal Header */}
               <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-white border border-slate-200 rounded-lg text-blue-600">
                        {getFileIcon(previewDoc.doc.name, previewDoc.doc.type)}
                     </div>
                     <div>
                        <h3 className="font-bold text-slate-900">{previewDoc.doc.name}</h3>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                           <User size={12} />
                           <span>{previewDoc.client.companyName}</span>
                           <span>•</span>
                           <span>{previewDoc.doc.type}</span>
                        </div>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Download">
                        <Download size={20} />
                     </button>
                     <div className="h-6 w-px bg-slate-200 mx-1"></div>
                     <button onClick={() => setPreviewDoc(null)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={20} />
                     </button>
                  </div>
               </div>

               <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                  
                  {/* Left: Preview Area */}
                  <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-8 overflow-y-auto">
                     {/* Placeholder for actual file preview */}
                     <div className="bg-white shadow-xl rounded-lg w-full max-w-xl aspect-[1/1.4] flex flex-col items-center justify-center border border-slate-200 p-8 text-center">
                        <div className="w-20 h-20 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center mb-4">
                           <FileText size={40} />
                        </div>
                        <h4 className="text-lg font-bold text-slate-700 mb-2">Document Preview</h4>
                        <p className="text-sm text-slate-500 max-w-xs">
                           This is a secure preview placeholder. In a real application, the file content would be rendered here.
                        </p>
                        <div className="mt-8 p-4 bg-slate-50 rounded-lg border border-slate-100 w-full text-left">
                           <p className="text-xs font-bold text-slate-400 uppercase mb-2">File Metadata</p>
                           <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                 <span className="text-slate-500 block">Uploaded</span>
                                 <span className="font-medium text-slate-900">{new Date(previewDoc.doc.uploadDate || '').toLocaleDateString()}</span>
                              </div>
                              <div>
                                 <span className="text-slate-500 block">Size</span>
                                 <span className="font-medium text-slate-900">2.4 MB</span>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>

                  {/* Right: Sidebar Info */}
                  <div className="w-full md:w-80 bg-white border-l border-slate-200 p-6 flex flex-col">
                     <div className="mb-6">
                        <h4 className="text-sm font-bold text-slate-900 mb-4">Status & Actions</h4>
                        
                        <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100 mb-6">
                           <span className="text-sm text-slate-600 font-medium">Current Status</span>
                           <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold capitalize ${
                              previewDoc.doc.status === 'approved' ? 'bg-green-100 text-green-700' :
                              previewDoc.doc.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-amber-100 text-amber-700'
                           }`}>
                              {previewDoc.doc.status === 'uploaded' ? 'Pending' : previewDoc.doc.status}
                           </span>
                        </div>

                        {previewDoc.doc.status === 'uploaded' && (
                           <div className="space-y-3">
                              <button 
                                 onClick={() => handleApprove(previewDoc.client.id, previewDoc.doc.id)}
                                 className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium shadow-sm transition-colors flex items-center justify-center gap-2"
                              >
                                 <CheckCircle size={16} /> Approve Document
                              </button>
                              
                              <div className="relative">
                                 <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-200"></div>
                                 </div>
                                 <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-slate-400">Or</span>
                                 </div>
                              </div>

                              <div>
                                 <label className="block text-xs font-bold text-slate-500 mb-1.5">Rejection Reason</label>
                                 <textarea 
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    className="w-full p-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-500 min-h-[80px] resize-none"
                                    placeholder="Enter reason for rejection..."
                                 ></textarea>
                                 <button 
                                    onClick={() => handleReject(previewDoc.client.id, previewDoc.doc.id)}
                                    disabled={!rejectionReason.trim()}
                                    className="w-full mt-2 py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                 >
                                    Reject Document
                                 </button>
                              </div>
                           </div>
                        )}
                        
                        {previewDoc.doc.status !== 'uploaded' && (
                           <div className="text-center p-4 bg-slate-50 rounded-lg border border-slate-100">
                              <p className="text-sm text-slate-500">
                                 This document was {previewDoc.doc.status} on {new Date().toLocaleDateString()}.
                              </p>
                              {previewDoc.doc.rejectionReason && (
                                 <p className="text-xs text-red-500 mt-2 font-medium bg-red-50 p-2 rounded">
                                    Reason: {previewDoc.doc.rejectionReason}
                                 </p>
                              )}
                           </div>
                        )}
                     </div>

                     <div className="mt-auto">
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Client Details</h4>
                        <div className="flex items-center gap-3 mb-4">
                           <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center overflow-hidden">
                              {previewDoc.client.avatarUrl ? <img src={previewDoc.client.avatarUrl} className="w-full h-full object-cover" /> : <User size={18} className="text-slate-400" />}
                           </div>
                           <div>
                              <p className="text-sm font-bold text-slate-900">{previewDoc.client.companyName}</p>
                              <p className="text-xs text-slate-500">{previewDoc.client.name}</p>
                           </div>
                        </div>
                        <div className="flex gap-2">
                           <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs font-bold rounded">{previewDoc.client.companyCategory}</span>
                           <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded">{previewDoc.client.serviceType}</span>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      )}

    </div>
  );
};
