
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { WhatsAppFab } from './components/WhatsAppFab';
import { Login } from './views/Login';
import { ClientPortal } from './views/ClientPortal';
import { ClientDocumentsView } from './views/ClientDocumentsView';
import { ClientSettingsView } from './views/ClientSettingsView';
import { ClientChatView } from './views/ClientChatView';
import { AdminDashboard } from './views/AdminDashboard';
import { FinanceDashboard } from './views/FinanceDashboard';
import { AdminDocumentsView } from './views/AdminDocumentsView';
import { AdminSettingsView } from './views/AdminSettingsView';
import { AdminEmployeesView } from './views/AdminEmployeesView';
import { AdminClientsView } from './views/AdminClientsView';
import { AdminInvoicingView } from './views/AdminInvoicingView';
import { AdminTutorialsView } from './views/AdminTutorialsView';
import { AdminClientAccessView } from './views/AdminClientAccessView';
import { User, ClientData, Role, Notification, Employee } from './types';
import { Language } from './translations';

// Updated Real Client Data
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
    paymentStatus: 'paid'
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
    paymentStatus: 'partial'
  },
  {
    id: 'c3',
    email: 'info@gonex.ma',
    name: 'Gonex Manager',
    companyName: 'GONEX SARL AU',
    companyCategory: 'Import/Export',
    serviceType: 'Legal Follow-up',
    progress: 75,
    statusMessage: 'Customs Clearance',
    timeline: [
      { id: 't1', label: 'File Submission', status: 'completed' },
      { id: 't2', label: 'Processing', status: 'in-progress' }
    ],
    documents: [],
    notifications: [],
    contractValue: 15000,
    amountPaid: 15000,
    currency: 'MAD',
    paymentStatus: 'paid'
  },
  {
    id: 'c4',
    email: 'contact@beautyvana.com',
    name: 'Beautyvana Rep',
    companyName: 'BEAUTYVANA GROUP SARL',
    companyCategory: 'Retail & Cosmetics',
    serviceType: 'Company Creation',
    progress: 20,
    statusMessage: 'Negative Certificate',
    timeline: [
      { id: 't1', label: 'Name Reservation', status: 'in-progress' }
    ],
    documents: [
      { id: 'd1', name: 'CIN_Manager.jpg', type: 'Identity', status: 'uploaded', uploadDate: '2023-10-27' }
    ],
    notifications: [],
    contractValue: 10000,
    amountPaid: 5000,
    currency: 'MAD',
    paymentStatus: 'partial'
  },
  {
    id: 'c5',
    email: 'invest@sla-global.com',
    name: 'SLA Director',
    companyName: 'SLA GLOBAL INVEST',
    companyCategory: 'Investment',
    serviceType: 'Domiciliation',
    progress: 100,
    statusMessage: 'Active',
    timeline: [
      { id: 't1', label: 'Contract Signed', status: 'completed' }
    ],
    documents: [],
    notifications: [],
    contractValue: 3000,
    amountPaid: 3000,
    currency: 'MAD',
    paymentStatus: 'paid'
  },
  {
    id: 'c6',
    email: 'empire@hanbali.ma',
    name: 'El Hanbali',
    companyName: 'EL HANBALI EMPIRE SARL AU',
    companyCategory: 'General Trading',
    serviceType: 'Fiscal Advisory',
    progress: 60,
    statusMessage: 'Audit in Progress',
    timeline: [
      { id: 't1', label: 'Q3 Review', status: 'in-progress' }
    ],
    documents: [],
    notifications: [],
    contractValue: 18000,
    amountPaid: 9000,
    currency: 'MAD',
    paymentStatus: 'partial'
  },
  {
    id: 'c7',
    email: 'info@habbat.com',
    name: 'Habbat Admin',
    companyName: 'HABBAT INVEST SARL AU',
    companyCategory: 'Investment',
    serviceType: 'Company Creation',
    progress: 90,
    statusMessage: 'Tax ID Creation',
    timeline: [
      { id: 't1', label: 'RC', status: 'completed' },
      { id: 't2', label: 'IF & Patente', status: 'in-progress' }
    ],
    documents: [],
    notifications: [],
    contractValue: 12000,
    amountPaid: 12000,
    currency: 'MAD',
    paymentStatus: 'paid'
  },
  {
    id: 'c8',
    email: 'contact@tisoral.ma',
    name: 'Tisoral Manager',
    companyName: 'TISORAL SARL AU',
    companyCategory: 'Services',
    serviceType: 'Legal Follow-up',
    progress: 10,
    statusMessage: 'Initial Consultation',
    timeline: [
      { id: 't1', label: 'Kickoff', status: 'completed' }
    ],
    documents: [],
    notifications: [],
    contractValue: 5000,
    amountPaid: 0,
    currency: 'MAD',
    paymentStatus: 'pending'
  },
  {
    id: 'c9',
    email: 'info@airzone.ma',
    name: 'Airzone Tech',
    companyName: 'AIRZONE SARL',
    companyCategory: 'Industrial',
    serviceType: 'Fiscal Advisory',
    progress: 50,
    statusMessage: 'VAT Filing',
    timeline: [],
    documents: [],
    notifications: [],
    contractValue: 20000,
    amountPaid: 10000,
    currency: 'MAD',
    paymentStatus: 'partial'
  },
  {
    id: 'c10',
    email: 'maitre@maarouf.legal',
    name: 'Maitre Maarouf',
    companyName: 'DOSSIER MAITRE MAAROUF',
    companyCategory: 'Legal Affairs',
    serviceType: 'Special Mandate',
    progress: 30,
    statusMessage: 'Case Study',
    timeline: [],
    documents: [],
    notifications: [],
    contractValue: 15000,
    amountPaid: 5000,
    currency: 'MAD',
    paymentStatus: 'partial'
  },
  {
    id: 'c11',
    email: 'invest@sail.com',
    name: 'Sail Director',
    companyName: 'SAIL GLOBAL INVEST SARL',
    companyCategory: 'Investment',
    serviceType: 'Company Creation',
    progress: 10,
    statusMessage: 'Awaiting Documents',
    timeline: [
       { id: 't1', label: 'Onboarding', status: 'completed' },
       { id: 't2', label: 'Doc Collection', status: 'in-progress' }
    ],
    documents: [],
    notifications: [],
    contractValue: 12000,
    amountPaid: 0,
    currency: 'MAD',
    paymentStatus: 'pending'
  },
  {
    id: 'c12',
    email: 'contact@act-consulting.ma',
    name: 'Act Consultant',
    companyName: 'ACT CONSULTING SARL',
    companyCategory: 'Consulting',
    serviceType: 'Domiciliation',
    progress: 100,
    statusMessage: 'Active',
    timeline: [],
    documents: [],
    notifications: [],
    contractValue: 3500,
    amountPaid: 3500,
    currency: 'MAD',
    paymentStatus: 'paid'
  },
  {
    id: 'c13',
    email: 'info@harvestx.ma',
    name: 'HarvestX Rep',
    companyName: 'HARVESTX SARL AU',
    companyCategory: 'Agriculture',
    serviceType: 'Fiscal Advisory',
    progress: 80,
    statusMessage: 'Year-end Closing',
    timeline: [],
    documents: [
       { id: 'd1', name: 'Balance_Sheet_Draft.pdf', type: 'Financial', status: 'uploaded', uploadDate: '2023-10-26' }
    ],
    notifications: [],
    contractValue: 30000,
    amountPaid: 25000,
    currency: 'MAD',
    paymentStatus: 'partial'
  },
  {
    id: 'c14',
    email: 'contact@laraki-global.com',
    name: 'Laraki Global',
    companyName: 'LARAKI GLOBAL SERVICE',
    companyCategory: 'Services',
    serviceType: 'Company Creation',
    progress: 100,
    statusMessage: 'Delivered',
    timeline: [],
    documents: [],
    notifications: [],
    contractValue: 11000,
    amountPaid: 11000,
    currency: 'MAD',
    paymentStatus: 'paid'
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
  },
  {
    id: 'e2',
    name: 'Zaid',
    role: 'Creative Designer',
    department: 'Design',
    email: 'zaid@amineelfethi.com',
    phone: '+212 600-333444',
    status: 'active',
    joinDate: '2023-03-10',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  },
  {
    id: 'e3',
    name: 'Fadoua',
    role: "Amine's Assistant",
    department: 'Administration',
    email: 'fadoua@amineelfethi.com',
    phone: '+212 600-555666',
    status: 'active',
    joinDate: '2022-11-01',
    avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
  }
];

