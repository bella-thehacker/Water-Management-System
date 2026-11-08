import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/MetricCard';
import {
  Users,
  Wallet,
  Receipt,
  Wrench,
  RotateCw,
  UserPlus,
  Gauge,
  FileCheck2,
  CreditCard,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const {
    currentUser,
    customers,
    invoices,
    payments,
    faults,
    readings,
    setActiveNavPage,
    setSelectedCustomerId,
  } = useApp();

  const [period, setPeriod] = useState('October 2026');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Dynamic calculations from database
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter((c) => c.connectionStatus === 'active').length;

  const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
  const outstandingBalances = customers.reduce((sum, c) => sum + c.balance, 0);
  const unpaidInvoicesCount = invoices.filter((inv) => inv.balance > 0).length;

  const openFaults = faults.filter((f) => f.status !== 'Resolved' && f.status !== 'Closed');
  const criticalFaults = openFaults.filter((f) => f.priority === 'Critical').length;

  // Monthly consumption aggregate for line chart
  const consumptionTrend = [
    { month: 'Jun', usage: 185 },
    { month: 'Jul', usage: 198 },
    { month: 'Aug', usage: 220 },
    { month: 'Sep', usage: 210 },
    { month: 'Oct', usage: 227 },
    { month: 'Nov (Proj)', usage: 235 },
  ];

  // Payment Breakdown
  const mpesaTotal = payments
    .filter((p) => p.paymentMethod === 'M-Pesa')
    .reduce((s, p) => s + p.amount, 0);
  const cashTotal = payments
    .filter((p) => p.paymentMethod === 'Cash')
    .reduce((s, p) => s + p.amount, 0);
  const bankTotal = payments
    .filter((p) => p.paymentMethod === 'Bank')
    .reduce((s, p) => s + p.amount, 0);

  const mpesaPct = totalCollected > 0 ? Math.round((mpesaTotal / totalCollected) * 100) : 0;
  const cashPct = totalCollected > 0 ? Math.round((cashTotal / totalCollected) * 100) : 0;
  const bankPct = totalCollected > 0 ? Math.round((bankTotal / totalCollected) * 100) : 0;

  // Fault breakdown
  const faultCounts = {
    open: faults.filter((f) => f.status === 'Open').length,
    assigned: faults.filter((f) => f.status === 'Assigned').length,
    inProgress: faults.filter((f) => f.status === 'In Progress').length,
    resolved: faults.filter((f) => f.status === 'Resolved' || f.status === 'Completed').length,
  };
  const totalFaultsCount = Math.max(1, faults.length);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 500);
  };

  const firstName = currentUser?.name ? currentUser.name.split(' ')[0] : 'Officer';

  return (
    <div className="space-y-6">
      {/* Top Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#164E63] tracking-tight">
            Good morning, {firstName}!
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Here's what's happening across your community water scheme today.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-500 hidden md:inline">
            Sunday, 8 Nov 2026
          </span>
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="text-xs font-semibold text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 shadow-2xs focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
          >
            <option value="November 2026">November 2026</option>
            <option value="October 2026">October 2026</option>
            <option value="September 2026">September 2026</option>
          </select>
          <button
            onClick={handleRefresh}
            title="Refresh dashboard metrics"
            className="p-2 bg-white border border-[#CBD5E1] rounded-[10px] text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <RotateCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-[#399D9D]' : ''}`} />
          </button>
        </div>
      </div>

      {/* KPI Row: 4 Equal Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Customers"
          value={totalCustomers}
          subtitle={`${activeCustomers} active meter connections`}
          icon={Users}
          iconBgColor="bg-[#E6F3F3]"
          iconColor="text-[#399D9D]"
          onClick={() => setActiveNavPage('customers')}
        />

        <MetricCard
          title="Revenue Collected"
          value={`KSh ${totalCollected.toLocaleString()}`}
          subtitle={`${payments.length} verified transactions`}
          icon={Wallet}
          iconBgColor="bg-emerald-50"
          iconColor="text-emerald-600"
          onClick={() => setActiveNavPage('payments')}
        />

        <MetricCard
          title="Outstanding Balances"
          value={`KSh ${outstandingBalances.toLocaleString()}`}
          subtitle={`${unpaidInvoicesCount} invoices pending payment`}
          icon={Receipt}
          iconBgColor="bg-amber-50"
          iconColor="text-amber-600"
          onClick={() => setActiveNavPage('billing')}
        />

        <MetricCard
          title="Open Faults"
          value={openFaults.length}
          subtitle={
            criticalFaults > 0
              ? `${criticalFaults} critical requiring emergency dispatch`
              : 'All current faults within normal SLAs'
          }
          icon={Wrench}
          iconBgColor="bg-rose-50"
          iconColor="text-rose-600"
          onClick={() => setActiveNavPage('faults')}
        />
      </div>

      {/* Second Row: Analytics (Water Consumption ~60% & Collection Overview ~40%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Water Consumption Card (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h3 className="text-base font-bold text-[#164E63] tracking-tight">
                Water Consumption Trend
              </h3>
              <p className="text-xs text-slate-500">
                Total water delivered across Kikuyu community zones (m³)
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+3.2% vs previous quarter</span>
            </div>
          </div>

          {/* Clean SVG Trend Chart */}
          <div className="relative h-48 w-full pt-4">
            <svg viewBox="0 0 500 160" className="w-full h-full overflow-visible">
              <defs>
                <linearGradient id="waterAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#399D9D" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="40" y1="20" x2="480" y2="20" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="60" x2="480" y2="60" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="100" x2="480" y2="100" stroke="#F1F5F9" strokeWidth="1" />
              <line x1="40" y1="140" x2="480" y2="140" stroke="#E2E8F0" strokeWidth="1" />

              {/* Y Axis Labels */}
              <text x="10" y="24" className="text-[10px] fill-slate-400 font-mono">250</text>
              <text x="10" y="64" className="text-[10px] fill-slate-400 font-mono">200</text>
              <text x="10" y="104" className="text-[10px] fill-slate-400 font-mono">150</text>
              <text x="10" y="144" className="text-[10px] fill-slate-400 font-mono">100</text>

              {/* Area */}
              <path
                d="M 50 85 L 130 72 L 210 50 L 290 60 L 370 42 L 450 34 L 450 140 L 50 140 Z"
                fill="url(#waterAreaGrad)"
              />

              {/* Line */}
              <path
                d="M 50 85 L 130 72 L 210 50 L 290 60 L 370 42 L 450 34"
                fill="none"
                stroke="#399D9D"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data points */}
              {[
                { x: 50, y: 85, val: '185' },
                { x: 130, y: 72, val: '198' },
                { x: 210, y: 50, val: '220' },
                { x: 290, y: 60, val: '210' },
                { x: 370, y: 42, val: '227' },
                { x: 450, y: 34, val: '235' },
              ].map((pt, idx) => (
                <g key={idx} className="group cursor-pointer">
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="4.5"
                    fill="#FFFFFF"
                    stroke="#164E63"
                    strokeWidth="2.5"
                  />
                  <text
                    x={pt.x}
                    y={pt.y - 8}
                    textAnchor="middle"
                    className="text-[10px] font-mono font-bold fill-[#164E63]"
                  >
                    {pt.val}
                  </text>
                </g>
              ))}

              {/* X Axis Month Labels */}
              {consumptionTrend.map((t, idx) => (
                <text
                  key={idx}
                  x={50 + idx * 80}
                  y="156"
                  textAnchor="middle"
                  className="text-[10px] font-medium fill-slate-500"
                >
                  {t.month}
                </text>
              ))}
            </svg>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Primary Sources: Ondiri Swamp Well #1 + Thogoto Springs</span>
            <span className="font-mono font-semibold text-slate-700">Oct Average: 18.9 m³/household</span>
          </div>
        </div>

        {/* Collection Overview Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-[#164E63] tracking-tight">
                  Collection Overview
                </h3>
                <p className="text-xs text-slate-500">
                  Revenue breakdown by payment method
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                Total: KSh {totalCollected.toLocaleString()}
              </span>
            </div>

            {/* Horizontal progress bars with percentage and amounts */}
            <div className="space-y-4 pt-2">
              {/* M-Pesa */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>M-Pesa (Paybill 400200)</span>
                  </span>
                  <span className="font-mono font-bold text-emerald-800">
                    KSh {mpesaTotal.toLocaleString()} ({mpesaPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                    style={{ width: `${mpesaPct}%` }}
                  />
                </div>
              </div>

              {/* Cash */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#399D9D]" />
                    <span>Office Counter Cash</span>
                  </span>
                  <span className="font-mono font-bold text-teal-800">
                    KSh {cashTotal.toLocaleString()} ({cashPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#399D9D] rounded-full transition-all duration-500"
                    style={{ width: `${cashPct}%` }}
                  />
                </div>
              </div>

              {/* Bank Deposit */}
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                    <span>Bank EFT / Cheque</span>
                  </span>
                  <span className="font-mono font-bold text-blue-800">
                    KSh {bankTotal.toLocaleString()} ({bankPct}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full transition-all duration-500"
                    style={{ width: `${bankPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-500">Unmatched / Pending:</span>
            <span className="font-mono font-bold text-slate-700">0 unmatched</span>
          </div>
        </div>
      </div>

      {/* Third Row: Recent Activity & Faults Status Bars */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Activity (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-bold text-[#164E63] tracking-tight">
              Recent Activity
            </h3>
            <button
              onClick={() => setActiveNavPage('audit_logs')}
              className="text-xs font-semibold text-[#399D9D] hover:underline flex items-center gap-1"
            >
              <span>View audit log</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Activity 1 */}
            <div className="py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#E6F3F3] text-[#399D9D] flex items-center justify-center shrink-0 mt-0.5">
                <Users className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800">
                  <strong className="text-slate-900 font-bold">Mary Wanjiku</strong> registered as a new customer with active connection.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>Ivy Mwangi</span>
                  <span>·</span>
                  <span>Account KIK-000124</span>
                  <span>·</span>
                  <span>Today</span>
                </div>
              </div>
            </div>

            {/* Activity 2 */}
            <div className="py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-teal-50 text-teal-600 flex items-center justify-center shrink-0 mt-0.5">
                <Gauge className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800">
                  Meter reading of <strong className="font-mono">148 m³</strong> recorded for KIK-000124 (WM-883921).
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>Peter Njoroge</span>
                  <span>·</span>
                  <span>Zone 2 Thogoto</span>
                </div>
              </div>
            </div>

            {/* Activity 3 */}
            <div className="py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800">
                  Payment of <strong className="font-mono text-emerald-700">KSh 1,000</strong> recorded via M-Pesa Paybill.
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>Ref: QK7899X101</span>
                  <span>·</span>
                  <span>Receipt RCP-2026-0412</span>
                </div>
              </div>
            </div>

            {/* Activity 4 */}
            <div className="py-3 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <Wrench className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-slate-800">
                  Leakage report submitted in <strong className="text-slate-900 font-bold">Zone 2 Thogoto</strong> (FLT-2026-045).
                </p>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                  <span>Assigned to Grace Wambui</span>
                  <span>·</span>
                  <span>High priority</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Faults Overview Bars (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-[#164E63] tracking-tight">
                Fault Overview
              </h3>
              <button
                onClick={() => setActiveNavPage('faults')}
                className="text-xs font-semibold text-[#399D9D] hover:underline"
              >
                View all ({faults.length})
              </button>
            </div>

            <div className="space-y-4">
              {/* Open */}
              <div
                onClick={() => setActiveNavPage('faults')}
                className="cursor-pointer group"
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-rose-600 transition-colors">
                    Open / Reported
                  </span>
                  <span className="font-mono font-bold text-rose-600">
                    {faultCounts.open}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-rose-500 rounded-full"
                    style={{ width: `${(faultCounts.open / totalFaultsCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Assigned */}
              <div
                onClick={() => setActiveNavPage('faults')}
                className="cursor-pointer group"
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-amber-600 transition-colors">
                    Assigned to Technician
                  </span>
                  <span className="font-mono font-bold text-amber-600">
                    {faultCounts.assigned}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${(faultCounts.assigned / totalFaultsCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* In Progress */}
              <div
                onClick={() => setActiveNavPage('faults')}
                className="cursor-pointer group"
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                    In Progress / Repair
                  </span>
                  <span className="font-mono font-bold text-blue-600">
                    {faultCounts.inProgress}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: `${(faultCounts.inProgress / totalFaultsCount) * 100}%` }}
                  />
                </div>
              </div>

              {/* Resolved */}
              <div
                onClick={() => setActiveNavPage('faults')}
                className="cursor-pointer group"
              >
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
                    Resolved & Verified
                  </span>
                  <span className="font-mono font-bold text-emerald-600">
                    {faultCounts.resolved}
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-500 rounded-full"
                    style={{ width: `${(faultCounts.resolved / totalFaultsCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 text-xs text-slate-500 flex items-center justify-between">
            <span>Average repair response time:</span>
            <span className="font-bold font-mono text-slate-800">4.2 hours</span>
          </div>
        </div>
      </div>

      {/* Fourth Row: Quick Actions Bar */}
      <div className="bg-white rounded-2xl p-5 border border-[#E7E2D6] shadow-sm">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Quick Workflows
        </h4>
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setActiveNavPage('add_customer')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D4EBEA] rounded-xl transition-colors min-h-[44px]"
          >
            <UserPlus className="w-4 h-4 text-[#399D9D]" />
            <span>Register Customer</span>
          </button>

          <button
            onClick={() => setActiveNavPage('readings')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D4EBEA] rounded-xl transition-colors min-h-[44px]"
          >
            <Gauge className="w-4 h-4 text-[#399D9D]" />
            <span>Record Reading</span>
          </button>

          <button
            onClick={() => setActiveNavPage('billing')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D4EBEA] rounded-xl transition-colors min-h-[44px]"
          >
            <FileCheck2 className="w-4 h-4 text-[#399D9D]" />
            <span>Generate Invoices</span>
          </button>

          <button
            onClick={() => setActiveNavPage('payments')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-xs transition-colors min-h-[44px]"
          >
            <CreditCard className="w-4 h-4" />
            <span>Record Payment</span>
          </button>

          <button
            onClick={() => setActiveNavPage('faults')}
            className="inline-flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors min-h-[44px]"
          >
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <span>Report Fault</span>
          </button>
        </div>
      </div>
    </div>
  );
};
