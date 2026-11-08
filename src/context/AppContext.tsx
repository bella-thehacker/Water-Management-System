import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Customer,
  Connection,
  Meter,
  MeterReading,
  Tariff,
  Invoice,
  Payment,
  FaultReport,
  WorkOrder,
  Asset,
  Announcement,
  NotificationItem,
  AuditLog,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_CUSTOMERS,
  INITIAL_CONNECTIONS,
  INITIAL_METERS,
  INITIAL_READINGS,
  INITIAL_TARIFFS,
  INITIAL_INVOICES,
  INITIAL_PAYMENTS,
  INITIAL_FAULTS,
  INITIAL_WORK_ORDERS,
  INITIAL_ASSETS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';

export type NavPage =
  | 'overview'
  | 'customers'
  | 'customer_detail'
  | 'add_customer'
  | 'connections'
  | 'readings'
  | 'billing'
  | 'payments'
  | 'faults'
  | 'infrastructure'
  | 'reports'
  | 'announcements'
  | 'users'
  | 'audit_logs'
  | 'settings';

export type CustomerPortalPage =
  | 'home'
  | 'account'
  | 'bills'
  | 'payments'
  | 'consumption'
  | 'report_fault'
  | 'profile';

interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message: string;
}

interface AppContextType {
  // Auth & Mode
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  portalMode: 'staff' | 'customer';
  setPortalMode: (mode: 'staff' | 'customer') => void;
  activeNavPage: NavPage;
  setActiveNavPage: (page: NavPage) => void;
  customerPortalPage: CustomerPortalPage;
  setCustomerPortalPage: (page: CustomerPortalPage) => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (collapsed: boolean) => void;
  searchOpen: boolean;
  setSearchOpen: (open: boolean) => void;

  // Selected Record Viewers
  selectedCustomerId: string | null;
  setSelectedCustomerId: (id: string | null) => void;
  selectedInvoice: Invoice | null;
  setSelectedInvoice: (invoice: Invoice | null) => void;
  selectedReceipt: Payment | null;
  setSelectedReceipt: (payment: Payment | null) => void;

  // Data Store
  users: User[];
  customers: Customer[];
  connections: Connection[];
  meters: Meter[];
  readings: MeterReading[];
  tariffs: Tariff[];
  invoices: Invoice[];
  payments: Payment[];
  faults: FaultReport[];
  workOrders: WorkOrder[];
  assets: Asset[];
  announcements: Announcement[];
  notifications: NotificationItem[];
  auditLogs: AuditLog[];

  // Toast
  toasts: ToastMessage[];
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Actions
  login: (email: string, role?: string) => boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  addUser: (data: {                                                    // <-- ADD THIS
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    zone?: string;
  }) => User;
  removeUser: (userId: string) => { success: boolean; error?: string }; // <-- ADD THIS

  // Customer workflows
  addCustomer: (data: {
    name: string;
    phone: string;
    altPhone?: string;
    email?: string;
    customerType: Customer['customerType'];
    idType?: Customer['idType'];
    idNumber?: string;
    zone: string;
    village: string;
    plotNumber?: string;
    address: string;
    landmark?: string;
    locationNotes?: string;
    connectionType: Connection['connectionType'];
    connectionStatus: Connection['status'];
    tariffCategory: string;
    meterInstalled: boolean;
    meterSerialNumber?: string;
    installationDate?: string;
    initialReading?: number;
    connectionNotes?: string;
  }) => Customer;
  updateCustomer: (id: string, updates: Partial<Customer>) => void;
  deactivateCustomer: (id: string) => void;

  // Meter Reading workflows
  addMeterReading: (reading: {
    customerId: string;
    meterSerialNumber: string;
    currentReading: number;
    readingDate: string;
    period: string;
    notes?: string;
    imageUrl?: string;
  }) => { success: boolean; error?: string; reading?: MeterReading };
  approveReading: (readingId: string) => void;
  rejectReading: (readingId: string, reason?: string) => void;

  // Billing & Tariffs
  executeBillingRun: (period: string, targetZones: string[]) => {
    generatedCount: number;
    totalBilled: number;
    exceptions: string[];
  };
  addTariff: (tariff: Omit<Tariff, 'id'>) => void;
  updateTariff: (id: string, tariff: Partial<Tariff>) => void;

  // Payments workflows
  recordPayment: (payment: {
    customerId: string;
    amount: number;
    paymentMethod: Payment['paymentMethod'];
    transactionReference: string;
    paymentDate: string;
    notes?: string;
    specificInvoiceNumber?: string;
  }) => Payment;

