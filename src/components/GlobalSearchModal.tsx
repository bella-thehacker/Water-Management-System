import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Search, X, User, FileText, Wrench, Gauge, Receipt } from 'lucide-react';

export const GlobalSearchModal: React.FC = () => {
  const {
    searchOpen,
    setSearchOpen,
    customers,
    invoices,
    meters,
    faults,
    payments,
    setSelectedCustomerId,
    setSelectedInvoice,
    setSelectedReceipt,
    setActiveNavPage,
  } = useApp();

  const [query, setQuery] = useState('');

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) {
      return { customers: [], invoices: [], meters: [], faults: [], payments: [] };
    }
    const q = query.toLowerCase();

    const matchedCustomers = customers.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.accountNumber.toLowerCase().includes(q) ||
        c.phone.includes(q)
    );

    const matchedInvoices = invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.customerName.toLowerCase().includes(q) ||
        inv.customerAccount.toLowerCase().includes(q)
    );

    const matchedMeters = meters.filter(
      (m) =>
        m.serialNumber.toLowerCase().includes(q) ||
        m.meterNumber.toLowerCase().includes(q) ||
        m.customerName.toLowerCase().includes(q)
    );

    const matchedFaults = faults.filter(
      (f) =>
        f.faultReference.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q) ||
        f.reporterName.toLowerCase().includes(q) ||
        (f.customerAccount && f.customerAccount.toLowerCase().includes(q))
    );

    const matchedPayments = payments.filter(
      (p) =>
        p.receiptNumber.toLowerCase().includes(q) ||
        p.transactionReference.toLowerCase().includes(q) ||
        p.customerName.toLowerCase().includes(q)
    );

    return {
      customers: matchedCustomers.slice(0, 5),
      invoices: matchedInvoices.slice(0, 5),
      meters: matchedMeters.slice(0, 5),
      faults: matchedFaults.slice(0, 5),
      payments: matchedPayments.slice(0, 5),
    };
  }, [query, customers, invoices, meters, faults, payments]);

  if (!searchOpen) return null;

  const totalFound =
    results.customers.length +
    results.invoices.length +
    results.meters.length +
    results.faults.length +
    results.payments.length;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-200">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers, accounts (KIK-...), invoices, meters, or faults..."
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-xs text-slate-400 hover:text-slate-600 font-medium"
            >
              Clear
            </button>
          )}
          <button
            onClick={() => setSearchOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="max-h-[60vh] overflow-y-auto p-4 space-y-4">
          {query.trim().length < 2 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              Type at least 2 characters to search across all community records.
            </div>
          ) : totalFound === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No matching records found for "{query}".
            </div>
          ) : (
            <>
              {/* Customers Group */}
              {results.customers.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#399D9D]" />
                    <span>Customers ({results.customers.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {results.customers.map((c) => (
                      <button
                        key={c.id}
                        onClick={() => {
                          setSelectedCustomerId(c.id);
                          setActiveNavPage('customer_detail');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {c.name}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {c.zone} · {c.phone}
                          </div>
                        </div>
                        <span className="font-mono text-xs font-semibold text-[#164E63] bg-[#E6F3F3] px-2 py-0.5 rounded">
                          {c.accountNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Invoices Group */}
              {results.invoices.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Invoices ({results.invoices.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {results.invoices.map((inv) => (
                      <button
                        key={inv.id}
                        onClick={() => {
                          setSelectedInvoice(inv);
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 font-mono">
                            {inv.invoiceNumber}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {inv.customerName} · {inv.period}
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-slate-900">
                          KSh {inv.totalAmount.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Meters Group */}
              {results.meters.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Meters ({results.meters.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {results.meters.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          setActiveNavPage('connections');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 font-mono">
                            SN: {m.serialNumber}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            Customer: {m.customerName} ({m.meterType})
                          </div>
                        </div>
                        <span className="font-mono text-xs text-slate-600">
                          {m.lastReading} m³
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Faults Group */}
              {results.faults.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    <span>Fault Reports ({results.faults.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {results.faults.map((f) => (
                      <button
                        key={f.id}
                        onClick={() => {
                          setActiveNavPage('faults');
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900">
                            {f.faultReference} - {f.category}
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {f.zone} · {f.reporterName}
                          </div>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-600">
                          {f.status}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Payments Group */}
              {results.payments.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 px-2 flex items-center gap-1.5">
                    <Receipt className="w-3.5 h-3.5 text-teal-600" />
                    <span>Payments ({results.payments.length})</span>
                  </h4>
                  <div className="space-y-1">
                    {results.payments.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setSelectedReceipt(p);
                          setSearchOpen(false);
                        }}
                        className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-50 text-left transition-colors"
                      >
                        <div>
                          <div className="text-xs font-bold text-slate-900 font-mono">
                            {p.receiptNumber} ({p.paymentMethod})
                          </div>
                          <div className="text-[11px] text-slate-500">
                            {p.customerName} · Ref: {p.transactionReference}
                          </div>
                        </div>
                        <span className="font-mono text-xs font-bold text-emerald-700">
                          KSh {p.amount.toLocaleString()}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
