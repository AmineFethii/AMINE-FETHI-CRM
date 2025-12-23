
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
import { User, ClientData, Role, Notification, Employee } from './types';

// Updated Real Client Data with Cycle Dates
const INITIAL_CLIENTS: ClientData[] = [
  {
    id: 'c1',
    email: 'contact@mpldigital.com',
    name: 'MPL Admin',
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
    documents: [],
    notifications: [],
    contractValue: 12000,
    amountPaid: 12000,
    currency: 'MAD',
    paymentStatus: 'paid',
    missionStartDate: '2024-01-10'
  },
  {
    id: 'c2',
    email: 'contact@thebrain.ma',
    name: 'Brain Admin',
    companyName: 'THE BRAIN SARL AU',
    companyCategory: 'Consulting',
    serviceType: 'Fiscal Advisory',
    progress: 40,
    statusMessage: 'Monthly Declaration',
    timeline: [
      { id: 't1', label: 'Setup', status: 'completed' },
      { id: 't2', label: 'Monthly Declaration', status: 'in-progress' }
    ],
    documents: [
      { id: 'd1', name: 'Invoices_Oct.pdf', type: 'Financial', status: 'uploaded', uploadDate: '2023-10-25' }
    ],
    notifications: [],
    contractValue: 24000,
    amountPaid: 6000,
    currency: 'MAD',
    paymentStatus: 'partial',
    missionStartDate: '2024-03-15'
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
    const saved = localStorage.getItem('crm_clients');
    return saved ? JSON.parse(saved) : INITIAL_CLIENTS;
  });
  
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem('crm_employees');
    return saved ? JSON.parse(saved) : INITIAL_EMPLOYEES;
  });

  const [authCredentials, setAuthCredentials] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('crm_auth');
    return saved ? JSON.parse(saved) : INITIAL_AUTH_DB;
  });

  const [adminNotifications, setAdminNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('crm_admin_notifications');
    return saved ? JSON.parse(saved) : [];
  });
  
  useEffect(() => {
    localStorage.setItem('crm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('crm_employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('crm_auth', JSON.stringify(authCredentials));
  }, [authCredentials]);

  useEffect(() => {
    localStorage.setItem('crm_admin_notifications', JSON.stringify(adminNotifications));
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
