
import React from 'react';
import { useApp } from '../context/AppContext';
import type { NavPage } from '../context/AppContext';
import { canAccessPage, canAccessManagement } from '../types/permissions';

import {
  LayoutDashboard,
  Users,
  GitFork,
  Gauge,
  Receipt,
  CreditCard,
  Wrench,
  Building2,
  BarChart3,
  Megaphone,
  UserCheck,
  History,
  Settings,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface NavItem {
  id: NavPage;
  label: string;
  icon: React.ElementType;
  badgeCount?: number;
}

export const AppSidebar: React.FC = () => {
  const {
    currentUser,
    activeNavPage,
    setActiveNavPage,
    sidebarCollapsed,
    setSidebarCollapsed,
    faults,
    readings,
    invoices,
  } = useApp();

  // Current user's role
  const userRole = currentUser?.role;

  // Notification counts
  const openFaultsCount = faults.filter(
    (fault) => fault.status !== 'Resolved' && fault.status !== 'Closed'
  ).length;

  const pendingReadingsCount = readings.filter(
    (reading) => reading.status === 'pending_review'
  ).length;

  const unpaidInvoicesCount = invoices.filter(
    (invoice) => invoice.balance > 0
  ).length;

  // Overview navigation
  const overviewItems: NavItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: LayoutDashboard,
    },
  ];

  // Water operations navigation
  const waterOperationItems: NavItem[] = [
    {
      id: 'customers',
      label: 'Customers',
      icon: Users,
    },
    {
      id: 'connections',
      label: 'Connections & Meters',
      icon: GitFork,
    },
    {
      id: 'readings',
      label: 'Meter Readings',
      icon: Gauge,
      badgeCount:
        pendingReadingsCount > 0 ? pendingReadingsCount : undefined,
    },
    {
      id: 'billing',
      label: 'Billing & Invoices',
      icon: Receipt,
      badgeCount:
        unpaidInvoicesCount > 0 ? unpaidInvoicesCount : undefined,
    },
    {
      id: 'payments',
      label: 'Payments',
      icon: CreditCard,
    },
    {
      id: 'faults',
      label: 'Fault Reports',
      icon: Wrench,
      badgeCount:
        openFaultsCount > 0 ? openFaultsCount : undefined,
    },
    {
      id: 'infrastructure',
      label: 'Infrastructure',
      icon: Building2,
    },
  ];

  // Management navigation
  const managementItems: NavItem[] = [
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3,
    },
    {
      id: 'announcements',
      label: 'Announcements',
      icon: Megaphone,
    },
    {
      id: 'users',
      label: 'User Management',
      icon: UserCheck,
    },
    {
      id: 'audit_logs',
      label: 'Audit Logs',
      icon: History,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  // Apply role-based navigation filtering
  const visibleOverviewItems = overviewItems.filter(
    (item) => userRole && canAccessPage(userRole, item.id)
  );

  const visibleWaterOperationItems = waterOperationItems.filter(
    (item) => userRole && canAccessPage(userRole, item.id)
  );

  // Only administrators see Management
  const visibleManagementItems =
    userRole && canAccessManagement(userRole)
      ? managementItems.filter(
          (item) => canAccessPage(userRole, item.id)
        )
      : [];

  // Render a navigation group
  const renderNavGroup = (title: string, items: NavItem[]) => (
    <div className="mb-5">
      {!sidebarCollapsed && (
        <h4 className="px-3.5 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 select-none">
          {title}
        </h4>
      )}

      <div className="space-y-0.5">
        {items.map((item) => {
          const Icon = item.icon;

          const isSelected =
            activeNavPage === item.id ||
            (item.id === 'customers' &&
              (activeNavPage === 'customer_detail' ||
                activeNavPage === 'add_customer'));

          return (
            <button
              key={item.id}
              onClick={() => setActiveNavPage(item.id)}
              title={sidebarCollapsed ? item.label : undefined}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-colors duration-150 relative ${
                isSelected
                  ? 'bg-[#E6F3F3] text-[#164E63] border-l-[3px] border-[#399D9D]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              } ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
            >
              <Icon
                className={`w-5 h-5 shrink-0 ${
                  isSelected ? 'text-[#399D9D]' : 'text-slate-500'
                }`}
              />

              {!sidebarCollapsed && (
                <span className="truncate flex-1 text-left">
                  {item.label}
                </span>
              )}

              {!sidebarCollapsed && item.badgeCount !== undefined && (
                <span
                  className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full tabular-nums ${
                    isSelected
                      ? 'bg-[#399D9D] text-white'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {item.badgeCount}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <aside
      className={`bg-[#EDF5F4] border-r border-[#DCE8E6] flex flex-col transition-all duration-200 z-30 select-none shrink-0 no-print ${
        sidebarCollapsed ? 'w-[76px]' : 'w-[250px]'
      }`}
    >
      {/* Brand Header */}
      <div className="h-[72px] px-4 flex items-center justify-between border-b border-[#DCE8E6]">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-[#164E63] flex items-center justify-center p-2 shrink-0 shadow-xs">
            <img
              src="/assets/aistudio/image_0d358796.png"
              alt="Kikuyu Water Logo"
              className="w-full h-full object-contain filter brightness-110"
            />
          </div>

          {!sidebarCollapsed && (
            <div className="min-w-0">
              <h2 className="text-sm font-extrabold text-[#164E63] tracking-tight truncate leading-tight">
                Kikuyu Water
              </h2>
              <span className="text-[10px] text-[#399D9D] font-semibold block truncate">
                Community Management
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 transition-colors"
          title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-4 h-4" />
          ) : (
            <ChevronLeft className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto px-3 py-4">
        {visibleOverviewItems.length > 0 &&
          renderNavGroup('Overview', visibleOverviewItems)}

        {visibleWaterOperationItems.length > 0 &&
          renderNavGroup('Water Operations', visibleWaterOperationItems)}

        {visibleManagementItems.length > 0 &&
          renderNavGroup('Management', visibleManagementItems)}
      </div>
    </aside>
  );
};
