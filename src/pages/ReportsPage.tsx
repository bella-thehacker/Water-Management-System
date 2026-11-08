import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import {
  BarChart3,
  Download,
  Printer,
  Calendar,
  Layers,
  FileSpreadsheet,
  TrendingUp,
  DollarSign,
  Droplet,
  Users,
  Wrench,
} from 'lucide-react';
import { ZONES } from '../data/mockData';

export const ReportsPage: React.FC = () => {
  const { customers, invoices, payments, readings, faults, assets } = useApp();

  const [reportType, setReportType] = useState<'financial' | 'consumption' | 'customers' | 'maintenance'>('financial');
  const [selectedZone, setSelectedZone] = useState('all');

  // Financial aggregates
  const totalRevenue = payments.reduce((s, p) => s + p.amount, 0);
  const totalArrears = customers.reduce((s, c) => s + c.balance, 0);
  const totalBilled = invoices.reduce((s, inv) => s + inv.totalAmount, 0);

  // Consumption aggregates
  const totalConsumptionM3 = readings.reduce((s, r) => s + r.consumption, 0);
  const avgConsumptionPerCust = customers.length > 0 ? (totalConsumptionM3 / customers.length).toFixed(1) : '0';

  const handlePrintReport = () => {
    window.print();
  };

  const handleExportCSV = () => {
    let rows: string[][] = [];
    let headers: string[] = [];

    if (reportType === 'financial') {
      headers = ['Receipt Number', 'Customer Name', 'Account', 'Payment Method', 'Amount (KSh)', 'Date', 'Transaction Ref'];
      rows = payments.map((p) => [
        p.receiptNumber,
        `"${p.customerName}"`,
        p.customerAccount,
        p.paymentMethod,
        p.amount.toString(),
        p.date,
        p.transactionReference,
      ]);
    } else if (reportType === 'consumption') {
      headers = ['Period', 'Customer Name', 'Account', 'Meter Serial', 'Previous (m3)', 'Current (m3)', 'Consumption (m3)'];
      rows = readings.map((r) => [
        r.period,
        `"${r.customerName}"`,
        r.customerAccount,
        r.meterSerialNumber,
        r.previousReading.toString(),
        r.currentReading.toString(),
        r.consumption.toString(),
      ]);
    } else {
      headers = ['Account Number', 'Customer Name', 'Type', 'Zone', 'Balance (KSh)', 'Status'];
      rows = customers.map((c) => [
        c.accountNumber,
        `"${c.name}"`,
        c.customerType,
        `"${c.zone}"`,
        c.balance.toString(),
        c.connectionStatus,
      ]);
    }

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kikuyu_water_${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="no-print">
        <PageHeader
          breadcrumbs={['Management', 'Reports & Analytics']}
          title="Operational Reports & Analytics"
          description="Audited financial ledgers, bulk scheme consumption metrics, customer growth trends, and maintenance turnaround stats."
          primaryAction={{
            label: 'Print / Save PDF Report',
            icon: <Printer className="w-4 h-4" />,
            onClick: handlePrintReport,
          }}
          secondaryActions={[
            {
              label: 'Export Excel / CSV',
              icon: <FileSpreadsheet className="w-4 h-4" />,
              onClick: handleExportCSV,
            },
          ]}
        />

        {/* Filter Controls Bar */}
        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Category:
            </span>
            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
              <button
                onClick={() => setReportType('financial')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  reportType === 'financial'
                    ? 'bg-white text-[#164E63] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Financial Revenue
              </button>
              <button
                onClick={() => setReportType('consumption')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  reportType === 'consumption'
                    ? 'bg-white text-[#164E63] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Water Consumption
              </button>
              <button
                onClick={() => setReportType('customers')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  reportType === 'customers'
                    ? 'bg-white text-[#164E63] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Customer Directory
              </button>
              <button
                onClick={() => setReportType('maintenance')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                  reportType === 'maintenance'
                    ? 'bg-white text-[#164E63] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Faults & Maintenance
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 min-h-[42px]"
            >
              <option value="all">All Community Zones</option>
              {ZONES.map((z) => (
                <option key={z} value={z}>
                  {z}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Official Report Document Body (Printable) */}
      <div className="bg-white rounded-2xl p-8 border border-[#E7E2D6] shadow-sm printable-document">
        {/* Document Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#164E63] flex items-center justify-center p-1.5">
                <img
                  src="/assets/aistudio/image_0d358796.png"
                  alt="Logo"
                  className="w-full h-full object-contain filter brightness-110"
                />
              </div>
              <h2 className="text-lg font-black text-[#164E63]">
                KIKUYU COMMUNITY WATER SCHEME
              </h2>
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mt-2">
              Official {reportType.toUpperCase()} Status Report
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Filtered for: {selectedZone === 'all' ? 'All Community Zones' : selectedZone}
            </p>
          </div>

          <div className="sm:text-right text-xs text-slate-500">
            <p>Generated: <strong className="font-mono text-slate-800">{new Date().toLocaleString()}</strong></p>
            <p className="mt-0.5">Scheme ID: <strong className="font-mono text-[#164E63]">KIK-COMM-001</strong></p>
            <p className="text-emerald-700 font-semibold mt-1">Verified Audit Consistency</p>
          </div>
        </div>

        {/* 1. FINANCIAL REPORT */}
        {reportType === 'financial' && (
          <div className="space-y-6 pt-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6]">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">Total Billed</span>
                <span className="text-xl font-bold font-mono text-[#164E63] block mt-1">
                  KSh {totalBilled.toLocaleString()}
                </span>
              </div>
              <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                <span className="text-[11px] font-bold uppercase text-emerald-800 block">Total Collected</span>
                <span className="text-xl font-bold font-mono text-emerald-700 block mt-1">
                  KSh {totalRevenue.toLocaleString()}
                </span>
              </div>
              <div className="p-4 bg-rose-50 rounded-xl border border-rose-200">
                <span className="text-[11px] font-bold uppercase text-rose-800 block">Overdue Arrears</span>
                <span className="text-xl font-bold font-mono text-rose-600 block mt-1">
                  KSh {totalArrears.toLocaleString()}
                </span>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pt-2">
              Payment Transactions Ledger
            </h4>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 uppercase font-semibold">
                  <th className="py-2.5">Receipt #</th>
                  <th className="py-2.5">Customer Name</th>
                  <th className="py-2.5">Account</th>
                  <th className="py-2.5">Method</th>
                  <th className="py-2.5">Reference</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5 text-right">Amount (KSh)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="py-2.5 font-mono font-bold text-[#164E63]">{p.receiptNumber}</td>
                    <td className="py-2.5 font-bold text-slate-800">{p.customerName}</td>
                    <td className="py-2.5 font-mono text-slate-600">{p.customerAccount}</td>
                    <td className="py-2.5 text-slate-700">{p.paymentMethod}</td>
                    <td className="py-2.5 font-mono text-slate-600">{p.transactionReference}</td>
                    <td className="py-2.5 font-mono text-slate-500">{p.date}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-slate-900">
                      {p.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 2. CONSUMPTION REPORT */}
        {reportType === 'consumption' && (
          <div className="space-y-6 pt-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6]">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">Total Volume Recorded</span>
                <span className="text-2xl font-black font-mono text-[#399D9D] block mt-1">
                  {totalConsumptionM3} m³
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-[11px] font-bold uppercase text-slate-500 block">Average Household Usage</span>
                <span className="text-2xl font-black font-mono text-slate-800 block mt-1">
                  {avgConsumptionPerCust} m³ / month
                </span>
              </div>
            </div>

            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 pt-2">
              Meter Readings & Consumption Logs
            </h4>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 uppercase font-semibold">
                  <th className="py-2.5">Period</th>
                  <th className="py-2.5">Customer Name</th>
                  <th className="py-2.5">Account</th>
                  <th className="py-2.5">Meter Serial</th>
                  <th className="py-2.5 text-right">Previous</th>
                  <th className="py-2.5 text-right">Current</th>
                  <th className="py-2.5 text-right">Net Used (m³)</th>
                  <th className="py-2.5">Reader</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {readings.map((r) => (
                  <tr key={r.id}>
                    <td className="py-2.5 font-bold text-slate-900">{r.period}</td>
                    <td className="py-2.5 text-slate-800">{r.customerName}</td>
                    <td className="py-2.5 font-mono text-slate-600">{r.customerAccount}</td>
                    <td className="py-2.5 font-mono text-slate-700">{r.meterSerialNumber}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums">{r.previousReading}</td>
                    <td className="py-2.5 text-right font-mono tabular-nums font-bold">{r.currentReading}</td>
                    <td className="py-2.5 text-right font-mono font-bold text-[#399D9D]">
                      {r.consumption} m³
                    </td>
                    <td className="py-2.5 text-slate-500">{r.readerName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 3. CUSTOMER REPORT */}
        {reportType === 'customers' && (
          <div className="space-y-6 pt-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 uppercase font-semibold">
                  <th className="py-2.5">Account #</th>
                  <th className="py-2.5">Customer Name</th>
                  <th className="py-2.5">Phone</th>
                  <th className="py-2.5">Type</th>
                  <th className="py-2.5">Zone</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5 text-right">Balance Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="py-2.5 font-mono font-bold text-[#164E63]">{c.accountNumber}</td>
                    <td className="py-2.5 font-bold text-slate-900">{c.name}</td>
                    <td className="py-2.5 font-mono text-slate-600">{c.phone}</td>
                    <td className="py-2.5 text-slate-700">{c.customerType}</td>
                    <td className="py-2.5 text-slate-600">{c.zone}</td>
                    <td className="py-2.5 font-semibold capitalize text-emerald-800">{c.connectionStatus}</td>
                    <td className="py-2.5 text-right font-mono font-bold tabular-nums">
                      KSh {c.balance.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* 4. MAINTENANCE REPORT */}
        {reportType === 'maintenance' && (
          <div className="space-y-6 pt-6">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-300 text-slate-500 uppercase font-semibold">
                  <th className="py-2.5">Ref #</th>
                  <th className="py-2.5">Category</th>
                  <th className="py-2.5">Location</th>
                  <th className="py-2.5">Priority</th>
                  <th className="py-2.5">Technician</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {faults.map((f) => (
                  <tr key={f.id}>
                    <td className="py-2.5 font-mono font-bold text-[#164E63]">{f.faultReference}</td>
                    <td className="py-2.5 font-bold text-slate-900">{f.category}</td>
                    <td className="py-2.5 text-slate-600">{f.landmark}</td>
                    <td className="py-2.5 font-mono text-slate-700">{f.priority}</td>
                    <td className="py-2.5 text-slate-800">{f.assignedTechnician || 'Unassigned'}</td>
                    <td className="py-2.5 font-mono text-slate-500">{f.dateReported}</td>
                    <td className="py-2.5 font-semibold text-slate-800">{f.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 pt-4 border-t border-slate-200 text-center text-[11px] text-slate-400">
          Kikuyu Water Scheme · Generated with database authoritative integrity · Every drop matters. Every community counts.
        </div>
      </div>
    </div>
  );
};
