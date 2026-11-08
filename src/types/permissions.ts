import { NavPage } from '../context/AppContext';
import { UserRole } from '../types';

// Pages each staff role is permitted to access.
const rolePermissions: Record<UserRole, NavPage[]> = {
  admin: [
    'overview',
    'customers',
    'customer_detail',
    'add_customer',
    'connections',
    'readings',
    'billing',
    'payments',
    'faults',
    'infrastructure',
    'reports',
    'announcements',
    'users',
    'audit_logs',
    'settings',
  ],

  billing_officer: [
    'overview',
    'customers',
    'customer_detail',
    'add_customer',
    'connections',
    'billing',
    'payments',
    'faults',
  ],

  reader: [
    'overview',
    'customers',
    'customer_detail',
    'connections',
    'readings',
  ],

  staff: [
    'overview',
    'customers',
    'customer_detail',
    'faults',
  ],

  technician: [
    'overview',
    'connections',
    'faults',
    'infrastructure',
  ],

  customer: [],
};

// Check whether a role can open a particular page.
export const canAccessPage = (
  role: UserRole,
  page: NavPage
): boolean => {
  return rolePermissions[role]?.includes(page) ?? false;
};

// Only administrators can see the Management sidebar group.
export const canAccessManagement = (role: UserRole): boolean => {
  return role === 'admin';
};