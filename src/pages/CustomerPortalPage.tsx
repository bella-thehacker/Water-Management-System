import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import { PipMascot } from '../components/PipMascot';
import {
  Droplets,
  CreditCard,
  FileText,
  Gauge,
  AlertTriangle,
  Receipt,
  User,
  ArrowRight,
  Send,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { FaultCategory, Invoice } from '../types';
import { CustomerPaymentModal } from '../components/CustomerPaymentModal';

export const CustomerPortalPage: React.FC = () => {
  const {
    currentUser,
    customers,
    invoices,
    payments,
    readings,
    faults,
    announcements,
    customerPortalPage,
    setCustomerPortalPage,
    setSelectedInvoice,
    setSelectedReceipt,
    setPortalMode,
    setActiveNavPage,
    createFaultReport,
  } = useApp();

  // Find customer account (defaults to Mary Wanjiku KIK-000124)
  const customer =
    customers.find((c) => c.email === currentUser?.email || c.id === currentUser?.customerId) ||
    customers[0];

  const custInvoices = invoices.filter((inv) => inv.customerId === customer.id);
  const custPayments = payments.filter((p) => p.customerId === customer.id);
  const custReadings = readings.filter((r) => r.customerId === customer.id);
  const custFaults = faults.filter(
    (f) => f.customerAccount === customer.accountNumber || f.reporterName === customer.name
  );

  const latestInvoice = custInvoices[0];
  const latestPayment = custPayments[0];
  const latestAnnouncement = announcements[0];

  // Payment modal state
  const [payModalOpen, setPayModalOpen] = useState(false);
  const [payingInvoice, setPayingInvoice] = useState<Invoice | null>(null);

  const handleOpenPayment = (inv?: Invoice | null) => {
    setPayingInvoice(inv || null);
    setPayModalOpen(true);
  };

  // Report fault state
  const [faultCat, setFaultCat] = useState<FaultCategory>('Low water pressure');
  const [faultDesc, setFaultDesc] = useState('');
  const [faultLoc, setFaultLoc] = useState(customer.address);
  const [faultSubmitted, setFaultSubmitted] = useState<string | null>(null);

  const handleReportFaultSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newFault = createFaultReport({
      category: faultCat,
      description: faultDesc,
      zone: customer.zone,
      landmark: faultLoc,
      priority: 'Medium',
      reporterName: customer.name,
      reporterPhone: customer.phone,
      customerAccount: customer.accountNumber,
    });
    setFaultSubmitted(newFault.faultReference);
    setFaultDesc('');
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'account', label: 'My Account' },
    { id: 'bills', label: 'My Bills' },
    { id: 'payments', label: 'My Payments' },
    { id: 'consumption', label: 'My Consumption' },
    { id: 'report_fault', label: 'Report a Fault' },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F1] flex flex-col">
      {/* Customer Header */}
      <header className="bg-white border-b border-[#E7E2D6] px-6 py-3.5 sticky top-0 z-30 select-none">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#164E63] p-2 flex items-center justify-center shrink-0 shadow-xs">
              <img
                src="/assets/aistudio/image_0d358796.png"
                alt="Logo"
                className="w-full h-full object-contain filter brightness-110"
              />
            </div>
            <div>
              <h1 className="text-base font-extrabold text-[#164E63] tracking-tight leading-none">
                Kikuyu Water
              </h1>
              <span className="text-[10px] text-[#399D9D] font-bold">
                Customer Self-Service Portal
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = customerPortalPage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setCustomerPortalPage(link.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    isActive
                      ? 'bg-[#E6F3F3] text-[#164E63] font-bold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Staff Mode & Profile Switcher */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setPortalMode('staff');
                setActiveNavPage('overview');
              }}
              className="text-xs font-semibold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D5E8E7] px-3 py-1.5 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ExternalLink className="w-3.5 h-3.5 text-[#399D9D]" />
              <span className="hidden sm:inline">Staff Workspace</span>
            </button>

            <div className="w-8 h-8 rounded-full bg-[#164E63] text-white flex items-center justify-center font-bold text-xs">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex-1">
        {/* TAB: HOME */}
        {customerPortalPage === 'home' && (
          <div className="space-y-6">
            {/* Welcome banner */}
            <div className="bg-gradient-to-r from-[#164E63] to-[#0E3846] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#38BDF8] block mb-1">
                  Kikuyu Scheme Resident
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  Hello, {customer.name.split(' ')[0]}!
                </h2>
                <p className="text-xs sm:text-sm text-cyan-100/90 mt-1 max-w-lg leading-relaxed">
                  Here's your water account at a glance. You can review your monthly consumption, download invoices, pay via M-Pesa, or report pipe leakages.
                </p>
              </div>

              <div className="shrink-0 hidden sm:block">
                <PipMascot state="idle" size={90} showRipple={false} />
              </div>
            </div>

            {/* Account & Outstanding Balance Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Account Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Water Service Account
                </span>
                <div className="text-2xl font-black font-mono text-[#164E63] tracking-tight">
                  {customer.accountNumber}
                </div>
                <div className="text-xs text-slate-600 mt-2 space-y-1">
                  <div>Name: <strong className="text-slate-900">{customer.name}</strong></div>
                  <div>Zone: <span className="text-slate-800">{customer.zone}</span></div>
                  <div>Status: <StatusBadge status={customer.connectionStatus} size="sm" /></div>
                </div>
              </div>

              {/* Outstanding Balance Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Outstanding Balance Due
                  </span>
                  <div className="text-3xl font-black font-mono text-rose-600 tabular-nums">
                    KSh {customer.balance.toLocaleString()}
                  </div>
                  {latestInvoice && (
                    <span className="text-[11px] text-slate-500 block mt-1">
                      Due by {latestInvoice.dueDate}
                    </span>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[11px] text-slate-400 font-mono block">
                      Paybill: 400200
                    </span>
                    {latestInvoice && (
                      <button
                        onClick={() => setSelectedInvoice(latestInvoice)}
                        className="text-xs font-bold text-[#399D9D] hover:underline flex items-center gap-1 mt-0.5"
                      >
                        <span>View Bill</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <button
                    onClick={() => handleOpenPayment(latestInvoice)}
                    className="px-3.5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl transition-all shadow-xs flex items-center gap-1.5 shrink-0"
                  >
                    <CreditCard className="w-3.5 h-3.5" />
                    <span>Pay with M-Pesa</span>
                  </button>
                </div>
              </div>

              {/* Recent Payment Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Last Payment Received
                  </span>
                  {latestPayment ? (
                    <div>
                      <div className="text-2xl font-black font-mono text-emerald-700 tabular-nums">
                        KSh {latestPayment.amount.toLocaleString()}
                      </div>
                      <span className="text-[11px] text-slate-500 block mt-1">
                        {latestPayment.date} ({latestPayment.paymentMethod})
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-2">No payments on record yet.</p>
                  )}
                </div>

                {latestPayment && (
                  <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                    <button
                      onClick={() => setSelectedReceipt(latestPayment)}
                      className="text-xs font-bold text-[#399D9D] hover:underline"
                    >
                      Download Official Receipt &rarr;
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Consumption & Community Announcements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Consumption Card */}
              <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-[#164E63]">
                    Monthly Consumption History
                  </h3>
                  <button
                    onClick={() => setCustomerPortalPage('consumption')}
                    className="text-xs text-[#399D9D] font-bold hover:underline"
                  >
                    Details &rarr;
                  </button>
                </div>

                <div className="space-y-3">
                  {custReadings.slice(0, 3).map((r) => (
                    <div
                      key={r.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
                    >
                      <div>
                        <span className="font-bold text-slate-900 block">{r.period}</span>
                        <span className="text-[11px] text-slate-500 font-mono">Dial: {r.currentReading} m³</span>
                      </div>
                      <span className="text-base font-black font-mono text-[#399D9D]">
                        {r.consumption} m³
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Latest Announcement */}
              <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E6F3F3] text-[#164E63] rounded">
                      Community Notice
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {latestAnnouncement?.publishedDate}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {latestAnnouncement?.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {latestAnnouncement?.message}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>Author: {latestAnnouncement?.author}</span>
                  <span className="text-emerald-700 font-semibold">Active Notice</span>
                </div>
              </div>
            </div>

            {/* Quick Actions Strip */}
            <div className="p-4 bg-white rounded-2xl border border-[#E7E2D6] flex flex-wrap items-center justify-between gap-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Quick Resident Actions:
              </span>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => handleOpenPayment(latestInvoice)}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Pay Water Bill</span>
                </button>
                <button
                  onClick={() => setCustomerPortalPage('bills')}
                  className="px-4 py-2 text-xs font-bold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D5E8E7] rounded-xl transition-colors"
                >
                  View Bills ({custInvoices.length})
                </button>
                <button
                  onClick={() => setCustomerPortalPage('payments')}
                  className="px-4 py-2 text-xs font-bold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D5E8E7] rounded-xl transition-colors"
                >
                  Payment History ({custPayments.length})
                </button>
                <button
                  onClick={() => setCustomerPortalPage('report_fault')}
                  className="px-4 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl transition-colors shadow-xs"
                >
                  Report a Leak / Fault
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB: MY BILLS */}
        {customerPortalPage === 'bills' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-[#164E63]">
                  My Water Invoices
                </h2>
                <p className="text-xs text-slate-500">
                  Monthly water bills for Account {customer.accountNumber}.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <th className="py-3 px-4">Invoice #</th>
                    <th className="py-3 px-4">Period</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4 text-right">Amount (KSh)</th>
                    <th className="py-3 px-4 text-right">Paid (KSh)</th>
                    <th className="py-3 px-4 text-right">Balance Due</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {custInvoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-[#FAF8F1] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                        {inv.invoiceNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">{inv.period}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{inv.dueDate}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold tabular-nums">
                        {inv.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-emerald-700 tabular-nums">
                        {inv.amountPaid.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600 tabular-nums">
                        {inv.balance.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={inv.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {inv.balance > 0 && (
                            <button
                              onClick={() => handleOpenPayment(inv)}
                              className="px-3 py-1.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-xs"
                            >
                              <CreditCard className="w-3 h-3" />
                              <span>Pay Bill</span>
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedInvoice(inv)}
                            className="px-3 py-1.5 text-xs font-semibold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D5E8E7] rounded-lg transition-colors"
                          >
                            View / Download
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: MY PAYMENTS */}
        {customerPortalPage === 'payments' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-extrabold text-[#164E63]">
                  My Payment Records & Receipts
                </h2>
                <p className="text-xs text-slate-500">
                  Official receipts and instant settlements for Account {customer.accountNumber}.
                </p>
              </div>
              <button
                onClick={() => handleOpenPayment(null)}
                className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>+ Make a Payment</span>
              </button>
            </div>
            <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4 text-right">Amount (KSh)</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {custPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F1] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                        {p.receiptNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">{p.date}</td>
                      <td className="py-3.5 px-4 font-semibold text-slate-900">{p.paymentMethod}</td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">{p.transactionReference}</td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                        KSh {p.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                        >
                          Print Receipt
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB: REPORT A FAULT */}
        {customerPortalPage === 'report_fault' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E2D6] shadow-sm">
              <h2 className="text-xl font-extrabold text-[#164E63] mb-1">
                Report a Water Fault or Leakage
              </h2>
              <p className="text-xs text-slate-500 mb-6">
                Notify Kikuyu Water scheme field maintenance technicians immediately for quick repair.
              </p>

              {faultSubmitted ? (
                <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-in fade-in">
                  <PipMascot state="jumping" size={90} className="mb-2" />
                  <h3 className="text-base font-bold text-emerald-900">
                    Incident Logged Successfully!
                  </h3>
                  <p className="text-xs text-emerald-800 mt-1">
                    Your fault ticket reference is <strong className="font-mono">{faultSubmitted}</strong>.
                    Field dispatch has been notified.
                  </p>
                  <button
                    onClick={() => setFaultSubmitted(null)}
                    className="mt-4 px-4 py-2 text-xs font-bold text-white bg-emerald-700 rounded-xl"
                  >
                    Submit Another Report
                  </button>
                </div>
              ) : (
                <form onSubmit={handleReportFaultSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Fault Category <span className="text-rose-500">*</span>
                    </label>
                    <select
                      value={faultCat}
                      onChange={(e) => setFaultCat(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                    >
                      <option value="Leakage">Water Leakage / Pooling</option>
                      <option value="Burst pipe">Burst Supply Pipe</option>
                      <option value="No water supply">Zero Water Flow</option>
                      <option value="Low water pressure">Low Pressure in Taps</option>
                      <option value="Faulty meter">Meter Stalled / Broken Dial</option>
                      <option value="Other">Other Scheme Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Location / Exact Landmark
                    </label>
                    <input
                      type="text"
                      required
                      value={faultLoc}
                      onChange={(e) => setFaultLoc(e.target.value)}
                      placeholder="e.g. Near gate entrance, Thogoto Lane"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Description of Water Issue
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={faultDesc}
                      onChange={(e) => setFaultDesc(e.target.value)}
                      placeholder="Please share any details that can help technicians locate and resolve the leak..."
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Fault Ticket to Dispatch</span>
                  </button>
                </form>
              )}
            </div>

            {/* Past Submitted Faults */}
            {custFaults.length > 0 && (
              <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  My Previously Reported Issues
                </h3>
                <div className="space-y-3">
                  {custFaults.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                    >
                      <div>
                        <span className="font-mono font-bold text-[#164E63]">{f.faultReference}</span>
                        <span className="font-bold text-slate-800 ml-2">· {f.category}</span>
                        <p className="text-[11px] text-slate-500 mt-0.5">{f.description}</p>
                      </div>
                      <StatusBadge status={f.status} size="sm" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB: MY CONSUMPTION */}
        {customerPortalPage === 'consumption' && (
          <div className="space-y-6">
            <h2 className="text-xl font-extrabold text-[#164E63]">
              My Water Consumption History
            </h2>
            <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">Current Dial Reading</span>
                  <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">
                    {custReadings[0]?.currentReading || 148} m³
                  </span>
                </div>
                <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6]">
                  <span className="text-[11px] text-slate-400 block">October Consumption</span>
                  <span className="text-lg font-bold font-mono text-[#399D9D] mt-0.5 block">
                    10 m³
                  </span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                  <span className="text-[11px] text-slate-400 block">Monthly Average</span>
                  <span className="text-lg font-bold font-mono text-slate-800 mt-0.5 block">
                    10.5 m³
                  </span>
                </div>
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
                  <span className="text-[11px] text-emerald-800 block">Conservation Tier</span>
                  <span className="text-lg font-bold text-emerald-700 mt-0.5 block">
                    Lifeline (0-6 m³)
                  </span>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {custReadings.map((r) => (
                  <div key={r.id} className="py-3 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-slate-900">{r.period}</span>
                      <span className="text-slate-400 text-[11px] block mt-0.5">
                        Dial from {r.previousReading} to {r.currentReading} m³
                      </span>
                    </div>
                    <span className="font-mono font-black text-sm text-[#399D9D]">
                      {r.consumption} m³
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MY ACCOUNT */}
        {customerPortalPage === 'account' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E2D6] shadow-sm space-y-4 text-xs">
              <h2 className="text-xl font-extrabold text-[#164E63] pb-2 border-b border-slate-100">
                Official Account Information
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-slate-400 block text-[11px]">Customer Account</span>
                  <span className="font-mono font-bold text-[#164E63] text-sm">
                    {customer.accountNumber}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Primary Phone</span>
                  <span className="font-mono text-slate-800">{customer.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Scheme Zone</span>
                  <span className="font-semibold text-slate-800">{customer.zone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Village / Plot</span>
                  <span className="text-slate-800">{customer.village} ({customer.plotNumber || 'N/A'})</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block text-[11px]">Physical Address</span>
                  <span className="text-slate-800">{customer.address}</span>
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Interactive Customer Payment Modal */}
        <CustomerPaymentModal
          isOpen={payModalOpen}
          onClose={() => {
            setPayModalOpen(false);
            setPayingInvoice(null);
          }}
          customer={customer}
          preselectedInvoice={payingInvoice}
        />
      </main>
    </div>
  );
};
