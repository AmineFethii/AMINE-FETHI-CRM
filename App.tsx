
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { WhatsAppFab } from './components/WhatsAppFab';
import { Login } from './views/Login';
import { ClientPortal } from './views/ClientPortal';
import { ClientDocumentsView } from './views/ClientDocumentsView';
import { ClientSettingsView } from './views/ClientSettingsView';
import { ClientGuideView } from './views/ClientGuideView';
import { ChatView } from './views/ChatView';
import { AdminDashboard } from './views/AdminDashboard';
import { FinanceDashboard } from './views/FinanceDashboard';
import { AdminDocumentsView } from './views/AdminDocumentsView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { AdminEmployeesView } from './views/AdminEmployeesView';
import { AdminClientsView } from './views/AdminClientsView';
import { AdminInvoicingView } from './views/AdminInvoicingView';
import { AdminTutorialsView } from './views/AdminTutorialsView';
import { AdminClientAccessView } from './views/AdminClientAccessView';
import { AdminFollowUpView } from './views/AdminFollowUpView';
import { AdminCalendarView } from './views/AdminCalendarView';
import { User, ClientData, Role, Notification, Employee } from './types';

// COMPREHENSIVE RESTORED DATABASE
const INITIAL_CLIENTS: ClientData[] = [
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
    lastLogin: '2024-11-20T10:30:00Z'
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
    documents: [
      { id: 'd1', name: 'Purchase_Invoices_Oct.pdf', type: 'Financial', status: 'uploaded', uploadDate: '2024-11-05' }
    ],
    notifications: [],
    contractValue: 24000,
    amountPaid: 8000,
    currency: 'MAD',
    paymentStatus: 'partial',
    missionStartDate: '2024-03-15',
    lastLogin: '2024-11-21T15:45:00Z'
  },
  {
    id: 'c3',
    email: 'yassine@atlas-trading.com',
    name: 'Yassine Mansouri',
    companyName: 'ATLAS TRADING GROUP',
    companyCategory: 'Import/Export',
    serviceType: 'Legal Follow-up',
    progress: 15,
    statusMessage: 'Statute Revision',
    timeline: [
      { id: 'at1', label: 'Document Review', status: 'in-progress' },
      { id: 'at2', label: 'Notary Meeting', status: 'pending' },
      { id: 'at3', label: 'Registry Update', status: 'pending' }
    ],
    documents: [
      { id: 'atd1', name: 'Original_Statutes.pdf', type: 'Legal', status: 'uploaded', uploadDate: '2024-11-18' }
    ],
    notifications: [],
    contractValue: 15000,
    amountPaid: 0,
    currency: 'MAD',
    paymentStatus: 'overdue',
    missionStartDate: '2024-10-01',
    lastLogin: '2024-11-19T09:20:00Z'
  },
  {
    id: 'c4',
    email: 'ceo@novatech.ma',
    name: 'Karim Tazi',
    companyName: 'NOVATECH SOLUTIONS',
    companyCategory: 'IT Services',
    serviceType: 'Full Management',
    progress: 65,
    statusMessage: 'Quarterly Reporting',
    timeline: [
      { id: 'nt1', label: 'Setup', status: 'completed' },
      { id: 'nt2', label: 'Q1 Review', status: 'completed' },
      { id: 'nt3', label: 'Q2 Review', status: 'in-progress' }
    ],
    documents: [],
    notifications: [],
    contractValue: 45000,
    amountPaid: 25000,
    currency: 'MAD',
    paymentStatus: 'partial',
    missionStartDate: '2024-05-12',
    lastLogin: '2024-11-21T11:10:00Z'
  },
  {
    id: 'c5',
    email: 'admin@greenbuild.ma',
    name: 'Fatima Zahra',
    companyName: 'GREEN BUILD MOROCCO',
    companyCategory: 'Construction',
    serviceType: 'Company Creation',
    progress: 90,
    statusMessage: 'Final Registry Signature',
    timeline: [
      { id: 'gb1', label: 'Certificate', status: 'completed' },
      { id: 'gb2', label: 'Bank Account', status: 'completed' },
      { id: 'gb3', label: 'RC Final', status: 'in-progress' }
    ],
    documents: [
      { id: 'gbd1', name: 'CIN_Copy.jpg', type: 'Identity', status: 'approved', uploadDate: '2024-11-01' }
    ],
    notifications: [],
    contractValue: 10000,
    amountPaid: 10000,
    currency: 'MAD',
    paymentStatus: 'paid',
    missionStartDate: '2024-11-01',
    lastLogin: '2024-11-20T16:05:00Z'
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
  'contact@mpldigital.com': 'mpl2024',
  'contact@thebrain.ma': 'brain2024',
  'yassine@atlas-trading.com': 'atlas2024',
  'ceo@novatech.ma': 'nova2024',
  'admin@greenbuild.ma': 'green2024',
  'amine@admin.com': 'admin2024'
};

