import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/StatusBadge';
import {
  ArrowLeft,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CreditCard,
  Gauge,
  Receipt,
  Wrench,
  Activity,
  GitFork,
  FileText,
  AlertCircle,
  Plus,
  Clock,
  Printer,
} from 'lucide-react';

export const CustomerDetailPage: React.FC = () => {
  const {
    selectedCustomerId,
    customers,
    connections,
    meters,
    readings,
    invoices,
    payments,
    faults,
    auditLogs,
    setActiveNavPage,
    setSelectedInvoice,
    setSelectedReceipt,
  } = useApp();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'connections' | 'readings' | 'invoices' | 'payments' | 'faults' | 'activity'
  >('overview');

  const customer = customers.find((c) => c.id === selectedCustomerId) || customers[0];
  if (!customer) {
    return (
      <div className="py-12 text-center text-slate-500 text-xs">
        Customer profile not found.
      </div>
    );
  }

  // Related data
  const custConnections = connections.filter((c) => c.customerId === customer.id);
  const custMeters = meters.filter((m) => m.customerId === customer.id);
  const custReadings = readings.filter((r) => r.customerId === customer.id);
  const custInvoices = invoices.filter((inv) => inv.customerId === customer.id);
  const custPayments = payments.filter((p) => p.customerId === customer.id);
  const custFaults = faults.filter(
    (f) => f.customerAccount === customer.accountNumber || f.reporterName === customer.name
  );
  const custAuditLogs = auditLogs.filter(
    (a) => a.entityId === customer.accountNumber || a.details.includes(customer.name)
  );

  const primaryConnection = custConnections[0];
  const primaryMeter = custMeters[0];
  const latestInvoice = custInvoices[0];
  const latestPayment = custPayments[0];

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'connections', label: `Connections (${custConnections.length})` },
    { id: 'readings', label: `Readings (${custReadings.length})` },
    { id: 'invoices', label: `Invoices (${custInvoices.length})` },
    { id: 'payments', label: `Payments (${custPayments.length})` },
    { id: 'faults', label: `Fault Reports (${custFaults.length})` },
    { id: 'activity', label: 'Activity & Audit' },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <div>
        <button
          onClick={() => setActiveNavPage('customers')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#164E63] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Customers</span>
        </button>
      </div>

      {/* Customer Header Card */}
      <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#164E63] text-white flex items-center justify-center font-extrabold text-lg shrink-0 shadow-xs">
              {customer.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-[#164E63] tracking-tight">
                  {customer.name}
                </h1>
                <span className="font-mono text-xs font-bold text-[#164E63] bg-[#E6F3F3] px-2.5 py-0.5 rounded">
                  {customer.accountNumber}
                </span>
                <StatusBadge status={customer.connectionStatus} size="sm" />
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{customer.phone}</span>
                </span>
                {customer.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{customer.email}</span>
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{customer.zone}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Member since {customer.registeredDate}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Balance & Actions */}
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6] text-right">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Current Balance
              </span>
              <span className="text-lg font-black font-mono tabular-nums text-slate-900 block">
                {customer.balance > 0 ? (
                  <span className="text-rose-600">KSh {customer.balance.toLocaleString()}</span>
                ) : (
                  <span className="text-emerald-700">KSh 0</span>
                )}
              </span>
            </div>

            <button
              onClick={() => setActiveNavPage('payments')}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-xs transition-colors min-h-[44px]"
            >
              <CreditCard className="w-4 h-4" />
              <span>Record Payment</span>
            </button>
          </div>
        </div>

        {/* Profile Tabs with Turquoise Underline */}
        <div className="mt-8 border-b border-slate-200 flex overflow-x-auto gap-6 -mb-6">
          {tabs.map((tab) => {
            const isTabActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-3 text-xs font-bold whitespace-nowrap transition-colors relative ${
                  isTabActive
                    ? 'text-[#164E63]'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {tab.label}
                {isTabActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#399D9D] rounded-t-full" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Personal info & Meter info */}
          <div className="space-y-6 lg:col-span-1">
            {/* Personal Info */}
            <div className="bg-white rounded-2xl p-5 border border-[#E7E2D6] shadow-sm">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                Household & Identity
              </h3>
              <div className="space-y-2.5 text-xs">
                <div>
                  <span className="text-slate-400 block text-[11px]">Type</span>
                  <span className="font-semibold text-slate-800">{customer.customerType}</span>
                </div>
                {customer.idNumber && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">{customer.idType || 'National ID'}</span>
                    <span className="font-mono text-slate-800">{customer.idNumber}</span>
                  </div>
                )}
                <div>
                  <span className="text-slate-400 block text-[11px]">Village / Plot</span>
                  <span className="text-slate-800">
                    {customer.village} {customer.plotNumber ? `(${customer.plotNumber})` : ''}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Physical Address</span>
                  <span className="text-slate-800">{customer.address}</span>
                </div>
                {customer.landmark && (
                  <div>
                    <span className="text-slate-400 block text-[11px]">Nearby Landmark</span>
                    <span className="text-slate-800">{customer.landmark}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Meter Card */}
            <div className="bg-white rounded-2xl p-5 border border-[#E7E2D6] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Assigned Water Meter
                </h3>
                <Gauge className="w-4 h-4 text-[#399D9D]" />
              </div>

              {primaryMeter ? (
                <div className="space-y-2.5 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Meter Serial</span>
                    <span className="font-mono font-bold text-[#164E63] text-sm">
                      {primaryMeter.serialNumber}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Meter Type</span>
                    <span className="text-slate-700">{primaryMeter.meterType}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Last Dial Reading</span>
                    <span className="font-mono font-bold text-slate-900 text-sm">
                      {primaryMeter.lastReading} m³
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Operational Condition</span>
                    <StatusBadge status={primaryMeter.condition} size="sm" />
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  No active meter attached. Connection is pending meter allocation.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Financial & Recent Invoices / Activity */}
          <div className="space-y-6 lg:col-span-2">
            {/* Latest Invoice & Last Payment Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Latest Invoice */}
              <div className="bg-white rounded-2xl p-5 border border-[#E7E2D6] shadow-sm">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Latest Invoice
                  </span>
                  {latestInvoice && <StatusBadge status={latestInvoice.status} size="sm" />}
                </div>

                {latestInvoice ? (
                  <div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="font-mono font-bold text-sm text-[#164E63]">
                        {latestInvoice.invoiceNumber}
                      </span>
                      <span className="font-mono font-bold text-slate-900">
                        KSh {latestInvoice.totalAmount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Period: {latestInvoice.period} · Consumption: {latestInvoice.consumption} m³
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-500">Balance: KSh {latestInvoice.balance.toLocaleString()}</span>
                      <button
                        onClick={() => setSelectedInvoice(latestInvoice)}
                        className="text-[#399D9D] font-bold hover:underline"
                      >
                        View Bill &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic mt-2">No invoices issued yet.</p>
                )}
              </div>

              {/* Last Payment */}
              <div className="bg-white rounded-2xl p-5 border border-[#E7E2D6] shadow-sm">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Last Payment Recorded
                </span>

                {latestPayment ? (
                  <div>
                    <div className="flex items-baseline justify-between mt-1">
                      <span className="font-mono font-bold text-sm text-[#164E63]">
                        {latestPayment.receiptNumber}
                      </span>
                      <span className="font-mono font-bold text-emerald-700">
                        KSh {latestPayment.amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      {latestPayment.paymentMethod} (Ref: {latestPayment.transactionReference})
                    </div>
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <span className="text-slate-400">{latestPayment.date}</span>
                      <button
                        onClick={() => setSelectedReceipt(latestPayment)}
                        className="text-[#399D9D] font-bold hover:underline"
                      >
                        View Receipt &rarr;
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic mt-2">No payments on record.</p>
                )}
              </div>
            </div>

            {/* Recent Readings Table */}
            <div className="bg-white rounded-2xl p-5 border border-[#E7E2D6] shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  Consumption History (Recent Readings)
                </h3>
                <button
                  onClick={() => setActiveTab('readings')}
                  className="text-xs text-[#399D9D] font-semibold hover:underline"
                >
                  View all ({custReadings.length})
                </button>
              </div>

              {custReadings.length > 0 ? (
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="border-b border-slate-200 text-slate-400 uppercase font-semibold">
                      <th className="py-2">Period</th>
                      <th className="py-2 text-right">Previous</th>
                      <th className="py-2 text-right">Current</th>
                      <th className="py-2 text-right">Consumption</th>
                      <th className="py-2 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {custReadings.slice(0, 4).map((r) => (
                      <tr key={r.id}>
                        <td className="py-2.5 font-medium text-slate-800">{r.period}</td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-slate-600">
                          {r.previousReading} m³
                        </td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-slate-800 font-semibold">
                          {r.currentReading} m³
                        </td>
                        <td className="py-2.5 text-right font-mono tabular-nums text-[#399D9D] font-bold">
                          {r.consumption} m³
                        </td>
                        <td className="py-2.5 text-right">
                          <StatusBadge status={r.status} size="sm" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-xs text-slate-500 italic">No meter readings recorded yet.</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CONNECTIONS */}
      {activeTab === 'connections' && (
        <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden p-6">
          <h3 className="text-sm font-bold text-[#164E63] mb-4">
            Water Connections for {customer.name}
          </h3>
          <div className="space-y-4">
            {custConnections.map((conn) => (
              <div
                key={conn.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-[#164E63] text-sm">
                      {conn.connectionNumber}
                    </span>
                    <StatusBadge status={conn.status} size="sm" />
                  </div>
                  <p className="text-slate-600 mt-1">
                    Type: <strong className="text-slate-800">{conn.connectionType}</strong> · Zone: {conn.zone}
                  </p>
                  <p className="text-slate-500 mt-0.5">Location: {conn.physicalLocation}</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-slate-400 block text-[11px]">Commissioned</span>
                  <span className="font-mono font-semibold text-slate-800">
                    {conn.installationDate || 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: READINGS */}
      {activeTab === 'readings' && (
        <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Meter Serial</th>
                <th className="py-3 px-4 text-right">Previous (m³)</th>
                <th className="py-3 px-4 text-right">Current (m³)</th>
                <th className="py-3 px-4 text-right">Net Used</th>
                <th className="py-3 px-4">Reader</th>
                <th className="py-3 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {custReadings.map((r) => (
                <tr key={r.id}>
                  <td className="py-3 px-4 font-bold text-slate-900">{r.period}</td>
                  <td className="py-3 px-4 font-mono text-slate-600">{r.readingDate}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{r.meterSerialNumber}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums">{r.previousReading}</td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {r.currentReading}
                  </td>
                  <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-[#399D9D]">
                    {r.consumption} m³
                  </td>
                  <td className="py-3 px-4 text-slate-600">{r.readerName}</td>
                  <td className="py-3 px-4 text-right">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 4: INVOICES */}
      {activeTab === 'invoices' && (
        <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Invoice #</th>
                <th className="py-3 px-4">Period</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Due Date</th>
                <th className="py-3 px-4 text-right">Total (KSh)</th>
                <th className="py-3 px-4 text-right">Paid (KSh)</th>
                <th className="py-3 px-4 text-right">Balance</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {custInvoices.map((inv) => (
                <tr key={inv.id}>
                  <td className="py-3 px-4 font-mono font-bold text-[#164E63]">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3 px-4 font-medium text-slate-900">{inv.period}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{inv.invoiceDate}</td>
                  <td className="py-3 px-4 text-slate-600 font-mono">{inv.dueDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums">
                    {inv.totalAmount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-emerald-700 tabular-nums">
                    {inv.amountPaid.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-rose-600 tabular-nums">
                    {inv.balance.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge status={inv.status} size="sm" />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D4EBEA] rounded-lg transition-colors"
                    >
                      View / Print
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 5: PAYMENTS */}
      {activeTab === 'payments' && (
        <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                <th className="py-3 px-4">Receipt #</th>
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Reference</th>
                <th className="py-3 px-4 text-right">Amount (KSh)</th>
                <th className="py-3 px-4">Officer</th>
                <th className="py-3 px-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {custPayments.map((p) => (
                <tr key={p.id}>
                  <td className="py-3 px-4 font-mono font-bold text-[#164E63]">
                    {p.receiptNumber}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-600">{p.date}</td>
                  <td className="py-3 px-4 font-semibold text-slate-900">{p.paymentMethod}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{p.transactionReference}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 tabular-nums">
                    KSh {p.amount.toLocaleString()}
                  </td>
                  <td className="py-3 px-4 text-slate-600">{p.receivingOfficer}</td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => setSelectedReceipt(p)}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      Receipt
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 6: FAULTS */}
      {activeTab === 'faults' && (
        <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden p-6">
          <h3 className="text-sm font-bold text-[#164E63] mb-4">
            Reported Faults & Maintenance Requests
          </h3>
          {custFaults.length > 0 ? (
            <div className="space-y-3">
              {custFaults.map((f) => (
                <div
                  key={f.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-[#164E63]">{f.faultReference}</span>
                      <span className="font-bold text-slate-900">· {f.category}</span>
                      <StatusBadge status={f.status} size="sm" />
                    </div>
                    <p className="text-slate-600 mt-1">{f.description}</p>
                    <span className="text-[11px] text-slate-400 mt-0.5 block">
                      Reported: {f.dateReported}
                    </span>
                  </div>
                  {f.assignedTechnician && (
                    <div className="sm:text-right">
                      <span className="text-slate-400 block text-[11px]">Technician</span>
                      <span className="font-semibold text-slate-800">{f.assignedTechnician}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">No faults reported by this customer.</p>
          )}
        </div>
      )}

      {/* TAB 7: ACTIVITY & AUDIT */}
      {activeTab === 'activity' && (
        <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm p-6">
          <h3 className="text-sm font-bold text-[#164E63] mb-4">
            Audit Trail & Account Log
          </h3>
          <div className="space-y-4">
            {custAuditLogs.map((log) => (
              <div key={log.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#399D9D] mt-1.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.action}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-slate-600 mt-0.5">{log.details}</p>
                  <span className="text-[10px] text-slate-400 block mt-0.5">
                    Actor: {log.actor}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
