import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { ConfirmDialog } from '../components/ConfirmDialog';
import {
  UserPlus,
  Download,
  Search,
  FilterX,
  MoreVertical,
  Eye,
  Edit2,
  FileText,
  CreditCard,
  UserX,
  Phone,
} from 'lucide-react';
import { ZONES } from '../data/mockData';

export const CustomersPage: React.FC = () => {
  const {
    customers,
    meters,
    setActiveNavPage,
    setSelectedCustomerId,
    deactivateCustomer,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Deactivate dialog
  const [deactivateId, setDeactivateId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Summary counts
  const totalCount = customers.length;
  const activeCount = customers.filter((c) => c.connectionStatus === 'active').length;
  const pendingCount = customers.filter((c) => c.connectionStatus === 'pending').length;
  const inactiveCount = customers.filter(
    (c) => c.connectionStatus === 'suspended' || c.connectionStatus === 'disconnected'
  ).length;

  // Filtered customer list
  const filteredCustomers = useMemo(() => {
    return customers.filter((c) => {
      // Search
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const matchesName = c.name.toLowerCase().includes(q);
        const matchesAccount = c.accountNumber.toLowerCase().includes(q);
        const matchesPhone = c.phone.includes(q);
        const meter = meters.find((m) => m.customerId === c.id);
        const matchesMeter = meter ? meter.serialNumber.toLowerCase().includes(q) : false;

        if (!matchesName && !matchesAccount && !matchesPhone && !matchesMeter) {
          return false;
        }
      }

      // Zone
      if (zoneFilter !== 'all' && c.zone !== zoneFilter) return false;

      // Type
      if (typeFilter !== 'all' && c.customerType !== typeFilter) return false;

      // Status
      if (statusFilter !== 'all' && c.connectionStatus !== statusFilter) return false;

      return true;
    });
  }, [customers, meters, searchTerm, zoneFilter, typeFilter, statusFilter]);

  const handleExportCSV = () => {
    const headers = ['Account Number', 'Customer Name', 'Phone', 'Type', 'Zone', 'Status', 'Balance (KSh)', 'Registered Date'];
    const rows = filteredCustomers.map((c) => [
      c.accountNumber,
      `"${c.name}"`,
      c.phone,
      c.customerType,
      `"${c.zone}"`,
      c.connectionStatus,
      c.balance,
      c.registeredDate,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kikuyu_water_customers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearFilters = () => {
    setSearchTerm('');
    setZoneFilter('all');
    setTypeFilter('all');
    setStatusFilter('all');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Water Operations', 'Customers']}
        title="Customers"
        description="View and manage registered customers, household connections, and water service accounts."
        primaryAction={{
          label: '+ Add Customer',
          icon: <UserPlus className="w-4 h-4" />,
          onClick: () => setActiveNavPage('add_customer'),
        }}
        secondaryActions={[
          {
            label: 'Export CSV',
            icon: <Download className="w-4 h-4" />,
            onClick: handleExportCSV,
          },
        ]}
      />

      {/* Summary Row: 4 Small Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          onClick={() => setStatusFilter('all')}
          className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs cursor-pointer hover:border-[#399D9D]/50 transition-colors"
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            All Customers
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums block mt-1">
            {totalCount}
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('active')}
          className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs cursor-pointer hover:border-emerald-300 transition-colors"
        >
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            Active Accounts
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums block mt-1">
            {activeCount}
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('pending')}
          className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs cursor-pointer hover:border-amber-300 transition-colors"
        >
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
            Pending Connections
          </span>
          <span className="text-2xl font-bold font-mono text-amber-700 tabular-nums block mt-1">
            {pendingCount}
          </span>
        </div>

        <div
          onClick={() => setStatusFilter('disconnected')}
          className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs cursor-pointer hover:border-slate-400 transition-colors"
        >
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Inactive / Suspended
          </span>
          <span className="text-2xl font-bold font-mono text-slate-600 tabular-nums block mt-1">
            {inactiveCount}
          </span>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, account (KIK-...), phone or meter..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
          />
        </div>

        {/* Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Zone */}
          <select
            value={zoneFilter}
            onChange={(e) => setZoneFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
          >
            <option value="all">All Community Zones</option>
            {ZONES.map((z) => (
              <option key={z} value={z}>
                {z}
              </option>
            ))}
          </select>

          {/* Type */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
          >
            <option value="all">All Types</option>
            <option value="Household">Household</option>
            <option value="Business">Business</option>
            <option value="Institution">Institution</option>
          </select>

          {/* Status */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
            <option value="disconnected">Disconnected</option>
          </select>

          {(searchTerm || zoneFilter !== 'all' || typeFilter !== 'all' || statusFilter !== 'all') && (
            <button
              onClick={clearFilters}
              title="Clear all filters"
              className="p-2.5 text-slate-500 hover:text-rose-600 hover:bg-slate-100 rounded-[10px] border border-slate-200 transition-colors"
            >
              <FilterX className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Customers Table Card */}
      <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
        {filteredCustomers.length === 0 ? (
          <EmptyState
            state="searching"
            title="No customers found"
            description="No customer records match your current search criteria or active filters."
            action={{
              label: 'Clear filters',
              onClick: clearFilters,
            }}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold sticky top-0">
                  <th className="py-3 px-4 w-[130px]">Account</th>
                  <th className="py-3 px-4 w-[220px]">Customer</th>
                  <th className="py-3 px-4 w-[140px]">Phone</th>
                  <th className="py-3 px-4 w-[130px]">Zone</th>
                  <th className="py-3 px-4 w-[120px]">Status</th>
                  <th className="py-3 px-4 w-[140px] text-right">Balance</th>
                  <th className="py-3 px-4 w-[120px]">Registered</th>
                  <th className="py-3 px-4 w-[70px] text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCustomers.map((cust) => {
                  const initials = cust.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')
                    .substring(0, 2);

                  return (
                    <tr
                      key={cust.id}
                      onClick={() => {
                        setSelectedCustomerId(cust.id);
                        setActiveNavPage('customer_detail');
                      }}
                      className="hover:bg-[#FAF8F1]/80 transition-colors cursor-pointer group"
                    >
                      {/* Account */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                        {cust.accountNumber}
                      </td>

                      {/* Customer */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#E6F3F3] text-[#164E63] font-bold text-[11px] flex items-center justify-center shrink-0">
                            {initials}
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 block truncate group-hover:text-[#399D9D] transition-colors">
                              {cust.name}
                            </span>
                            <span className="text-[10px] text-slate-400 block truncate">
                              {cust.customerType} · {cust.village}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Phone */}
                      <td className="py-3.5 px-4 text-slate-600 font-mono">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{cust.phone}</span>
                        </span>
                      </td>

                      {/* Zone */}
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[140px]">
                        {cust.zone.split(':')[0]}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <StatusBadge status={cust.connectionStatus} size="sm" />
                      </td>

                      {/* Balance */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                        {cust.balance > 0 ? (
                          <span className="text-rose-700">
                            KSh {cust.balance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-emerald-700">KSh 0</span>
                        )}
                      </td>

                      {/* Registered */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono">
                        {cust.registeredDate}
                      </td>

                      {/* Actions Menu */}
                      <td
                        className="py-3.5 px-4 text-center relative"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="relative inline-block text-left">
                          <button
                            onClick={() =>
                              setActiveMenuId(activeMenuId === cust.id ? null : cust.id)
                            }
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </button>

                          {activeMenuId === cust.id && (
                            <>
                              <div
                                className="fixed inset-0 z-30"
                                onClick={() => setActiveMenuId(null)}
                              />
                              <div className="absolute right-0 top-8 z-40 w-44 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-xs text-left animate-in fade-in">
                                <button
                                  onClick={() => {
                                    setSelectedCustomerId(cust.id);
                                    setActiveNavPage('customer_detail');
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                                  <span>View Profile</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedCustomerId(cust.id);
                                    setActiveNavPage('billing');
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                                  <span>View Invoices</span>
                                </button>

                                <button
                                  onClick={() => {
                                    setSelectedCustomerId(cust.id);
                                    setActiveNavPage('payments');
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-slate-50 flex items-center gap-2 text-slate-700"
                                >
                                  <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                                  <span>View Payments</span>
                                </button>

                                <div className="border-t border-slate-100 my-1" />

                                <button
                                  onClick={() => {
                                    setDeactivateId(cust.id);
                                    setActiveMenuId(null);
                                  }}
                                  className="w-full px-3 py-2 hover:bg-rose-50 flex items-center gap-2 text-rose-600"
                                >
                                  <UserX className="w-3.5 h-3.5" />
                                  <span>Deactivate Account</span>
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer pagination info */}
        <div className="px-6 py-4 bg-slate-50/70 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>
            Showing <strong className="text-slate-800">{filteredCustomers.length}</strong> of{' '}
            <strong className="text-slate-800">{totalCount}</strong> registered customers
          </span>
          <span className="font-mono text-[11px] text-slate-400">
            Kikuyu Community Water Scheme Directory
          </span>
        </div>
      </div>

      {/* Confirmation Dialog for Deactivation */}
      <ConfirmDialog
        isOpen={Boolean(deactivateId)}
        title="Deactivate customer account?"
        message="This will prevent the customer account from being used for new transactions. Historical invoices, payments, and meter records will remain fully preserved in audit logs."
        confirmLabel="Deactivate Customer"
        onConfirm={() => {
          if (deactivateId) {
            deactivateCustomer(deactivateId);
            setDeactivateId(null);
          }
        }}
        onCancel={() => setDeactivateId(null)}
      />
    </div>
  );
};
