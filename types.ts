
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

export interface ClientTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  createdAt: string;
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
  password?: string;
  role?: Role;
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
  
  // French Legal Advisory Fields
  birthDate?: string;
  fullAddress?: string;
  province?: string;
  companyNameProposals?: string[]; // Three propositions
  businessActivity?: string;
  annualTurnover?: string;
  desiredMonthlySalary?: '5000' | '7000' | '8500';
  moneyTransferMethod?: string;
  monthlyTransfer?: 'Oui' | 'Non';
  paymentPlatforms?: string; // PayPal, Payoneer, etc.
  existingEntityLLCLTD?: 'Oui' | 'Non';
  hasEmployees?: 'Oui' | 'Non';
  employeeCount?: string;
  ownerCount?: string;
  plannedStartDate?: string;
  monthlyBusinessExpenses?: string;

  // Multi-owner fields
  hasSecondOwner?: 'Oui' | 'Non';
  secondOwnerFirstName?: string;
  secondOwnerLastName?: string;
  secondOwnerNationality?: string;
  secondOwnerCin?: string;

  serviceType: string;
  progress: number;
  statusMessage: string;
  timeline: TimelineStep[];
  clientTasks: ClientTask[]; // Tasks assigned to the client to complete
  documents: ClientDocument[];
  notifications: Notification[];

  // Logic Flags
  hasFilledProfile?: boolean;

  // Financials
  contractValue: number;
  amountPaid: number;
  currency: string;
  paymentStatus: 'paid' | 'partial' | 'pending' | 'overdue';
  lastPaymentDate?: string;

  // Mission Lifecycle
  missionStartDate: string; 
  lastLogin?: string; 
}
