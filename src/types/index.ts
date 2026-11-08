export type UserRole =
  | 'admin'
  | 'billing_officer'
  | 'reader'
  | 'staff'
  | 'technician'
  | 'customer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  avatar?: string;
  zone?: string;
  customerId?: string; // If customer role
  accountStatus: 'active' | 'suspended' | 'inactive';
  lastLogin?: string;
}

export type CustomerType = 'Household' | 'Business' | 'Institution';
export type ConnectionStatus = 'active' | 'pending' | 'suspended' | 'disconnected' | 'closed';

export interface Customer {
  id: string;
  accountNumber: string; // e.g., KIK-000124
  name: string;
  phone: string;
  altPhone?: string;
  email?: string;
  customerType: CustomerType;
  idType?: 'National ID' | 'Passport' | 'Alien ID' | 'Military ID';
  idNumber?: string;
  zone: string;
  village: string;
  plotNumber?: string;
  address: string;
  landmark?: string;
  locationNotes?: string;
  connectionStatus: ConnectionStatus;
  balance: number; // in KSh
  registeredDate: string;
  meterId?: string;
  notes?: string;
}

export interface Connection {
  id: string;
  connectionNumber: string; // CON-000124
  customerId: string;
  customerAccount: string;
  customerName: string;
  zone: string;
  connectionType: 'Standard Domestic' | 'Commercial' | 'Institutional' | 'Agricultural';
  status: ConnectionStatus;
  physicalLocation: string;
  applicationDate: string;
  approvalDate?: string;
  installationDate?: string;
  tariffId: string;
  meterId?: string;
  notes?: string;
}

export interface Meter {
  id: string;
  meterNumber: string; // MTR-2024-089
  serialNumber: string; // WM-883921
  customerId: string;
  customerName: string;
  connectionId: string;
  meterType: 'Digital Ultrasonic' | 'Mechanical Woltman' | 'Multi-jet Smart';
  installationDate: string;
  lastReading: number;
  condition: 'Good' | 'Fair' | 'Faulty' | 'Needs Calibration';
  status: 'Active' | 'Under Repair' | 'Decommissioned';
  replacementHistory?: {
    replacedDate: string;
    oldSerialNumber: string;
    finalReading: number;
    initialReading: number;
    reason: string;
  }[];
}

export type ReadingStatus = 'pending_review' | 'approved' | 'rejected';

export interface MeterReading {
  id: string;
  customerId: string;
  customerAccount: string;
  customerName: string;
  meterSerialNumber: string;
  previousReading: number;
  currentReading: number;
  consumption: number; // m³ = current - previous
  readingDate: string;
  period: string; // e.g. "October 2026"
  readerName: string;
  status: ReadingStatus;
  imageUrl?: string;
  notes?: string;
  flag?: 'normal' | 'high_consumption' | 'negative_reading';
}

export interface TariffBand {
  min: number;
  max: number | null; // null means unbounded
  rate: number; // KSh per m³
  label: string;
}

export interface Tariff {
  id: string;
  name: string;
  customerCategory: CustomerType;
  description: string;
  billingUnit: string; // m³
  minimumCharge: number; // KSh
  fixedCharge: number; // meter rent KSh
  bands: TariffBand[];
  status: 'active' | 'draft' | 'archived';
  effectiveFrom: string;
  effectiveUntil?: string;
}

export type InvoiceStatus = 'paid' | 'partially_paid' | 'unpaid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  invoiceNumber: string; // INV-2026-0090
  customerId: string;
  customerAccount: string;
  customerName: string;
  customerAddress: string;
  customerZone: string;
  customerPhone: string;
  period: string; // e.g. "October 2026"
  invoiceDate: string;
  dueDate: string;
  previousReading: number;
  currentReading: number;
  consumption: number; // m³
  tariffName: string;
  breakdown: {
    bandName: string;
    units: number;
    rate: number;
    amount: number;
  }[];
  fixedCharge: number; // meter rent
  adjustments?: number;
  totalAmount: number;
  amountPaid: number;
  balance: number;
  status: InvoiceStatus;
  paymentHistory?: {
    receiptNumber: string;
    amount: number;
    date: string;
    method: string;
  }[];
}

export type PaymentMethod = 'M-Pesa' | 'Cash' | 'Bank';
export type PaymentStatus = 'completed' | 'pending' | 'reversed';

export interface Payment {
  id: string;
  receiptNumber: string; // RCP-2026-0412
  customerId: string;
  customerAccount: string;
  customerName: string;
  amount: number;
  paymentMethod: PaymentMethod;
  transactionReference: string; // e.g. QK8912KLOP for M-Pesa
  date: string;
  status: PaymentStatus;
  allocatedInvoices: {
    invoiceNumber: string;
    amountAllocated: number;
  }[];
  receivingOfficer: string;
  notes?: string;
  payerPhone?: string;
}

export type FaultCategory =
  | 'Leakage'
  | 'Burst pipe'
  | 'No water supply'
  | 'Low water pressure'
  | 'Faulty meter'
  | 'Damaged connection'
  | 'Infrastructure damage'
  | 'Other';

export type FaultPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type FaultStatus =
  | 'Open'
  | 'Assigned'
  | 'In Progress'
  | 'Awaiting Parts'
  | 'Completed'
  | 'Verified'
  | 'Resolved'
  | 'Closed';

export interface FaultHistoryEntry {
  status: FaultStatus;
  timestamp: string;
  actor: string;
  comment?: string;
}

export interface FaultReport {
  id: string;
  faultReference: string; // FLT-2026-045
  category: FaultCategory;
  reporterName: string;
  reporterPhone: string;
  customerAccount?: string;
  description: string;
  zone: string;
  landmark: string;
  priority: FaultPriority;
  dateReported: string;
  status: FaultStatus;
  assignedTechnician?: string;
  workOrderId?: string;
  imageUrl?: string;
  resolutionNotes?: string;
  history: FaultHistoryEntry[];
}

export interface WorkOrder {
  id: string;
  workOrderNumber: string; // WO-2026-018
  faultReference: string;
  technicianName: string;
  location: string;
  priority: FaultPriority;
  assignedDate: string;
  dueDate: string;
  status: FaultStatus;
  workPerformed?: string;
  resolutionDescription?: string;
  completionDate?: string;
  evidenceUrl?: string;
}

export interface AssetMaintenanceRecord {
  id: string;
  date: string;
  type: string;
  technician: string;
  cost: number;
  notes: string;
}

export interface Asset {
  id: string;
  assetId: string; // AST-0012
  name: string;
  category:
    | 'Water sources'
    | 'Storage tanks'
    | 'Pumps'
    | 'Pipelines'
    | 'Valves'
    | 'Distribution points'
    | 'Other equipment';
  location: string;
  zone: string;
  condition: 'Excellent' | 'Good' | 'Needs Servicing' | 'Critical';
  operationalStatus: 'Operational' | 'Under Maintenance' | 'Decommissioned';
  responsiblePerson: string;
  installationDate: string;
  lastMaintenanceDate: string;
  nextMaintenanceDate: string;
  description: string;
  maintenanceHistory: AssetMaintenanceRecord[];
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: 'All customers' | 'Selected zones' | 'All staff' | 'Selected roles';
  targetZone?: string;
  publishedDate: string;
  expiryDate: string;
  status: 'Active' | 'Draft' | 'Expired';
  author: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  linkTo: string;
  type: 'billing' | 'fault' | 'reading' | 'payment' | 'system';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  entity: string;
  entityId: string;
  details: string;
}
