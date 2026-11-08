import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { InvoiceModal } from '../components/InvoiceModal';
import {
  Receipt,
  FileCheck2,
  Sliders,
  Play,
  Search,
  FilterX,
  CreditCard,
  Printer,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  Download,
} from 'lucide-react';
import { ZONES } from '../data/mockData';
import { Invoice, Tariff } from '../types';

export const BillingPage: React.FC = () => {
  const {
    invoices,
    tariffs,
    readings,
    connections,
    executeBillingRun,
    setSelectedInvoice,
    setActiveNavPage,
    addTariff,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'invoices' | 'tariffs' | 'billing_runs'>('invoices');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');

  // Billing Run modal / interactive state
  const [runModalOpen, setRunModalOpen] = useState(false);
  const [runPeriod, setRunPeriod] = useState('November 2026');
  const [runZones, setRunZones] = useState<string[]>(ZONES);
  const [runResult, setRunResult] = useState<{
    generatedCount: number;
    totalBilled: number;
    exceptions: string[];
  } | null>(null);

  // New Tariff modal
  const [tariffModalOpen, setTariffModalOpen] = useState(false);
  const [newTariffName, setNewTariffName] = useState('');
  const [newTariffCat, setNewTariffCat] = useState<'Household' | 'Business' | 'Institution'>('Household');
  const [newFixedCharge, setNewFixedCharge] = useState(150);
  const [newMinCharge, setNewMinCharge] = useState(200);

  // Computed Summaries
  const totalBilled = invoices.reduce((s, inv) => s + inv.totalAmount, 0);
  const totalCollected = invoices.reduce((s, inv) => s + inv.amountPaid, 0);
  const totalOutstanding = invoices.reduce((s, inv) => s + inv.balance, 0);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (periodFilter !== 'all' && inv.period !== periodFilter) return false;
      if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
      if (zoneFilter !== 'all' && inv.customerZone !== zoneFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (
          !inv.invoiceNumber.toLowerCase().includes(q) &&
          !inv.customerName.toLowerCase().includes(q) &&
          !inv.customerAccount.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [invoices, periodFilter, statusFilter, zoneFilter, searchTerm]);

  // Billing run metrics preview
  const eligibleConnectionsCount = connections.filter((c) => c.status === 'active').length;
  const approvedReadingsNov = readings.filter(
    (r) => r.period === runPeriod && r.status === 'approved'
  ).length;

  const handleStartRun = () => {
    const res = executeBillingRun(runPeriod, runZones);
    setRunResult(res);
  };

  const handleCreateTariff = (e: React.FormEvent) => {
    e.preventDefault();
    addTariff({
      name: newTariffName || 'Custom Scheme Tariff',
      customerCategory: newTariffCat,
      description: 'Community tariff with tiered consumption bands.',
      billingUnit: 'm³',
      minimumCharge: newMinCharge,
      fixedCharge: newFixedCharge,
      status: 'active',
      effectiveFrom: new Date().toISOString().split('T')[0],
      bands: [
        { min: 0, max: 6, rate: 65, label: '0–6 m³ (Lifeline)' },
        { min: 6.01, max: 20, rate: 90, label: '7–20 m³ (Standard)' },
        { min: 20.01, max: null, rate: 135, label: 'Above 20 m³ (Excess)' },
      ],
    });
    setTariffModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Water Operations', 'Billing & Invoices']}
        title="Billing & Invoices"
        description="Issue monthly water bills, execute billing runs based on approved meter readings, and manage water tariffs."
        primaryAction={{
          label: 'Start Billing Run',
          icon: <Play className="w-4 h-4" />,
          onClick: () => {
            setRunResult(null);
            setRunModalOpen(true);
          },
        }}
      />

      {/* Top 4 Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Total Invoices Issued
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums block mt-1">
            {invoices.length}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-[#164E63] uppercase tracking-wider block">
            Total Billed
          </span>
          <span className="text-2xl font-bold font-mono text-[#164E63] tabular-nums block mt-1">
            KSh {totalBilled.toLocaleString()}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            Amount Collected
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums block mt-1">
            KSh {totalCollected.toLocaleString()}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
            Outstanding Arrears
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums block mt-1">
            KSh {totalOutstanding.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#EDF5F4] rounded-xl max-w-md">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'invoices'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-4 h-4 text-[#399D9D]" />
          <span>Invoices ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('tariffs')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'tariffs'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sliders className="w-4 h-4 text-[#399D9D]" />
          <span>Tariff Schedules ({tariffs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('billing_runs')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'billing_runs'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-[#399D9D]" />
          <span>Billing Runs</span>
        </button>
      </div>

      {/* TAB 1: INVOICES TABLE */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          {/* Filters Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search invoice number, customer or account..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={periodFilter}
                onChange={(e) => setPeriodFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
              >
                <option value="all">All Periods</option>
                <option value="November 2026">November 2026</option>
                <option value="October 2026">October 2026</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
              >
                <option value="all">All Statuses</option>
                <option value="paid">Paid</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="unpaid">Unpaid</option>
              </select>

              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
              >
                <option value="all">All Zones</option>
                {ZONES.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Account</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4 text-right">Invoice Total</th>
                    <th className="py-3 px-4 text-right">Amount Paid</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#FAF8F1] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {inv.customerName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {inv.customerAccount}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-700">
                        {inv.period}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums text-slate-900">
                        KSh {inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono tabular-nums text-emerald-700">
                        KSh {inv.amountPaid.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                        {inv.balance > 0 ? (
                          <span className="text-rose-600">
                            KSh {inv.balance.toLocaleString()}
                          </span>
                        ) : (
                          <span className="text-slate-400">KSh 0</span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {inv.dueDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={inv.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedInvoice(inv)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D4EBEA] rounded-lg transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Printer className="w-3 h-3" />
                          <span>View PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TARIFF MANAGEMENT */}
      {activeTab === 'tariffs' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-[#164E63]">
                Community Water Tariff Schedules
              </h3>
              <p className="text-xs text-slate-500">
                Tiered volume bands that incentivize conservation while keeping baseline lifeline water affordable.
              </p>
            </div>
            <button
              onClick={() => setTariffModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Configure Tariff</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {tariffs.map((tariff) => (
              <div
                key={tariff.id}
                className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {tariff.name}
                    </span>
                    <StatusBadge status={tariff.status} size="sm" />
                  </div>
                  <span className="text-[11px] font-semibold text-[#399D9D] uppercase tracking-wider block mb-2">
                    {tariff.customerCategory} Category
                  </span>
                  <p className="text-xs text-slate-600 mb-4 leading-relaxed">
                    {tariff.description}
                  </p>

                  <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6] text-xs space-y-1 mb-4">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Fixed Meter Rent:</span>
                      <span className="font-mono font-bold text-slate-900">
                        KSh {tariff.fixedCharge} / month
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Minimum Bill:</span>
                      <span className="font-mono font-bold text-slate-900">
                        KSh {tariff.minimumCharge}
                      </span>
                    </div>
                  </div>

                  {/* Bands */}
                  <div className="space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                      Consumption Bands
                    </span>
                    {tariff.bands.map((band, idx) => (
                      <div
                        key={idx}
                        className="flex justify-between text-xs py-1 border-b border-slate-100"
                      >
                        <span className="text-slate-700">{band.label}</span>
                        <span className="font-mono font-bold text-[#164E63]">
                          KSh {band.rate} / m³
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Effective from: {tariff.effectiveFrom}</span>
                  <span className="text-[#399D9D] font-bold">Standard Tiered</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: BILLING RUNS WORKFLOW */}
      {activeTab === 'billing_runs' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-base font-bold text-[#164E63]">
                  Automated Billing Run Engine
                </h3>
                <p className="text-xs text-slate-600 mt-1 max-w-xl">
                  Batch processes all approved meter readings, calculates tiered consumption, applies meter service fees, and generates non-duplicate invoices for the selected period.
                </p>
              </div>

              <button
                onClick={() => {
                  setRunResult(null);
                  setRunModalOpen(true);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-md min-h-[44px] shrink-0"
              >
                <Play className="w-4 h-4" />
                <span>Start Billing Run</span>
              </button>
            </div>

            {/* Status Checklist Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100 text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Eligible Active Connections</span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                  {eligibleConnectionsCount} accounts
                </span>
                <span className="text-[11px] text-emerald-700 font-medium mt-1 block">
                  ✓ Ready for billing
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Approved Readings for Nov 2026</span>
                <span className="text-xl font-bold font-mono text-slate-900 mt-1 block">
                  {approvedReadingsNov} readings
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Pending readings must be reviewed first
                </span>
              </div>

              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Duplicate Protection</span>
                <span className="text-xl font-bold font-mono text-emerald-700 mt-1 block">
                  Enforced
                </span>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Connections billed once per cycle
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Start Billing Run Modal */}
      {runModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#164E63] mb-1">
              Start Monthly Billing Run
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Select the billing cycle and community zones to generate invoices.
            </p>

            {!runResult ? (
              <div className="space-y-4 text-xs">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Billing Period
                  </label>
                  <select
                    value={runPeriod}
                    onChange={(e) => setRunPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-semibold"
                  >
                    <option value="November 2026">November 2026</option>
                    <option value="October 2026">October 2026</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Target Community Zones ({runZones.length} selected)
                  </label>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto p-2 bg-[#FAF8F1] rounded-xl border border-slate-200">
                    {ZONES.map((zone) => (
                      <label
                        key={zone}
                        className="flex items-center gap-2 p-1 text-xs text-slate-700 cursor-pointer select-none"
                      >
                        <input
                          type="checkbox"
                          checked={runZones.includes(zone)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setRunZones([...runZones, zone]);
                            } else {
                              setRunZones(runZones.filter((z) => z !== zone));
                            }
                          }}
                          className="w-4 h-4 rounded text-[#399D9D] focus:ring-[#399D9D]"
                        />
                        <span>{zone}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-800 text-[11px] leading-relaxed">
                  <strong>Notice:</strong> Only connections with <strong>Approved</strong> meter readings in the selected period will be billed. Unread meters will be highlighted in the exception list.
                </div>

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                  <button
                    onClick={() => setRunModalOpen(false)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleStartRun}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm flex items-center gap-1.5"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Execute Billing Run</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4 text-xs animate-in fade-in">
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-center">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-1" />
                  <h4 className="text-sm font-bold text-emerald-900">
                    Billing Run Completed
                  </h4>
                  <p className="text-xs text-emerald-800 mt-1">
                    Generated <strong className="font-mono">{runResult.generatedCount}</strong> invoices totaling{' '}
                    <strong className="font-mono">KSh {runResult.totalBilled.toLocaleString()}</strong>.
                  </p>
                </div>

                {runResult.exceptions.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">
                      Exceptions & Skipped Accounts ({runResult.exceptions.length})
                    </span>
                    <div className="max-h-36 overflow-y-auto space-y-1 p-2 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 font-mono">
                      {runResult.exceptions.map((ex, idx) => (
                        <div key={idx}>· {ex}</div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="pt-3 border-t border-slate-200 flex items-center justify-end">
                  <button
                    onClick={() => {
                      setRunModalOpen(false);
                      setActiveTab('invoices');
                    }}
                    className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px]"
                  >
                    View Generated Invoices
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Tariff Modal */}
      {tariffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#164E63] mb-1">
              Add Community Tariff
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Define customer category and base tariff pricing structures.
            </p>

            <form onSubmit={handleCreateTariff} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tariff Name
                </label>
                <input
                  type="text"
                  required
                  value={newTariffName}
                  onChange={(e) => setNewTariffName(e.target.value)}
                  placeholder="e.g. Commercial Horticulture Tariff"
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Category
                </label>
                <select
                  value={newTariffCat}
                  onChange={(e) => setNewTariffCat(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                >
                  <option value="Household">Household</option>
                  <option value="Business">Business</option>
                  <option value="Institution">Institution</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fixed Meter Rent (KSh)
                  </label>
                  <input
                    type="number"
                    value={newFixedCharge}
                    onChange={(e) => setNewFixedCharge(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Minimum Charge (KSh)
                  </label>
                  <input
                    type="number"
                    value={newMinCharge}
                    onChange={(e) => setNewMinCharge(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTariffModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm"
                >
                  Save Tariff
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
