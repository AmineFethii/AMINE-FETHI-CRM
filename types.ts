
export type Role = 'admin' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone?: string;
  status: 'active' | 'on-leave' | 'inactive';
  avatarUrl?: string;
  joinDate: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface TimelineStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed';
  date?: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'uploaded' | 'approved' | 'rejected';
  uploadDate?: string;
  rejectionReason?: string;
}

export interface ClientData {
  id: string;
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  cin?: string;
  companyName: string;
  companyCategory?: string;
  phone?: string;
  whatsapp?: string;
  avatarUrl?: string;
  
  serviceType: string;
  progress: number;
  statusMessage: string;
  timeline: TimelineStep[];
  documents: ClientDocument[];
  notifications: Notification[];

  // Financials
  contractValue: number;
  amountPaid: number;
  currency: string;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'overdue';
  lastPaymentDate?: string;

  // Mission Lifecycle
  missionStartDate: string; // ISO Date for yearly cycle tracking
  lastLogin?: string; // ISO Date for activity tracking
}