// HARDCODED CREDENTIALS MAP FOR DEMO
const AUTH_DB: Record<string, string> = {
  'contact@mpldigital.com': 'mpl2024',
  'contact@thebrain.ma': 'brain2024',
  'info@gonex.ma': 'gonex2024',
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
  const [clients, setClients] = useState<ClientData[]>(INITIAL_CLIENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  
  // Navigation State
  const [currentView, setCurrentView] = useState<string>('dashboard');

  // Language & Direction State
  const [language, setLanguage] = useState<Language>('en');

  // Update Document Direction based on Language
  useEffect(() => {
    const dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language]);

  const handleLogin = async (email: string, pass: string, role: Role): Promise<boolean> => {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    const storedPass = AUTH_DB[email.toLowerCase()];
    if (!storedPass || storedPass !== pass) {
      return false;
    }

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

  const handleAddEmployee = (newEmployee: Employee) => {
    setEmployees(prev => [...prev, newEmployee]);
  };

  const handleAddClient = (newClient: ClientData) => {
    setClients(prev => [newClient, ...prev]);
  };

  const updateClient = (clientId: string, updates: Partial<ClientData>) => {
    setClients(prev => prev.map(c => {
      if (c.id !== clientId) return c;

      const newNotifications: Notification[] = [...c.notifications];
      const now = new Date().toISOString();
      
      if (updates.statusMessage && updates.statusMessage !== c.statusMessage) {
        newNotifications.unshift({
          id: `n-${Date.now()}-status`,
          title: 'Status Update',
          message: `New status: ${updates.statusMessage}`,
          date: now,
          read: false,
          type: 'info'
        });
      } else if (updates.progress !== undefined && updates.progress !== c.progress) {
        newNotifications.unshift({
          id: `n-${Date.now()}-progress`,
          title: 'Progress Update',
          message: `Your service progress is now at ${updates.progress}%.`,
          date: now,
          read: false,
          type: 'info'
        });
      }

      if (updates.documents) {
        updates.documents.forEach(newDoc => {
          const oldDoc = c.documents.find(d => d.id === newDoc.id);
          if (oldDoc && oldDoc.status !== 'approved' && newDoc.status === 'approved') {
            newNotifications.unshift({
              id: `n-${Date.now()}-${newDoc.id}`,
              title: 'Document Approved',
              message: `Your document "${newDoc.name}" has been reviewed and approved.`,
              date: now,
              read: false,
              type: 'success'
            });
          }
          if (oldDoc && oldDoc.status !== 'rejected' && newDoc.status === 'rejected') {
             const reasonText = newDoc.rejectionReason ? ` Reason: ${newDoc.rejectionReason}` : '';
             newNotifications.unshift({
              id: `n-${Date.now()}-${newDoc.id}-rej`,
              title: 'Document Rejected',
              message: `Issue with "${newDoc.name}".${reasonText} Please check and re-upload.`,
              date: now,
              read: false,
              type: 'alert'
            });
          }
        });
      }

      // Financial Update Notification
      if (updates.amountPaid !== undefined && updates.amountPaid > c.amountPaid) {
        const diff = updates.amountPaid - c.amountPaid;
        newNotifications.unshift({
          id: `n-${Date.now()}-payment`,
          title: 'Payment Received',
          message: `A payment of ${diff.toLocaleString()} ${c.currency} has been recorded.`,
          date: now,
          read: false,
          type: 'success'
        });
      }

      return { ...c, ...updates, notifications: newNotifications };
    }));
  };

  const handleClientUpload = (fileName: string) => {
    if (!user || user.role !== 'client') return;
    
    const clientIndex = clients.findIndex(c => c.email === user.email);
    if (clientIndex === -1) return;

    const newDoc = {
      id: `d${Date.now()}`,
      name: fileName,
      type: 'Upload',
      status: 'uploaded' as const,
      uploadDate: new Date().toISOString()
    };

    const updatedClients = [...clients];
    updatedClients[clientIndex] = {
      ...updatedClients[clientIndex],
      documents: [...updatedClients[clientIndex].documents, newDoc]
    };
    
    setClients(updatedClients);
  };

  const handleMarkNotificationAsRead = (notificationId: string) => {
    if (!user || user.role !== 'client') return;
    
    setClients(prev => prev.map(c => {
      if (c.email !== user.email) return c;
      return {
        ...c,
        notifications: c.notifications.map(n => 
          n.id === notificationId ? { ...n, read: true } : n
        )
      };
    }));
  };

  const handleMarkAllNotificationsAsRead = () => {
    if (!user || user.role !== 'client') return;
    
    setClients(prev => prev.map(c => {
      if (c.email !== user.email) return c;
      return {
        ...c,
        notifications: c.notifications.map(n => ({ ...n, read: true }))
      };
    }));
  };

  const handleClientProfileUpdate = (updates: Partial<ClientData>) => {
    if (!user) return;
    const currentClient = getCurrentClientData();
    if (!currentClient) return;

    updateClient(currentClient.id, updates);

    if ((updates.name || updates.avatarUrl) && user.role === 'client') {
      setUser(prev => prev ? ({ 
        ...prev, 
        name: updates.name || prev.name, 
        avatarUrl: updates.avatarUrl || prev.avatarUrl 
      }) : null);
    }
  };

  const getCurrentClientData = () => {
    return clients.find(c => c.email === user?.email);
  };

  const currentUserNotifications = user?.role === 'client' 
    ? getCurrentClientData()?.notifications 
    : [];

  // Render content based on Role and Current View
  const renderContent = () => {
    if (user?.role === 'admin') {
      if (currentView === 'finance') {
        return <FinanceDashboard clients={clients} onUpdateClient={updateClient} lang={language} />;
      }
      if (currentView === 'documents') {
        return <AdminDocumentsView clients={clients} onUpdateClient={updateClient} lang={language} />;
      }
      if (currentView === 'clients') {
        return <AdminClientsView clients={clients} lang={language} />;
      }
      if (currentView === 'team') {
        return <AdminEmployeesView employees={employees} onAddEmployee={handleAddEmployee} lang={language} />;
      }
      if (currentView === 'settings') {
        return <AdminSettingsView user={user} lang={language} />;
      }
      if (currentView === 'invoicing') {
        return <AdminInvoicingView clients={clients} lang={language} />;
      }
      if (currentView === 'tutorials') {
        return <AdminTutorialsView lang={language} />;
      }
      if (currentView === 'client-access') {
        return <AdminClientAccessView clients={clients} lang={language} onAddClient={handleAddClient} />;
      }
      return <AdminDashboard clients={clients} onUpdateClient={updateClient} user={user} lang={language} />;
    } else {
      const clientData = getCurrentClientData();
      if (!clientData) return <div>Error loading client data</div>;
      
      if (currentView === 'documents') {
        return (
          <ClientDocumentsView 
            client={clientData}
            onUpload={handleClientUpload}
            lang={language}
          />
        );
      }
      
      if (currentView === 'settings') {
        return (
          <ClientSettingsView 
            client={clientData}
            onUpdateProfile={handleClientProfileUpdate}
            lang={language}
          />
        );
      }

      if (currentView === 'chat') {
        return <ClientChatView lang={language} />;
      }

      return (
        <ClientPortal 
          client={clientData} 
          onNavigateToDocs={() => setCurrentView('documents')}
          lang={language}
        />
      );
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
          currentLanguage={language}
          onLanguageChange={setLanguage}
        >
          {renderContent()}
        </Layout>
      ) : (
        <Login onLogin={handleLogin} lang={language} />
      )}
      
      {/* Only show WhatsApp FAB for authenticated clients */}
      {user?.role === 'client' && <WhatsAppFab />}
    </div>
  );
};

export default App;
