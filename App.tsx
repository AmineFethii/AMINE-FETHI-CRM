import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, doc, updateDoc, setDoc, query, where, getDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'firebase/auth';
import { db, auth } from './src/firebase';
import { Layout } from './components/Layout';
import { WhatsAppFab } from './components/WhatsAppFab';
import { Login } from './views/Login';
import { ClientPortal } from './views/ClientPortal';
import { ClientDocumentsView } from './views/ClientDocumentsView';
import { ClientSettingsView } from './views/ClientSettingsView';
import { ClientGuideView } from './views/ClientGuideView';
import { ClientTasksView } from './views/ClientTasksView';
import { ChatView } from './views/ChatView';
import { AdminDashboard } from './views/AdminDashboard';
import { FinanceDashboard } from './views/FinanceDashboard';
import { AdminDocumentsView } from './views/AdminDocumentsView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { AdminEmployeesView } from './views/AdminEmployeesView';
import { AdminClientsView } from './views/AdminClientsView';
import { AdminInvoicingView } from './views/AdminInvoicingView';
import { AdminInvoiceGeneratorView } from './views/AdminInvoiceGeneratorView';
import { AdminTutorialsView } from './views/AdminTutorialsView';
import { AdminClientAccessView } from './views/AdminClientAccessView';
import { AdminFollowUpView } from './views/AdminFollowUpView';
import { AdminCalendarView } from './views/AdminCalendarView';
import { User, ClientData, Role, Notification, Employee, ClientDocument, ClientTask } from './types';
import { ShieldCheck, Info, X, ChevronRight, User as UserIcon, Building2 } from 'lucide-react';

// ... (rest of the file)

// MOCK EVENTS FOR INITIAL STATE
const INITIAL_EVENTS = [
  { id: 'e1', title: 'Consultation - SARL Setup', type: 'meeting', time: '10:00', duration: '1h', client: 'MPL DIGITAL', date: 15 },
  { id: 'e2', title: 'Tax Filing Deadline', type: 'deadline', time: 'All Day', date: 20 },
  { id: 'e3', title: 'Follow-up Call', type: 'followup', time: '14:30', client: 'The Brain', date: 10 },
];

// COMPREHENSIVE RESTORED DATABASE
const INITIAL_CLIENTS: ClientData[] = [
  {
    id: 'c-demo',
    email: 'demo@newclient.com',
    name: 'New Entrepreneur',
    companyName: 'FUTURE VENTURES SARL',
    companyCategory: 'Consulting',
    serviceType: 'Company Creation',
    progress: 5,
    statusMessage: 'Awaiting Personal Info',
    timeline: [
      { id: 't1', label: 'Negative Certificate', status: 'in-progress' },
      { id: 't2', label: 'Legal Statutes', status: 'pending' },
      { id: 't3', label: 'RC Registration', status: 'pending' }
    ],
    clientTasks: [
      { id: 'task-new-1', title: 'Complete Business Profile', description: 'Essential for legal drafting', status: 'pending', priority: 'high', createdAt: new Date().toISOString() }
    ],
    documents: [],
    notifications: [],
    contractValue: 8000,
    amountPaid: 0,
    currency: 'MAD',
    paymentStatus: 'pending',
    missionStartDate: new Date().toISOString(),
    lastLogin: undefined,
    hasFilledProfile: false
  },
  {
    id: 'c1',
    email: 'contact@mpldigital.com',
    name: 'Amine El Amrani',
    companyName: 'MPL DIGITAL WORKS SARL',
    companyCategory: 'Digital Services',
    serviceType: 'Company Creation',
    progress: 100,
    statusMessage: 'Service Completed',
    timeline: [
      { id: 't1', label: 'Negative Certificate', status: 'completed' },
      { id: 't2', label: 'Legal Statutes', status: 'completed' },
      { id: 't3', label: 'RC Registration', status: 'completed' }
    ],
    clientTasks: [
      { id: 'task1', title: 'Upload Passport Copy', description: 'Mandatory for RC registration', status: 'completed', priority: 'high', createdAt: '2024-01-10' },
      { id: 'task2', title: 'Sign Lease Agreement', description: 'Required for domicile address verification', status: 'completed', priority: 'medium', createdAt: '2024-01-12' }
    ],
    documents: [
      { id: 'doc1', name: 'RC_Extraction.pdf', type: 'Legal', status: 'approved', uploadDate: '2024-01-15' },
      { id: 'doc2', name: 'Statutes_Final.pdf', type: 'Legal', status: 'approved', uploadDate: '2024-01-16' }
    ],
    notifications: [],
    contractValue: 12000,
    amountPaid: 12000,
    currency: 'MAD',
    paymentStatus: 'paid',
    missionStartDate: '2024-01-10',
    lastLogin: '2024-11-20T10:30:00Z',
    hasFilledProfile: true,
    phone: '+212 600-000001'
  },
  {
    id: 'c2',
    email: 'contact@thebrain.ma',
    name: 'Sarah Bennani',
    companyName: 'THE BRAIN SARL AU',
    companyCategory: 'IT Services',
    serviceType: 'Fiscal Advisory',
    progress: 40,
    statusMessage: 'Monthly VAT Declaration',
    timeline: [
      { id: 't1', label: 'Onboarding', status: 'completed' },
      { id: 't2', label: 'Monthly Declaration', status: 'in-progress' },
      { id: 't3', label: 'Year-End Audit', status: 'pending' }
    ],
    clientTasks: [
      { id: 'task-b1', title: 'Provide Purchase Invoices for Oct', description: 'Needed for VAT calculation', status: 'in-progress', priority: 'high', createdAt: '2024-11-01' }
    ],
    documents: [
      { id: 'd1', name: 'Purchase_Invoices_Oct.pdf', type: 'Financial', status: 'uploaded', uploadDate: '2024-11-05' }
    ],
    notifications: [],
    contractValue: 24000,
    amountPaid: 8000,
    currency: 'MAD',
    paymentStatus: 'partial',
    missionStartDate: '2024-03-15',
    lastLogin: '2024-11-21T15:45:00Z',
    hasFilledProfile: true,
    phone: '+212 600-000002'
  }
];