  // Faults & Work Orders
  createFaultReport: (fault: {
    category: FaultReport['category'];
    description: string;
    zone: string;
    landmark: string;
    priority: FaultReport['priority'];
    reporterName: string;
    reporterPhone: string;
    customerAccount?: string;
    imageUrl?: string;
  }) => FaultReport;
  updateFaultStatus: (
    faultId: string,
    status: FaultReport['status'],
    actor: string,
    comment?: string
  ) => void;
  assignFaultTechnician: (faultId: string, technicianName: string, priority: FaultReport['priority']) => void;
  completeWorkOrder: (
    workOrderId: string,
    workPerformed: string,
    resolutionDescription: string
  ) => void;

  // Assets
  addAsset: (asset: Omit<Asset, 'id' | 'assetId' | 'maintenanceHistory'>) => void;
  addAssetMaintenance: (
    assetId: string,
    record: Omit<Asset['maintenanceHistory'][0], 'id'>
  ) => void;

  // Announcements
  addAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;

  // Notifications
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Reset
  resetToDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEY = 'kikuyu_water_app_state_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or initial
  const loadInitial = <T,>(key: string, fallback: T): T => {
    try {
      const stored = localStorage.getItem(`${STORAGE_KEY}_${key}`);
      return stored ? JSON.parse(stored) : fallback;
    } catch {
      return fallback;
    }
  };

  
const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [portalMode, setPortalMode] = useState<'staff' | 'customer'>('staff');
  const [activeNavPage, setActiveNavPage] = useState<NavPage>('overview');
  const [customerPortalPage, setCustomerPortalPage] = useState<CustomerPortalPage>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [searchOpen, setSearchOpen] = useState<boolean>(false);

  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [selectedReceipt, setSelectedReceipt] = useState<Payment | null>(null);

