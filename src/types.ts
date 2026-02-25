export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
}

export type Role = 'admin' | 'client';

export interface Notification {
  id: string;
  title: string;
  message: string;
  date: string;
  read: boolean;
  type: 'info' | 'success' | 'alert';
}

export interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  joinDate: string;
  avatarUrl?: string;
}

export interface ClientDocument {
  id: string;
  name: string;
  type: string;
  status: 'uploaded' | 'pending' | 'approved' | 'rejected';
  uploadDate: string;
  rejectionReason?: string;
  fileUrl?: string;
}

export interface ClientTask {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  createdAt: string;
}

export interface TimelineStep {
  id: string;
  label: string;
  status: 'pending' | 'in-progress' | 'completed';
  dueDate?: string;
}

export interface ClientData {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'client';
  avatarUrl?: string;
  companyName: string;
  serviceType: string;
  statusMessage: string;
  progress: number;
  lastLogin?: string;
  hasFilledProfile?: boolean;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  cin?: string;
  phone?: string;
  birthDate?: string;
  fullAddress?: string;
  province?: string;
  companyNameProposals?: string[];
  businessActivity?: string;
  annualTurnover?: string;
  desiredMonthlySalary?: string;
  moneyTransferMethod?: string;
  monthlyTransfer?: string;
  paymentPlatforms?: string;
  existingEntityLLCLTD?: string;
  hasEmployees?: string;
  employeeCount?: string;
  ownerCount?: string;
  plannedStartDate?: string;
  monthlyBusinessExpenses?: string;
  whatsapp?: string;
  hasSecondOwner?: string;
  secondOwnerFirstName?: string;
  secondOwnerLastName?: string;
  secondOwnerNationality?: string;
  secondOwnerCin?: string;
  currency: string;
  amountPaid: number;
  totalContractAmount: number;
  documents?: ClientDocument[];
  notifications?: Notification[];
  clientTasks?: ClientTask[];
  timeline?: TimelineStep[];
  invoices?: any[]; // Consider defining a proper Invoice interface
}

export interface FirestoreUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: Role;
  avatarUrl?: string;
  companyName?: string;
  serviceType?: string;
  statusMessage?: string;
  progress?: number;
  lastLogin?: string;
  hasFilledProfile?: boolean;
  firstName?: string;
  lastName?: string;
  nationality?: string;
  cin?: string;
  phone?: string;
  birthDate?: string;
  fullAddress?: string;
  province?: string;
  companyNameProposals?: string[];
  businessActivity?: string;
  annualTurnover?: string;
  desiredMonthlySalary?: string;
  moneyTransferMethod?: string;
  monthlyTransfer?: string;
  paymentPlatforms?: string;
  existingEntityLLCLTD?: string;
  hasEmployees?: string;
  employeeCount?: string;
  ownerCount?: string;
  plannedStartDate?: string;
  monthlyBusinessExpenses?: string;
  whatsapp?: string;
  hasSecondOwner?: string;
  secondOwnerFirstName?: string;
  secondOwnerLastName?: string;
  secondOwnerNationality?: string;
  secondOwnerCin?: string;
  currency?: string;
  amountPaid?: number;
  totalContractAmount?: number;
  documents?: ClientDocument[];
  notifications?: Notification[];
  clientTasks?: ClientTask[];
  timeline?: TimelineStep[];
  invoices?: any[];
}