const ADMIN_USER: User = {
  id: 'admin1',
  name: 'Amine El Fethi',
  email: 'amine@admin.com',
  role: 'admin'
};

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  
  const [clients, setClients] = useState<ClientData[]>(() => {
    const saved = localStorage.getItem('crm_clients_v2');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  
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
  
  useEffect(() => {
    localStorage.setItem('crm_clients_v2', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('crm_employees_v2', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('crm_auth_v2', JSON.stringify(authCredentials));
  }, [authCredentials]);

  useEffect(() => {
    localStorage.setItem('crm_admin_notifications_v2', JSON.stringify(adminNotifications));
  }, [adminNotifications]);

  const [currentView, setCurrentView] = useState<string>('dashboard');
  const [selectedClientIdForFollowUp, setSelectedClientIdForFollowUp] = useState<string | null>(null);

  const handleLogin = async (email: string, pass: string, role: Role): Promise<boolean> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const storedPass = authCredentials[email.toLowerCase()];
    if (!storedPass || storedPass !== pass) return false;

    if (role === 'admin' && email === 'amine@admin.com') {
      setUser(ADMIN_USER);
      setCurrentView('dashboard');
      return true;
    } 
    
    if (role === 'client') {
      const clientData = clients.find(c => c.email.toLowerCase() === email.toLowerCase());
      if (clientData) {
        updateClient(clientData.id, { lastLogin: new Date().toISOString() });
        setUser({
          id: clientData.id,
          name: clientData.name,
          email: clientData.email,
          role: 'client',
          avatarUrl: clientData.avatarUrl
        });
        setCurrentView('dashboard');
        return true;
      }
    }
    return false;
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
  };

  const handleAddEmployee = (newEmployee: Employee) => setEmployees(prev => [...prev, newEmployee]);
  const handleAddClient = (newClient: ClientData) => setClients(prev => [newClient, ...prev]);
  const handleUpdateCredentials = (email: string, pass: string) => setAuthCredentials(prev => ({ ...prev, [email.toLowerCase()]: pass }));

  const updateClient = (clientId: string, updates: Partial<ClientData>) => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;
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

      return { ...c, ...updates, notifications: newNotifications };
    }));

    if (user && user.id === clientId && user.role === 'client') {
      setUser(prev => prev ? ({
        ...prev,
        name: updates.name || prev.name,
        avatarUrl: updates.avatarUrl || prev.avatarUrl
      }) : null);
    }
  };

  const handleNewChatMessage = (senderId: string, recipientId: string, text: string) => {
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
      setClients(prev => prev.map(c => {
        if (c.id === recipientId) {
          return { ...c, notifications: [notification, ...c.notifications] };
        }
        return c;
      }));
    } else {
      const clientName = clients.find(c => c.id === senderId)?.companyName || 'A client';
      const adminNotif = { ...notification, title: `Message from ${clientName}` };
      setAdminNotifications(prev => [adminNotif, ...prev]);
    }
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    if (!user) return;
    if (user.role === 'admin') {
      setAdminNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, read: true } : n));
    } else {
      setClients(prev => prev.map(c => c.email === user.email ? { ...c, notifications: c.notifications.map(n => n.id === notificationId ? { ...n, read: true } : n) } : c));
    }
  };

  const handleMarkAllNotificationsAsRead = () => {
    if (!user) return;
    if (user.role === 'admin') {
      setAdminNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } else {
      setClients(prev => prev.map(c => c.email === user.email ? { ...c, notifications: c.notifications.map(n => ({ ...n, read: true })) } : c));
    }
  };

  const getCurrentClientData = () => clients.find(c => c.email === user?.email);
  const currentUserNotifications = user?.role === 'admin' ? adminNotifications : getCurrentClientData()?.notifications || [];

  const renderContent = () => {
    if (user?.role === 'admin') {
      if (currentView === 'follow-up') return <AdminFollowUpView clients={clients} onUpdateClient={updateClient} lang="en" initialClientId={selectedClientIdForFollowUp} />;
      if (currentView === 'calendar') return <AdminCalendarView clients={clients} />;
      if (currentView === 'finance') return <FinanceDashboard clients={clients} onUpdateClient={updateClient} />;
      if (currentView === 'documents') return <AdminDocumentsView clients={clients} onUpdateClient={updateClient} />;
      if (currentView === 'clients') return <AdminClientsView clients={clients} onManageClient={(clientId) => { setSelectedClientIdForFollowUp(clientId); setCurrentView('follow-up'); }} onUpdateClient={updateClient} />;
      if (currentView === 'team') return <AdminEmployeesView employees={employees} onAddEmployee={handleAddEmployee} />;
      if (currentView === 'settings') return <AdminSettingsView user={user} />;
      if (currentView === 'invoicing') return <AdminInvoicingView clients={clients} lang="en" />;
      if (currentView === 'tutorials') return <AdminTutorialsView lang="en" />;
      if (currentView === 'chat') return <ChatView lang="en" user={user} clients={clients} onNotify={handleNewChatMessage} />;
      if (currentView === 'client-access') return <AdminClientAccessView clients={clients} lang="en" onAddClient={handleAddClient} onUpdateCredentials={handleUpdateCredentials} />;
      return <AdminDashboard clients={clients} onUpdateClient={updateClient} user={user} />;
    } else {
      const clientData = getCurrentClientData();
      if (!clientData) return <div>Error loading client data</div>;
      if (currentView === 'documents') return <ClientDocumentsView client={clientData} onUpload={(f) => {}} />;
      if (currentView === 'settings') return <ClientSettingsView client={clientData} onUpdateProfile={(u) => updateClient(clientData.id, u)} />;
      if (currentView === 'chat') return <ChatView lang="en" user={user} clients={clients} onNotify={handleNewChatMessage} />;
      if (currentView === 'guide') return <ClientGuideView onNavigate={(view) => setCurrentView(view)} />;
      if (currentView === 'tutorials') return <AdminTutorialsView lang="en" />;
      return <ClientPortal client={clientData} onNavigateToDocs={() => setCurrentView('documents')} />;
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
          onOpenProfile={() => setCurrentView('settings')}
          activeView={currentView}
          onNavigate={(view) => setCurrentView(view)}
          clients={clients}
        >
          {renderContent()}
        </Layout>
      ) : (
        <Login onLogin={handleLogin} />
      )}
      {user?.role === 'client' && <WhatsAppFab />}
    </div>
  );
};

export default App;