  // Entities state
  const [users, setUsers] = useState<User[]>(() => loadInitial('users', INITIAL_USERS));
  const [customers, setCustomers] = useState<Customer[]>(() =>
    loadInitial('customers', INITIAL_CUSTOMERS)
  );
  const [connections, setConnections] = useState<Connection[]>(() =>
    loadInitial('connections', INITIAL_CONNECTIONS)
  );
  const [meters, setMeters] = useState<Meter[]>(() => loadInitial('meters', INITIAL_METERS));
  const [readings, setReadings] = useState<MeterReading[]>(() =>
    loadInitial('readings', INITIAL_READINGS)
  );
  const [tariffs, setTariffs] = useState<Tariff[]>(() =>
    loadInitial('tariffs', INITIAL_TARIFFS)
  );
  const [invoices, setInvoices] = useState<Invoice[]>(() =>
    loadInitial('invoices', INITIAL_INVOICES)
  );
  const [payments, setPayments] = useState<Payment[]>(() =>
    loadInitial('payments', INITIAL_PAYMENTS)
  );
  const [faults, setFaults] = useState<FaultReport[]>(() =>
    loadInitial('faults', INITIAL_FAULTS)
  );
  const [workOrders, setWorkOrders] = useState<WorkOrder[]>(() =>
    loadInitial('workOrders', INITIAL_WORK_ORDERS)
  );
  const [assets, setAssets] = useState<Asset[]>(() => loadInitial('assets', INITIAL_ASSETS));
  const [announcements, setAnnouncements] = useState<Announcement[]>(() =>
    loadInitial('announcements', INITIAL_ANNOUNCEMENTS)
  );
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    loadInitial('notifications', INITIAL_NOTIFICATIONS)
  );
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() =>
    loadInitial('auditLogs', INITIAL_AUDIT_LOGS)
  );

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
      localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
      localStorage.setItem(`${STORAGE_KEY}_customers`, JSON.stringify(customers));
      localStorage.setItem(`${STORAGE_KEY}_connections`, JSON.stringify(connections));
      localStorage.setItem(`${STORAGE_KEY}_meters`, JSON.stringify(meters));
      localStorage.setItem(`${STORAGE_KEY}_readings`, JSON.stringify(readings));
      localStorage.setItem(`${STORAGE_KEY}_tariffs`, JSON.stringify(tariffs));
      localStorage.setItem(`${STORAGE_KEY}_invoices`, JSON.stringify(invoices));
      localStorage.setItem(`${STORAGE_KEY}_payments`, JSON.stringify(payments));
      localStorage.setItem(`${STORAGE_KEY}_faults`, JSON.stringify(faults));
      localStorage.setItem(`${STORAGE_KEY}_workOrders`, JSON.stringify(workOrders));
      localStorage.setItem(`${STORAGE_KEY}_assets`, JSON.stringify(assets));
      localStorage.setItem(`${STORAGE_KEY}_announcements`, JSON.stringify(announcements));
      localStorage.setItem(`${STORAGE_KEY}_notifications`, JSON.stringify(notifications));
      localStorage.setItem(`${STORAGE_KEY}_auditLogs`, JSON.stringify(auditLogs));
    } catch {
      // Ignore quota storage issues
    }
  }, [
    currentUser,
    users,
    customers,
    connections,
    meters,
    readings,
    tariffs,
    invoices,
    payments,
    faults,
    workOrders,
    assets,
    announcements,
    notifications,
    auditLogs,
  ]);

  const addToast = (toast: Omit<ToastMessage, 'id'>) => {
    const id = `t-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { ...toast, id }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Auth
  const login = (email: string) => {
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      setCurrentUser(found);
      if (found.role === 'customer') {
        setPortalMode('customer');
        setCustomerPortalPage('home');
      } else {
        setPortalMode('staff');
        setActiveNavPage('overview');
      }
      addToast({
        type: 'success',
        title: `Welcome back, ${found.name}!`,
        message: 'Successfully signed in to Kikuyu Water.',
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
      if (target.role === 'customer') {
        setPortalMode('customer');
        setCustomerPortalPage('home');
      } else {
        setPortalMode('staff');
        setActiveNavPage('overview');
      }
      addToast({
        type: 'info',
        title: `Switched account to ${target.name}`,
        message: `Now viewing as ${target.role.replace('_', ' ')}.`,
      });
    }
  };

  const addUser = (data: {
    name: string;
    email: string;
    phone: string;
    role: UserRole;
    zone?: string;
  }): User => {
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: data.name,
      email: data.email,
      phone: data.phone,
      role: data.role,
      zone: data.zone,
      accountStatus: 'active',
      lastLogin: 'Never',
    };

    setUsers((prev) => [...prev, newUser]);

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentUser?.name || 'Administrator',
      action: 'Created Staff Account',
      entity: 'Staff User',
      entityId: data.email,
      details: `Created new ${data.role.replace('_', ' ')} staff account for ${data.name}.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    addToast({
      type: 'success',
      title: 'Staff Account Created',
      message: `${data.name} has been added as a ${data.role.replace('_', ' ')}.`,
    });

    return newUser;
  };

  const removeUser = (userId: string): { success: boolean; error?: string } => {
    const target = users.find((u) => u.id === userId);
    if (!target) {
      return { success: false, error: 'Staff member not found.' };
    }

    if (currentUser?.id === userId) {
      addToast({
        type: 'error',
        title: 'Action Prohibited',
        message: 'You cannot remove your own active staff account.',
      });
      return { success: false, error: 'You cannot remove your own active staff account.' };
    }

    if (target.role === 'admin') {
      const adminCount = users.filter((u) => u.role === 'admin').length;
      if (adminCount <= 1) {
        addToast({
          type: 'error',
          title: 'Action Prohibited',
          message: 'Cannot remove the last administrator account. At least one administrator is required.',
        });
        return { success: false, error: 'Cannot remove the last administrator account.' };
      }
    }

    setUsers((prev) => prev.filter((u) => u.id !== userId));

    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentUser?.name || 'Administrator',
      action: 'Removed Staff Account',
      entity: 'Staff User',
      entityId: target.email,
      details: `Removed staff member ${target.name} (${target.role.replace('_', ' ')}) from the system.`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    addToast({
      type: 'info',
      title: 'Staff Member Removed',
      message: `${target.name} has been removed from the scheme staff directory.`,
    });

    return { success: true };
  };

  // Add Customer (Step Wizard completed)
  const addCustomer = (data: {
    name: string;
    phone: string;
    altPhone?: string;
    email?: string;
    customerType: Customer['customerType'];
    idType?: Customer['idType'];
    idNumber?: string;
    zone: string;
    village: string;
    plotNumber?: string;
    address: string;
    landmark?: string;
    locationNotes?: string;
    connectionType: Connection['connectionType'];
    connectionStatus: Connection['status'];
    tariffCategory: string;
    meterInstalled: boolean;
    meterSerialNumber?: string;
    installationDate?: string;
    initialReading?: number;
    connectionNotes?: string;
  }): Customer => {
    // Generate next account number
    const maxNum = customers.reduce((max, c) => {
      const parts = c.accountNumber.split('-');
      const num = parseInt(parts[1] || '0', 10);
      return num > max ? num : max;
    }, 120);

    const nextAccountNum = `KIK-000${maxNum + 1}`;
    const custId = `cust-${Date.now()}`;
    const connId = `con-${Date.now()}`;
    const meterId = data.meterInstalled ? `mtr-${Date.now()}` : undefined;

    const newCustomer: Customer = {
      id: custId,
      accountNumber: nextAccountNum,
      name: data.name,
      phone: data.phone,
      altPhone: data.altPhone,
      email: data.email,
      customerType: data.customerType,
      idType: data.idType,
      idNumber: data.idNumber,
      zone: data.zone,
      village: data.village,
      plotNumber: data.plotNumber,
      address: data.address,
      landmark: data.landmark,
      locationNotes: data.locationNotes,
      connectionStatus: data.connectionStatus,
      balance: 0,
      registeredDate: new Date().toISOString().split('T')[0],
      meterId,
      notes: data.connectionNotes,
    };

    // Connection record
    const newConnection: Connection = {
      id: connId,
      connectionNumber: `CON-000${maxNum + 1}`,
      customerId: custId,
      customerAccount: nextAccountNum,
      customerName: data.name,
      zone: data.zone,
      connectionType: data.connectionType,
      status: data.connectionStatus,
      physicalLocation: `${data.address}, ${data.village}`,
      applicationDate: new Date().toISOString().split('T')[0],
      installationDate: data.installationDate || new Date().toISOString().split('T')[0],
      tariffId: data.tariffCategory === 'Commercial' ? 'trf-2' : data.tariffCategory === 'Institution' ? 'trf-3' : 'trf-1',
      meterId,
      notes: data.connectionNotes,
    };

    // If meter installed
    if (data.meterInstalled && data.meterSerialNumber) {
      const newMeter: Meter = {
        id: meterId!,
        meterNumber: `MTR-2026-0${maxNum + 1}`,
        serialNumber: data.meterSerialNumber,
        customerId: custId,
        customerName: data.name,
        connectionId: connId,
        meterType: 'Digital Ultrasonic',
        installationDate: data.installationDate || new Date().toISOString().split('T')[0],
        lastReading: data.initialReading || 0,
        condition: 'Good',
        status: 'Active',
      };
      setMeters((prev) => [newMeter, ...prev]);

      // Also record initial meter reading entry
      if (data.initialReading !== undefined) {
        const initialReadingRecord: MeterReading = {
          id: `rd-init-${Date.now()}`,
          customerId: custId,
          customerAccount: nextAccountNum,
          customerName: data.name,
          meterSerialNumber: data.meterSerialNumber,
          previousReading: 0,
          currentReading: data.initialReading,
          consumption: 0,
          readingDate: data.installationDate || new Date().toISOString().split('T')[0],
          period: 'Initial Commissioning',
          readerName: currentUser?.name || 'Water Technician',
          status: 'approved',
          flag: 'normal',
          notes: 'Baseline commissioning reading.',
        };
        setReadings((prev) => [initialReadingRecord, ...prev]);
      }
    }

    // Add Audit Log
    const newLog: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentUser?.name || 'Staff User',
      action: 'Registered Customer',
      entity: 'Customer',
      entityId: nextAccountNum,
      details: `Created customer account for ${data.name} in ${data.zone}.`,
    };

    setCustomers((prev) => [newCustomer, ...prev]);
    setConnections((prev) => [newConnection, ...prev]);
    setAuditLogs((prev) => [newLog, ...prev]);

    addToast({
      type: 'success',
      title: 'Customer registered successfully!',
      message: `Account ${nextAccountNum} assigned to ${data.name}.`,
    });

    return newCustomer;
  };

  const updateCustomer = (id: string, updates: Partial<Customer>) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, ...updates } : c))
    );
    addToast({
      type: 'success',
      title: 'Customer updated',
      message: 'Account details saved successfully.',
    });
  };

  const deactivateCustomer = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === id ? { ...c, connectionStatus: 'disconnected' } : c))
    );
    setConnections((prev) =>
      prev.map((con) => (con.customerId === id ? { ...con, status: 'disconnected' } : con))
    );
    addToast({
      type: 'info',
      title: 'Customer account deactivated',
      message: 'Historical records remain preserved.',
    });
  };

  // Meter Readings
  const addMeterReading = (reading: {
    customerId: string;
    meterSerialNumber: string;
    currentReading: number;
    readingDate: string;
    period: string;
    notes?: string;
    imageUrl?: string;
  }) => {
    const cust = customers.find((c) => c.id === reading.customerId);
    if (!cust) return { success: false, error: 'Customer not found.' };

    const meter = meters.find((m) => m.serialNumber === reading.meterSerialNumber);
    const prevReading = meter ? meter.lastReading : 0;

    if (reading.currentReading < prevReading) {
      return {
        success: false,
        error: `Current dial reading (${reading.currentReading} m³) cannot be lower than the previous recorded reading (${prevReading} m³). Please check the meter dial or request meter replacement.`,
      };
    }

    const consumption = reading.currentReading - prevReading;
    const flag = consumption > 40 ? 'high_consumption' : 'normal';

    const newReading: MeterReading = {
      id: `rd-${Date.now()}`,
      customerId: cust.id,
      customerAccount: cust.accountNumber,
      customerName: cust.name,
      meterSerialNumber: reading.meterSerialNumber,
      previousReading: prevReading,
      currentReading: reading.currentReading,
      consumption,
      readingDate: reading.readingDate,
      period: reading.period,
      readerName: currentUser?.name || 'Meter Reader',
      status: 'pending_review',
      flag,
      notes: reading.notes,
      imageUrl: reading.imageUrl,
    };

    setReadings((prev) => [newReading, ...prev]);

    // Update meter last reading
    if (meter) {
      setMeters((prev) =>
        prev.map((m) =>
          m.id === meter.id ? { ...m, lastReading: reading.currentReading } : m
        )
      );
    }

    addToast({
      type: 'success',
      title: 'Meter reading recorded',
      message: `Consumption: ${consumption} m³ for ${cust.name}. Awaiting review.`,
    });

    return { success: true, reading: newReading };
  };

  const approveReading = (readingId: string) => {
    setReadings((prev) =>
      prev.map((r) => (r.id === readingId ? { ...r, status: 'approved' } : r))
    );
    addToast({
      type: 'success',
      title: 'Reading approved',
      message: 'Ready for inclusion in monthly billing run.',
    });
  };

  const rejectReading = (readingId: string, reason?: string) => {
    setReadings((prev) =>
      prev.map((r) =>
        r.id === readingId
          ? {
              ...r,
              status: 'rejected',
              notes: `${r.notes ? r.notes + ' - ' : ''}Rejected: ${reason || 'Dial recheck required'}`,
            }
          : r
      )
    );
    addToast({
      type: 'info',
      title: 'Reading marked as rejected',
      message: 'Flagged for technician reinspection.',
    });
  };

  // Billing Run
  const executeBillingRun = (period: string, targetZones: string[]) => {
    const exceptions: string[] = [];
    let generatedCount = 0;
    let totalBilled = 0;

    const newInvoices: Invoice[] = [];
    const updatedCustomers = [...customers];

    // Filter connections in target zones
    const eligibleConnections = connections.filter(
      (c) => c.status === 'active' && targetZones.includes(c.zone)
    );

    eligibleConnections.forEach((conn) => {
      // Check if invoice already exists for this period and customer
      const alreadyBilled = invoices.some(
        (inv) => inv.customerId === conn.customerId && inv.period === period
      );

      if (alreadyBilled) {
        exceptions.push(
          `${conn.customerName} (${conn.customerAccount}): Already billed for ${period}.`
        );
        return;
      }

      // Find approved reading for this period
      const reading = readings.find(
        (r) =>
          r.customerId === conn.customerId &&
          r.period === period &&
          r.status === 'approved'
      );

      if (!reading) {
        exceptions.push(
          `${conn.customerName} (${conn.customerAccount}): Missing approved reading for ${period}.`
        );
        return;
      }

      // Pick tariff
      const cust = updatedCustomers.find((c) => c.id === conn.customerId);
      if (!cust) return;

      const tariff =
        tariffs.find((t) => t.id === conn.tariffId) ||
        tariffs.find((t) => t.customerCategory === cust.customerType) ||
        tariffs[0];

      // Calculate consumption tier breakdown
      const consumption = reading.consumption;
      const breakdown: Invoice['breakdown'] = [];
      let remainingUnits = consumption;
      let consumptionCharge = 0;

      for (const band of tariff.bands) {
        if (remainingUnits <= 0) break;
        const bandCapacity = band.max !== null ? band.max - band.min : Infinity;
        const unitsInBand = Math.min(remainingUnits, bandCapacity);

        const amount = Math.round(unitsInBand * band.rate);
        breakdown.push({
          bandName: band.label,
          units: unitsInBand,
          rate: band.rate,
          amount,
        });

        consumptionCharge += amount;
        remainingUnits -= unitsInBand;
      }

      // Enforce minimum charge if consumption is low
      const billConsumptionCharge = Math.max(consumptionCharge, tariff.minimumCharge);
      const invoiceTotal = billConsumptionCharge + tariff.fixedCharge;

      // Due date 15 days later
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);

      const invNum = `INV-2026-0${100 + invoices.length + newInvoices.length + 1}`;
      const newInvoice: Invoice = {
        id: `inv-${Date.now()}-${newInvoices.length}`,
        invoiceNumber: invNum,
        customerId: cust.id,
        customerAccount: cust.accountNumber,
        customerName: cust.name,
        customerAddress: cust.address,
        customerZone: cust.zone,
        customerPhone: cust.phone,
        period,
        invoiceDate: new Date().toISOString().split('T')[0],
        dueDate: dueDate.toISOString().split('T')[0],
        previousReading: reading.previousReading,
        currentReading: reading.currentReading,
        consumption,
        tariffName: tariff.name,
        breakdown,
        fixedCharge: tariff.fixedCharge,
        totalAmount: invoiceTotal,
        amountPaid: 0,
        balance: invoiceTotal,
        status: 'unpaid',
      };

      newInvoices.push(newInvoice);
      generatedCount++;
      totalBilled += invoiceTotal;

      // Add to customer's outstanding balance
      cust.balance = (cust.balance || 0) + invoiceTotal;
    });

    if (newInvoices.length > 0) {
      setInvoices((prev) => [...newInvoices, ...prev]);
      setCustomers(updatedCustomers);

      // Audit log
      const log: AuditLog = {
        id: `aud-${Date.now()}`,
        timestamp: new Date().toLocaleString(),
        actor: currentUser?.name || 'Billing Officer',
        action: 'Executed Billing Run',
        entity: 'BillingRun',
        entityId: period,
        details: `Generated ${generatedCount} invoices totaling KSh ${totalBilled.toLocaleString()} for ${period}.`,
      };
      setAuditLogs((prev) => [log, ...prev]);

      addToast({
        type: 'success',
        title: 'Billing run completed!',
        message: `Generated ${generatedCount} invoices totaling KSh ${totalBilled.toLocaleString()}.`,
      });
    } else {
      addToast({
        type: 'info',
        title: 'No invoices generated',
        message: 'All eligible connections were either already billed or lacked approved readings.',
      });
    }

    return { generatedCount, totalBilled, exceptions };
  };

  const addTariff = (tariff: Omit<Tariff, 'id'>) => {
    const newTariff: Tariff = {
      ...tariff,
      id: `trf-${Date.now()}`,
    };
    setTariffs((prev) => [...prev, newTariff]);
    addToast({
      type: 'success',
      title: 'Tariff created',
      message: `${tariff.name} successfully configured.`,
    });
  };

  const updateTariff = (id: string, updates: Partial<Tariff>) => {
    setTariffs((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    );
    addToast({
      type: 'success',
      title: 'Tariff updated',
      message: 'New rates applied.',
    });
  };

  // Record Payment
  const recordPayment = (paymentData: {
    customerId: string;
    amount: number;
    paymentMethod: Payment['paymentMethod'];
    transactionReference: string;
    paymentDate: string;
    notes?: string;
    specificInvoiceNumber?: string;
  }): Payment => {
    const cust = customers.find((c) => c.id === paymentData.customerId);
    if (!cust) throw new Error('Customer not found');

    const receiptNum = `RCP-2026-0${420 + payments.length + 1}`;
    let remainingPayment = paymentData.amount;
    const allocatedInvoices: { invoiceNumber: string; amountAllocated: number }[] = [];

    // Find unpaid/partially paid invoices for customer
    const custInvoices = invoices.filter(
      (inv) => inv.customerId === cust.id && inv.balance > 0
    );

    const updatedInvoices = invoices.map((inv) => {
      if (inv.customerId !== cust.id || inv.balance <= 0 || remainingPayment <= 0) {
        return inv;
      }

      // If specific invoice chosen, prioritize it
      if (
        paymentData.specificInvoiceNumber &&
        inv.invoiceNumber !== paymentData.specificInvoiceNumber
      ) {
        return inv;
      }

      const alloc = Math.min(remainingPayment, inv.balance);
      remainingPayment -= alloc;

      allocatedInvoices.push({
        invoiceNumber: inv.invoiceNumber,
        amountAllocated: alloc,
      });

      const newPaid = inv.amountPaid + alloc;
      const newBal = inv.balance - alloc;
      const newStatus: Invoice['status'] = newBal === 0 ? 'paid' : 'partially_paid';

      return {
        ...inv,
        amountPaid: newPaid,
        balance: newBal,
        status: newStatus,
        paymentHistory: [
          ...(inv.paymentHistory || []),
          {
            receiptNumber: receiptNum,
            amount: alloc,
            date: paymentData.paymentDate,
            method: paymentData.paymentMethod,
          },
        ],
      };
    });

    setInvoices(updatedInvoices);

    // Update customer balance
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === cust.id
          ? { ...c, balance: Math.max(0, c.balance - paymentData.amount) }
          : c
      )
    );

    const newPayment: Payment = {
      id: `pay-${Date.now()}`,
      receiptNumber: receiptNum,
      customerId: cust.id,
      customerAccount: cust.accountNumber,
      customerName: cust.name,
      amount: paymentData.amount,
      paymentMethod: paymentData.paymentMethod,
      transactionReference: paymentData.transactionReference,
      date: paymentData.paymentDate,
      status: 'completed',
      allocatedInvoices,
      receivingOfficer: currentUser?.name || 'Ivy Mwangi',
      notes: paymentData.notes,
      payerPhone: cust.phone,
    };

    setPayments((prev) => [newPayment, ...prev]);

    // Audit log
    const log: AuditLog = {
      id: `aud-${Date.now()}`,
      timestamp: new Date().toLocaleString(),
      actor: currentUser?.name || 'Billing Officer',
      action: 'Recorded Payment',
      entity: 'Payment',
      entityId: receiptNum,
      details: `Received KSh ${paymentData.amount.toLocaleString()} from ${cust.name} via ${paymentData.paymentMethod} (Ref: ${paymentData.transactionReference}).`,
    };
    setAuditLogs((prev) => [log, ...prev]);

    addToast({
      type: 'success',
      title: 'Payment recorded successfully!',
      message: `Receipt ${receiptNum} generated for KSh ${paymentData.amount.toLocaleString()}.`,
    });

    return newPayment;
  };

  // Faults
  const createFaultReport = (data: {
    category: FaultReport['category'];
    description: string;
    zone: string;
    landmark: string;
    priority: FaultReport['priority'];
    reporterName: string;
    reporterPhone: string;
    customerAccount?: string;
    imageUrl?: string;
  }): FaultReport => {
    const faultRef = `FLT-2026-0${50 + faults.length + 1}`;
    const newFault: FaultReport = {
      id: `flt-${Date.now()}`,
      faultReference: faultRef,
      category: data.category,
      reporterName: data.reporterName,
      reporterPhone: data.reporterPhone,
      customerAccount: data.customerAccount,
      description: data.description,
      zone: data.zone,
      landmark: data.landmark,
      priority: data.priority,
      dateReported: new Date().toLocaleString(),
      status: 'Open',
      imageUrl: data.imageUrl,
      history: [
        {
          status: 'Open',
          timestamp: new Date().toLocaleString(),
          actor: data.reporterName,
          comment: 'Fault reported into system.',
        },
      ],
    };

    setFaults((prev) => [newFault, ...prev]);

    // Add notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: `New Fault: ${data.category}`,
      message: `${data.reporterName} reported a fault in ${data.zone}.`,
      timestamp: new Date().toLocaleString(),
      read: false,
      linkTo: 'faults',
      type: 'fault',
    };
    setNotifications((prev) => [notif, ...prev]);

    addToast({
      type: 'success',
      title: 'Fault report submitted',
      message: `Reference ${faultRef} created. Maintenance dispatch notified.`,
    });

    return newFault;
  };

  const assignFaultTechnician = (
    faultId: string,
    technicianName: string,
    priority: FaultReport['priority']
  ) => {
    const fault = faults.find((f) => f.id === faultId);
    if (!fault) return;

    const woNum = `WO-2026-0${20 + workOrders.length + 1}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 2);

    const newWO: WorkOrder = {
      id: `wo-${Date.now()}`,
      workOrderNumber: woNum,
      faultReference: fault.faultReference,
      technicianName,
      location: `${fault.landmark}, ${fault.zone}`,
      priority,
      assignedDate: new Date().toISOString().split('T')[0],
      dueDate: dueDate.toISOString().split('T')[0],
      status: 'Assigned',
    };

    setWorkOrders((prev) => [newWO, ...prev]);

    setFaults((prev) =>
      prev.map((f) =>
        f.id === faultId
          ? {
              ...f,
              status: 'Assigned',
              assignedTechnician: technicianName,
              workOrderId: woNum,
              history: [
                ...f.history,
                {
                  status: 'Assigned',
                  timestamp: new Date().toLocaleString(),
                  actor: currentUser?.name || 'Admin',
                  comment: `Assigned work order ${woNum} to ${technicianName}.`,
                },
              ],
            }
          : f
      )
    );

    addToast({
      type: 'success',
      title: 'Work order assigned',
      message: `${woNum} assigned to technician ${technicianName}.`,
    });
  };

  const updateFaultStatus = (
    faultId: string,
    status: FaultReport['status'],
    actor: string,
    comment?: string
  ) => {
    setFaults((prev) =>
      prev.map((f) =>
        f.id === faultId
          ? {
              ...f,
              status,
              resolutionNotes: status === 'Resolved' || status === 'Completed' ? comment : f.resolutionNotes,
              history: [
                ...f.history,
                {
                  status,
                  timestamp: new Date().toLocaleString(),
                  actor,
                  comment,
                },
              ],
            }
          : f
      )
    );
    addToast({
      type: 'info',
      title: 'Fault status updated',
      message: `Status changed to ${status}.`,
    });
  };

  const completeWorkOrder = (
    workOrderId: string,
    workPerformed: string,
    resolutionDescription: string
  ) => {
    const wo = workOrders.find((w) => w.id === workOrderId);
    if (!wo) return;

    setWorkOrders((prev) =>
      prev.map((w) =>
        w.id === workOrderId
          ? {
              ...w,
              status: 'Completed',
              workPerformed,
              resolutionDescription,
              completionDate: new Date().toISOString().split('T')[0],
            }
          : w
      )
    );

    // Update corresponding fault
    setFaults((prev) =>
      prev.map((f) =>
        f.faultReference === wo.faultReference
          ? {
              ...f,
              status: 'Completed',
              resolutionNotes: `${workPerformed}. ${resolutionDescription}`,
              history: [
                ...f.history,
                {
                  status: 'Completed',
                  timestamp: new Date().toLocaleString(),
                  actor: wo.technicianName,
                  comment: `Repairs completed: ${workPerformed}`,
                },
              ],
            }
          : f
      )
    );

    addToast({
      type: 'success',
      title: 'Work order completed',
      message: 'Repair logged and submitted for administrative verification.',
    });
  };

  // Assets
  const addAsset = (assetData: Omit<Asset, 'id' | 'assetId' | 'maintenanceHistory'>) => {
    const assetId = `AST-00${25 + assets.length + 1}`;
    const newAsset: Asset = {
      ...assetData,
      id: `ast-${Date.now()}`,
      assetId,
      maintenanceHistory: [],
    };
    setAssets((prev) => [newAsset, ...prev]);
    addToast({
      type: 'success',
      title: 'Asset registered',
      message: `${assetData.name} added to infrastructure register.`,
    });
  };

  const addAssetMaintenance = (
    assetId: string,
    record: Omit<Asset['maintenanceHistory'][0], 'id'>
  ) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === assetId
          ? {
              ...a,
              lastMaintenanceDate: record.date,
              maintenanceHistory: [
                { ...record, id: `m-${Date.now()}` },
                ...a.maintenanceHistory,
              ],
            }
          : a
      )
    );
    addToast({
      type: 'success',
      title: 'Maintenance recorded',
      message: 'Service log updated.',
    });
  };

  // Announcements
  const addAnnouncement = (announcementData: Omit<Announcement, 'id'>) => {
    const newAnc: Announcement = {
      ...announcementData,
      id: `anc-${Date.now()}`,
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    addToast({
      type: 'success',
      title: 'Announcement broadcasted',
      message: `Published to ${announcementData.audience}.`,
    });
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Reset demo
  const resetToDemoData = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setCustomers(INITIAL_CUSTOMERS);
    setConnections(INITIAL_CONNECTIONS);
    setMeters(INITIAL_METERS);
    setReadings(INITIAL_READINGS);
    setTariffs(INITIAL_TARIFFS);
    setInvoices(INITIAL_INVOICES);
    setPayments(INITIAL_PAYMENTS);
    setFaults(INITIAL_FAULTS);
    setWorkOrders(INITIAL_WORK_ORDERS);
    setAssets(INITIAL_ASSETS);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setNotifications(INITIAL_NOTIFICATIONS);
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setPortalMode('staff');
    setActiveNavPage('overview');
    addToast({
      type: 'info',
      title: 'System reset',
      message: 'Restored pre-seeded demonstration database.',
    });
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        portalMode,
        setPortalMode,
        activeNavPage,
        setActiveNavPage,
        customerPortalPage,
        setCustomerPortalPage,
        sidebarCollapsed,
        setSidebarCollapsed,
        searchOpen,
        setSearchOpen,
        selectedCustomerId,
        setSelectedCustomerId,
        selectedInvoice,
        setSelectedInvoice,
        selectedReceipt,
        setSelectedReceipt,
        users,
        customers,
        connections,
        meters,
        readings,
        tariffs,
        invoices,
        payments,
        faults,
        workOrders,
        assets,
        announcements,
        notifications,
        auditLogs,
        toasts,
        addToast,
        removeToast,
        login,
        logout,
        switchUser,
        addUser,
        removeUser,
        addCustomer,
        updateCustomer,
        deactivateCustomer,
        addMeterReading,
        approveReading,
        rejectReading,
        executeBillingRun,
        addTariff,
        updateTariff,
        recordPayment,
        createFaultReport,
        updateFaultStatus,
        assignFaultTechnician,
        completeWorkOrder,
        addAsset,
        addAssetMaintenance,
        addAnnouncement,
        markNotificationRead,
        markAllNotificationsRead,
        resetToDemoData,
      }}
    >
      
      {children}
    </AppContext.Provider>

    
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
