import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { PipMascot } from '../components/PipMascot';
import {
  CreditCard,
  Plus,
  Search,
  FilterX,
  FileCheck2,
  Printer,
  Smartphone,
  Coins,
  Building,
  CheckCircle2,
  Check,
} from 'lucide-react';
import { PaymentMethod, Payment } from '../types';

export const PaymentsPage: React.FC = () => {
  const {
    payments,
    customers,
    invoices,
    recordPayment,
    setSelectedReceipt,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'transactions' | 'record' | 'reconciliation' | 'receipts'>('transactions');

  // Search / filters for transactions
  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');

  // Record Payment Form (2-column layout)
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [paymentAmount, setPaymentAmount] = useState<number>(450);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('M-Pesa');
  const [transactionRef, setTransactionRef] = useState(`QK${Math.floor(100000 + Math.random() * 900000)}X`);
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0] + ' ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  const [paymentNotes, setPaymentNotes] = useState('');
  const [specificInvoice, setSpecificInvoice] = useState('');
  const [recentRecordedPayment, setRecentRecordedPayment] = useState<Payment | null>(null);

  // Selected customer data for right panel
  const activeCustomer = customers.find((c) => c.id === selectedCustomerId);
  const customerUnpaidInvoices = invoices.filter(
    (inv) => inv.customerId === selectedCustomerId && inv.balance > 0
  );
  const customerLastPayment = payments.find((p) => p.customerId === selectedCustomerId);

  // Summaries
  const todayCollected = payments
    .filter((p) => p.date.startsWith(new Date().toISOString().split('T')[0]))
    .reduce((s, p) => s + p.amount, 0);
  const monthCollected = payments.reduce((s, p) => s + p.amount, 0);

  const filteredPayments = payments.filter((p) => {
    if (methodFilter !== 'all' && p.paymentMethod !== methodFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      if (
        !p.customerName.toLowerCase().includes(q) &&
        !p.customerAccount.toLowerCase().includes(q) &&
        !p.receiptNumber.toLowerCase().includes(q) &&
        !p.transactionReference.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
    const cust = customers.find((c) => c.id === custId);
    if (cust && cust.balance > 0) {
      setPaymentAmount(cust.balance);
    } else {
      setPaymentAmount(500);
    }
  };

  const handleRecordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeCustomer || paymentAmount <= 0) return;

    const newPayment = recordPayment({
      customerId: selectedCustomerId,
      amount: paymentAmount,
      paymentMethod,
      transactionReference: transactionRef,
      paymentDate,
      notes: paymentNotes,
      specificInvoiceNumber: specificInvoice || undefined,
    });

    setRecentRecordedPayment(newPayment);
    // Reset ref
    setTransactionRef(`QK${Math.floor(100000 + Math.random() * 900000)}X`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Water Operations', 'Payments']}
        title="Payments & Revenue Collection"
        description="Record incoming M-Pesa, counter cash, and bank collections with real-time customer ledger allocation."
        primaryAction={{
          label: 'Record Payment',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => {
            setRecentRecordedPayment(null);
            setActiveTab('record');
          },
        }}
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Collected Today
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums block mt-1">
            KSh {todayCollected.toLocaleString()}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-[#164E63] uppercase tracking-wider block">
            Collected This Month
          </span>
          <span className="text-2xl font-bold font-mono text-[#164E63] tabular-nums block mt-1">
            KSh {monthCollected.toLocaleString()}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Pending Reconciliation
          </span>
          <span className="text-2xl font-bold font-mono text-slate-700 tabular-nums block mt-1">
            0 unmatched
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
            Reversed Transactions
          </span>
          <span className="text-2xl font-bold font-mono text-slate-400 tabular-nums block mt-1">
            0
          </span>
        </div>
      </div>

      {/* Segmented Tab Bar */}
      <div className="flex items-center gap-2 p-1.5 bg-[#EDF5F4] rounded-xl max-w-lg">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'transactions'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <CreditCard className="w-4 h-4 text-[#399D9D]" />
          <span>Transactions ({payments.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('record')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'record'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus className="w-4 h-4 text-[#399D9D]" />
          <span>Record Payment</span>
        </button>

        <button
          onClick={() => setActiveTab('reconciliation')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'reconciliation'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCheck2 className="w-4 h-4 text-[#399D9D]" />
          <span>Reconciliation</span>
        </button>
      </div>

      {/* TAB 1: TRANSACTIONS LIST */}
      {activeTab === 'transactions' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search receipt #, customer, account, or M-Pesa reference..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={methodFilter}
                onChange={(e) => setMethodFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 min-h-[44px]"
              >
                <option value="all">All Payment Methods</option>
                <option value="M-Pesa">M-Pesa</option>
                <option value="Cash">Cash Counter</option>
                <option value="Bank">Bank Deposit</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Receipt #</th>
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Account</th>
                    <th className="py-3 px-4 text-right">Amount (KSh)</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4">Transaction Ref</th>
                    <th className="py-3 px-4">Date & Time</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Receipt</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F1] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                        {p.receiptNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {p.customerName}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600">
                        {p.customerAccount}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                        KSh {p.amount.toLocaleString()}
                      </td>
                      <td className="py-3.5 px-4 font-medium text-slate-800">
                        {p.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {p.transactionReference}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {p.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={p.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => setSelectedReceipt(p)}
                          className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 mx-auto"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print</span>
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

      {/* TAB 2: RECORD PAYMENT (TWO-COLUMN SPECIFICATION) */}
      {activeTab === 'record' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (7 cols): Payment Form */}
          <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-[#E7E2D6] shadow-sm">
            <h3 className="text-base font-bold text-[#164E63] mb-1">
              Record Water Payment
            </h3>
            <p className="text-xs text-slate-500 mb-6">
              Enter customer payment received via M-Pesa, counter cash, or direct bank transfer.
            </p>

            {recentRecordedPayment ? (
              <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-200 text-center animate-in fade-in">
                <PipMascot state="celebrating" size={88} className="mb-2" />
                <h4 className="text-base font-extrabold text-emerald-900">
                  Payment Recorded Successfully!
                </h4>
                <p className="text-xs text-emerald-800 mt-1">
                  Receipt <strong className="font-mono">{recentRecordedPayment.receiptNumber}</strong> issued for{' '}
                  <strong className="font-mono">KSh {recentRecordedPayment.amount.toLocaleString()}</strong>.
                </p>

                <div className="mt-5 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setSelectedReceipt(recentRecordedPayment)}
                    className="px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs"
                  >
                    View / Print Receipt
                  </button>
                  <button
                    onClick={() => setRecentRecordedPayment(null)}
                    className="px-4 py-2 text-xs font-semibold text-emerald-900 bg-white border border-emerald-300 rounded-xl hover:bg-emerald-100"
                  >
                    Record Another
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRecordSubmit} className="space-y-4 text-xs">
                {/* Customer Account */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Customer Account <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => handleCustomerChange(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} ({c.accountNumber}) · Bal: KSh {c.balance.toLocaleString()}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Payment Method Selector */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    Payment Method <span className="text-rose-500">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('M-Pesa')}
                      className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1 ${
                        paymentMethod === 'M-Pesa'
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold ring-1 ring-emerald-500'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span>M-Pesa</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Cash')}
                      className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1 ${
                        paymentMethod === 'Cash'
                          ? 'border-[#399D9D] bg-[#E6F3F3] text-[#164E63] font-bold ring-1 ring-[#399D9D]'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Coins className="w-4 h-4 text-[#399D9D]" />
                      <span>Cash Counter</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('Bank')}
                      className={`p-3 rounded-xl border text-center transition-colors flex flex-col items-center gap-1 ${
                        paymentMethod === 'Bank'
                          ? 'border-blue-500 bg-blue-50 text-blue-900 font-bold ring-1 ring-blue-500'
                          : 'border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Building className="w-4 h-4 text-blue-600" />
                      <span>Bank Transfer</span>
                    </button>
                  </div>
                </div>

                {/* Amount Received */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Amount Received (KSh) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(parseFloat(e.target.value) || 0)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono font-bold text-base text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[46px]"
                  />
                </div>

                {/* Transaction Reference & Date */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Transaction Reference <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. QK8912KLOP"
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono font-bold text-[#164E63] min-h-[44px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Payment Date & Time
                    </label>
                    <input
                      type="text"
                      value={paymentDate}
                      onChange={(e) => setPaymentDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono min-h-[44px]"
                    />
                  </div>
                </div>

                {/* Specific Invoice Allocation */}
                {customerUnpaidInvoices.length > 0 && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Allocate to Specific Invoice (Optional)
                    </label>
                    <select
                      value={specificInvoice}
                      onChange={(e) => setSpecificInvoice(e.target.value)}
                      className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                    >
                      <option value="">Auto-allocate to oldest unpaid invoice first</option>
                      {customerUnpaidInvoices.map((inv) => (
                        <option key={inv.id} value={inv.invoiceNumber}>
                          {inv.invoiceNumber} ({inv.period}) - Bal: KSh {inv.balance.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Notes */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Payment Notes / Teller Remarks
                  </label>
                  <input
                    type="text"
                    value={paymentNotes}
                    onChange={(e) => setPaymentNotes(e.target.value)}
                    placeholder="e.g. Cash received at reception desk, receipt printed."
                    className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                  />
                </div>

                <div className="pt-4 border-t border-slate-200">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-md transition-all flex items-center justify-center gap-2 min-h-[46px]"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Submit & Issue Official Receipt</span>
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column (5 cols): Live Customer Account Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-3">
                Customer Account Summary
              </span>

              {activeCustomer ? (
                <div className="space-y-4 text-xs">
                  <div className="p-4 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6]">
                    <span className="font-bold text-slate-900 text-sm block">
                      {activeCustomer.name}
                    </span>
                    <span className="font-mono text-slate-500 mt-0.5 block">
                      Account: {activeCustomer.accountNumber}
                    </span>
                    <span className="text-slate-500 block">{activeCustomer.zone}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 block">Total Outstanding</span>
                      <span className="text-base font-extrabold font-mono text-rose-600 tabular-nums block mt-0.5">
                        KSh {activeCustomer.balance.toLocaleString()}
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                      <span className="text-[11px] text-slate-400 block">Unpaid Invoices</span>
                      <span className="text-base font-extrabold font-mono text-slate-900 tabular-nums block mt-0.5">
                        {customerUnpaidInvoices.length} bills
                      </span>
                    </div>
                  </div>

                  {/* Allocation Preview */}
                  <div className="p-3 bg-emerald-50/70 rounded-xl border border-emerald-200/80">
                    <span className="text-[11px] font-bold text-emerald-900 block mb-1">
                      Live Allocation Preview
                    </span>
                    <p className="text-emerald-800 text-[11px] leading-relaxed">
                      Entering <strong>KSh {paymentAmount.toLocaleString()}</strong> will reduce total balance from{' '}
                      <strong>KSh {activeCustomer.balance.toLocaleString()}</strong> to{' '}
                      <strong>KSh {Math.max(0, activeCustomer.balance - paymentAmount).toLocaleString()}</strong>.
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400">Select a customer above.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RECONCILIATION */}
      {activeTab === 'reconciliation' && (
        <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#164E63]">
            Payment Reconciliation Ledger
          </h3>
          <p className="text-xs text-slate-500">
            Compare expected M-Pesa IPN notifications and counter registers against stored system records.
          </p>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="font-bold block">All 4 Transactions Fully Reconciled</span>
              <span className="text-[11px] text-emerald-800">
                Zero unmatched or orphaned payments. M-Pesa Paybill 400200 balance aligns 100% with bank sweep.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