const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'e1',
    name: 'Yahya',
    role: 'Head of Sales',
    department: 'Sales',
    email: 'yahya@amineelfethi.com',
    phone: '+212 600-111222',
    status: 'active',
    joinDate: '2023-01-15',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

const INITIAL_AUTH_DB: Record<string, string> = {
  'demo@newclient.com': 'welcome2025',
  'contact@mpldigital.com': 'mpl2024',
  'contact@thebrain.ma': 'brain2024',
  'amine@admin.com': 'admin2024'
};

const ADMIN_USER: User = {
  id: 'admin1',
  name: 'Amine El Fethi',
  email: 'amine@admin.com',
  role: 'admin'
};

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId: string | undefined;
    email: string | null | undefined;
    emailVerified: boolean | undefined;
    isAnonymous: boolean | undefined;
    tenantId: string | null | undefined;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedClientIdForFollowUp, setSelectedClientIdForFollowUp] = useState<string | null>(null);
  
  const [clients, setClients] = useState<ClientData[]>([]);
  
  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.history.pushState({}, '', '/' + view);
  };

  useEffect(() => {
    const path = window.location.pathname.substring(1);
    if (path) {
      setCurrentView(path);
    } else {
      setCurrentView('dashboard');
    }
  }, []);
  
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('crm_employees_v2');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [authCredentials, setAuthCredentials] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('crm_auth_v2');
    return saved ? JSON.parse(saved) : INITIAL_AUTH_DB;
  });

  const [adminNotifications, setAdminNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('crm_admin_notifications_v2');
    return saved ? JSON.parse(saved) : [];
  });

  const [calendarEvents, setCalendarEvents] = useState<any[]>(() => {
    const saved = localStorage.getItem('crm_calendar_events');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });
  
  useEffect(() => {
    if (!user) return;
    
    let q;
    if (user.role === 'admin') {
      q = collection(db, 'clients');
    } else {
      q = query(collection(db, 'clients'), where('email', '==', user.email));
    }
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const clientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ClientData[];
      
      setClients(clientsData);
    }, (error) => {
      console.error("Firestore Error: ", error);
    });
    return () => unsubscribe();
  }, [user]);

  useEffect(() => {
    localStorage.setItem('crm_employees_v2', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('crm_auth_v2', JSON.stringify(authCredentials));
  }, [authCredentials]);

  useEffect(() => {
    localStorage.setItem('crm_admin_notifications_v2', JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  useEffect(() => {
    localStorage.setItem('crm_calendar_events', JSON.stringify(calendarEvents));
  }, [calendarEvents]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser);
      if (firebaseUser) {
        // Fetch user role from Firestore
        // For now, let's assume we can fetch it from a 'users' collection
        // This is a simplification and might need adjustment based on your actual data model
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data() as User;
          setUser(userData);
        } else {
          // Fallback if user document doesn't exist
          setUser({
            id: firebaseUser.uid,
            name: firebaseUser.displayName || 'User',
            email: firebaseUser.email || '',
            role: 'client' // Default role
          });
        }
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async (email: string, pass: string, role: Role): Promise<boolean> => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const handleLogout = () => {
    setUser(null);
    handleNavigate('dashboard');
    setShowWelcomeModal(false);
  };

  const handleAddEmployee = (newEmployee: Employee) => setEmployees(prev => [...prev, newEmployee]);
  const handleAddClient = async (newClient: ClientData) => {
    try {
      await setDoc(doc(db, 'clients', newClient.id), newClient);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'clients');
    }
  };
  const handleUpdateCredentials = (email: string, pass: string) => setAuthCredentials(prev => ({ ...prev, [email.toLowerCase()]: pass }));

  const updateClient = async (clientId: string, updates: Partial<ClientData>) => {
    const c = clients.find(c => c.id === clientId);
    if (!c) return;

    const newNotifications: Notification[] = [...c.notifications];
    const now = new Date().toISOString();
    
    if (updates.statusMessage && updates.statusMessage !== c.statusMessage) {
      newNotifications.unshift({ id: `n-${Date.now()}-status`, title: 'Status Update', message: `New status: ${updates.statusMessage}`, date: now, read: false, type: 'info' });
    } else if (updates.progress !== undefined && updates.progress !== c.progress) {
      newNotifications.unshift({ id: `n-${Date.now()}-progress`, title: 'Progress Update', message: `Your service progress is now at ${updates.progress}%.`, date: now, read: false, type: 'info' });
    }

    if (updates.documents) {
      updates.documents.forEach(newDoc => {
        const oldDoc = c.documents.find(d => d.id === newDoc.id);
        if (oldDoc && oldDoc.status !== 'approved' && newDoc.status === 'approved') {
          newNotifications.unshift({ id: `n-${Date.now()}-${newDoc.id}`, title: 'Document Approved', message: `Your document "${newDoc.name}" has been reviewed and approved.`, date: now, read: false, type: 'success' });
        }
        if (oldDoc && oldDoc.status !== 'rejected' && newDoc.status === 'rejected') {
           const reasonText = newDoc.rejectionReason ? ` Reason: ${newDoc.rejectionReason}` : '';
           newNotifications.unshift({ id: `n-${Date.now()}-${newDoc.id}-rej`, title: 'Document Rejected', message: `Issue with "${newDoc.name}".${reasonText} Please check and re-upload.`, date: now, read: false, type: 'alert' });
        }
      });
    }

    if (updates.amountPaid !== undefined && updates.amountPaid > c.amountPaid) {
      const diff = updates.amountPaid - c.amountPaid;
      newNotifications.unshift({ id: `n-${Date.now()}-payment`, title: 'Payment Received', message: `A payment of ${diff.toLocaleString()} ${c.currency} has been recorded.`, date: now, read: false, type: 'success' });
    }

    if (updates.clientTasks) {
       updates.clientTasks.forEach(task => {
          const oldTask = c.clientTasks?.find(ot => ot.id === task.id);
          if (oldTask && oldTask.status !== 'completed' && task.status === 'completed') {
             const adminNotif: Notification = {
               id: `admin-task-${Date.now()}`,
               title: 'Client Action Completed',
               message: `${c.companyName} completed task: "${task.title}"`,
               date: now,
               read: false,
               type: 'success'
             };
             setAdminNotifications(prev => [adminNotif, ...prev]);
          }
       });
    }

    const finalUpdates = { ...updates, notifications: newNotifications };

    try {
      await updateDoc(doc(db, 'clients', clientId), finalUpdates);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `clients/${clientId}`);
    }

    if (user && user.id === clientId && user.role === 'client') {
      setUser(prev => prev ? ({
        ...prev,
        name: updates.name || prev.name,
        avatarUrl: updates.avatarUrl || prev.avatarUrl
      }) : null);
    }
  };

  const handleUpdateClientTask = (clientId: string, taskId: string, status: ClientTask['status']) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const updatedTasks = client.clientTasks.map(t => t.id === taskId ? { ...t, status } : t);
    updateClient(clientId, { clientTasks: updatedTasks });
  };

  const handleAddClientTask = (clientId: string, task: Omit<ClientTask, 'id' | 'createdAt'>) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const newTask: ClientTask = {
      ...task,
      id: `client-task-${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    updateClient(clientId, { clientTasks: [...client.clientTasks, newTask] });
  };

  const handleDeleteClientTask = (clientId: string, taskId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    updateClient(clientId, { clientTasks: client.clientTasks.filter(t => t.id !== taskId) });
  };

  const handlePushClientUpdate = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const adminNotif: Notification = {
      id: `push-${Date.now()}`,
      title: 'Manual Checklist Update',
      message: `${client.companyName} has just synced their action items and requested a review.`,
      date: new Date().toISOString(),
      read: false,
      type: 'success'
    };
    setAdminNotifications(prev => [adminNotif, ...prev]);
  };

  const handleDocumentUpload = (clientId: string, fileName: string, category: string, base64?: string) => {
    const client = clients.find(c => c.id === clientId);
    if (!client) return;
    const newDoc: ClientDocument = {
      id: `doc-${Date.now()}`,
      name: fileName,
      type: category,
      status: 'uploaded',
      uploadDate: new Date().toISOString()
    };
    updateClient(clientId, { documents: [...client.documents, newDoc] });
    const adminNotif: Notification = {
      id: `admin-n-${Date.now()}`,
      title: 'New Document Uploaded',
      message: `${client.companyName} uploaded "${fileName}" to ${category} section.`,
      date: new Date().toISOString(),
      read: false,
      type: 'info'
    };
    setAdminNotifications(prev => [adminNotif, ...prev]);
  };

  const handleNewChatMessage = async (senderId: string, recipientId: string, text: string) => {
    const now = new Date().toISOString();
    const notification: Notification = {
      id: `chat-notif-${Date.now()}`,
      title: 'New Chat Message',
      message: text.length > 50 ? `${text.substring(0, 50)}...` : text,
      date: now,
      read: false,
      type: 'info'
    };

    if (user?.role === 'admin') {
      const client = clients.find(c => c.id === recipientId);
      if (client) {
        try {
          await updateDoc(doc(db, 'clients', recipientId), { notifications: [notification, ...client.notifications] });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `clients/${recipientId}`);
        }
      }
    } else {
      const clientName = clients.find(c => c.id === senderId)?.companyName || 'A client';
      const adminNotif = { ...notification, title: `Message from ${clientName}` };
      setAdminNotifications(prev => [adminNotif, ...prev]);
    }
  };

  const handleMarkNotificationAsRead = async (notificationId: string) => {
    if (!user) return;
    if (user.role === 'admin') {
      setAdminNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    } else {
      const client = clients.find(c => c.email === user.email);
      if (client) {
        const updatedNotifications = client.notifications.map(n => n.id === notificationId ? { ...n, read: true } : n);
        try {
          await updateDoc(doc(db, 'clients', client.id), { notifications: updatedNotifications });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `clients/${client.id}`);
        }
      }
    }
  };

  const handleMarkAllNotificationsAsRead = async () => {
    if (!user) return;
    if (user.role === 'admin') {
      setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } else {
      const client = clients.find(c => c.email === user.email);
      if (client) {
        const updatedNotifications = client.notifications.map(n => ({ ...n, read: true }));
        try {
          await updateDoc(doc(db, 'clients', client.id), { notifications: updatedNotifications });
        } catch (error) {
          handleFirestoreError(error, OperationType.UPDATE, `clients/${client.id}`);
        }
      }
    }
  };

  const getCurrentClientData = () => clients.find(c => c.email === user?.email);
  const currentUserNotifications = user?.role === 'admin' ? adminNotifications : getCurrentClientData()?.notifications || [];

  const renderContent = () => {
    if (user?.role === 'admin') {
      if (currentView === 'follow-up') return <AdminFollowUpView clients={clients} onUpdateClient={updateClient} lang="en" initialClientId={selectedClientIdForFollowUp} />;
      if (currentView === 'calendar') return <AdminCalendarView clients={clients} events={calendarEvents} onUpdateEvents={setCalendarEvents} />;
      if (currentView === 'finance') return <FinanceDashboard clients={clients} onUpdateClient={updateClient} />;
      if (currentView === 'documents') return <AdminDocumentsView clients={clients} onUpdateClient={updateClient} />;
      if (currentView === 'clients') return <AdminClientsView clients={clients} onManageClient={(clientId) => { setSelectedClientIdForFollowUp(clientId); handleNavigate('follow-up'); }} onUpdateClient={updateClient} />;
      if (currentView === 'team') return <AdminEmployeesView employees={employees} onAddEmployee={handleAddEmployee} />;
      if (currentView === 'settings') return <AdminSettingsView user={user} />;
      if (currentView === 'invoicing-hub') return <AdminInvoicingView clients={clients} lang="en" />;
      if (currentView === 'invoicing-generator') return <AdminInvoiceGeneratorView clients={clients} lang="en" />;
      if (currentView === 'tutorials') return <AdminTutorialsView lang="en" />;
      if (currentView === 'chat') return <ChatView lang="en" user={user} clients={clients} onNotify={handleNewChatMessage} />;
      if (currentView === 'client-access') return <AdminClientAccessView clients={clients} lang="en" onAddClient={handleAddClient} onUpdateCredentials={handleUpdateCredentials} authCredentials={authCredentials} />;
      return <AdminDashboard clients={clients} onUpdateClient={updateClient} user={user} onNavigate={handleNavigate} />;
    } else {
      const clientData = getCurrentClientData();
      if (!clientData) return <div>Error loading client data</div>;
      if (currentView === 'documents') return <ClientDocumentsView client={clientData} onUpload={handleDocumentUpload} />;
      if (currentView === 'settings') return <ClientSettingsView client={clientData} onUpdateProfile={(u) => updateClient(clientData.id, u)} />;
      if (currentView === 'chat') return <ChatView lang="en" user={user} clients={clients} onNotify={handleNewChatMessage} />;
      if (currentView === 'guide') return <ClientGuideView onNavigate={(view) => handleNavigate(view)} />;
      if (currentView === 'tutorials') return <AdminTutorialsView lang="en" />;
      if (currentView === 'tasks') return (
        <ClientTasksView 
          client={clientData} 
          onUpdateTask={(tid, stat) => handleUpdateClientTask(clientData.id, tid, stat)} 
          onAddTask={(task) => handleAddClientTask(clientData.id, task)}
          onDeleteTask={(tid) => handleDeleteClientTask(clientData.id, tid)}
          onPushUpdate={(cid) => handlePushClientUpdate(cid)}
          onNavigate={handleNavigate} 
        />
      );
      return <ClientPortal client={clientData} onNavigateToDocs={() => handleNavigate('documents')} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {user ? (
        <Layout 
          user={user} 
          onLogout={handleLogout}
          notifications={currentUserNotifications}
          onMarkAsRead={handleMarkNotificationAsRead}
          onMarkAllAsRead={handleMarkAllNotificationsAsRead}
          onOpenProfile={() => handleNavigate('settings')}
          activeView={currentView}
          onNavigate={(view) => handleNavigate(view)}
          clients={clients}
        >
          {renderContent()}
        </Layout>
      ) : (
        <Login onLogin={handleLogin} />
      )}
      
      {showWelcomeModal && user?.role === 'client' && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setShowWelcomeModal(false)}></div>
           <div className="relative bg-white rounded-[32px] shadow-2xl w-full max-w-xl overflow-hidden animate-scale-up">
              <div className="absolute top-0 right-0 p-6">
                <button onClick={() => setShowWelcomeModal(false)} className="text-slate-300 hover:text-slate-900 transition-colors p-2 hover:bg-slate-100 rounded-full">
                   <X size={20} />
                </button>
              </div>
              <div className="p-10 pt-14 text-center">
                 <div className="relative inline-block mb-8">
                    <div className="absolute inset-0 bg-blue-100 rounded-3xl rotate-6 scale-110"></div>
                    <div className="relative bg-blue-600 p-6 rounded-3xl shadow-xl shadow-blue-600/20">
                       <ShieldCheck size={48} className="text-white" />
                    </div>
                 </div>
                 <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Action Required</h2>
                 <p className="text-slate-500 text-lg leading-relaxed mb-10">
                   To ensure optimal follow-up and legal accuracy for your mission, please complete your <span className="font-bold text-slate-900">Personal & Business Info</span> in the settings level.
                 </p>
                 <button 
                   onClick={() => { setShowWelcomeModal(false); setCurrentView('settings'); }}
                   className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-2xl shadow-slate-900/20 group active:scale-95"
                 >
                    Start Filling Profile
                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                 </button>
                 <button onClick={() => setShowWelcomeModal(false)} className="mt-6 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Remind me later</button>
              </div>
           </div>
        </div>
      )}
      {user?.role === 'client' && <WhatsAppFab />}
    </div>
  );
};

export default App;
