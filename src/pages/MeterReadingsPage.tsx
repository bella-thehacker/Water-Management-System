import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import {
  Gauge,
  Plus,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Search,
  FilterX,
  X,
  Upload,
} from 'lucide-react';
import { ZONES } from '../data/mockData';

export const MeterReadingsPage: React.FC = () => {
  const {
    readings,
    meters,
    customers,
    addMeterReading,
    approveReading,
    rejectReading,
  } = useApp();

  const [periodFilter, setPeriodFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Record reading modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(customers[0]?.id || '');
  const [currentReadingInput, setCurrentReadingInput] = useState<number>(0);
  const [readingDate, setReadingDate] = useState(new Date().toISOString().split('T')[0]);
  const [readingPeriod, setReadingPeriod] = useState('November 2026');
  const [readingNotes, setReadingNotes] = useState('');
  const [formError, setFormError] = useState('');

  // Find customer meter & previous reading
  const activeCustomer = customers.find((c) => c.id === selectedCustomerId);
  const customerMeter = meters.find((m) => m.customerId === selectedCustomerId);
  const prevReading = customerMeter ? customerMeter.lastReading : 0;
  const computedConsumption = Math.max(0, currentReadingInput - prevReading);
  const isLowerReading = currentReadingInput < prevReading && currentReadingInput > 0;
  const isHighConsumption = computedConsumption > 35;

  // Summaries
  const totalDue = meters.length;
  const submittedCount = readings.length;
  const pendingReviewCount = readings.filter((r) => r.status === 'pending_review').length;
  const rejectedCount = readings.filter((r) => r.status === 'rejected').length;

  const filteredReadings = useMemo(() => {
    return readings.filter((r) => {
      if (periodFilter !== 'all' && r.period !== periodFilter) return false;
      if (statusFilter !== 'all' && r.status !== statusFilter) return false;

      if (zoneFilter !== 'all') {
        const cust = customers.find((c) => c.id === r.customerId);
        if (cust && cust.zone !== zoneFilter) return false;
      }

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (
          !r.customerName.toLowerCase().includes(q) &&
          !r.customerAccount.toLowerCase().includes(q) &&
          !r.meterSerialNumber.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [readings, customers, periodFilter, statusFilter, zoneFilter, searchTerm]);

  const handleOpenModal = () => {
    setSelectedCustomerId(customers[0]?.id || '');
    const m = meters.find((mtr) => mtr.customerId === customers[0]?.id);
    const initialPrev = m ? m.lastReading : 0;
    setCurrentReadingInput(initialPrev + 10);
    setFormError('');
    setModalOpen(true);
  };

  const handleCustomerChange = (custId: string) => {
    setSelectedCustomerId(custId);
    const m = meters.find((mtr) => mtr.customerId === custId);
    const baseReading = m ? m.lastReading : 0;
    setCurrentReadingInput(baseReading + 12);
  };

  const handleSubmitReading = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!customerMeter) {
      setFormError('Customer has no registered meter.');
      return;
    }

    const res = addMeterReading({
      customerId: selectedCustomerId,
      meterSerialNumber: customerMeter.serialNumber,
      currentReading: currentReadingInput,
      readingDate,
      period: readingPeriod,
      notes: readingNotes,
    });

    if (!res.success) {
      setFormError(res.error || 'Failed to record reading.');
      return;
    }

    setModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Water Operations', 'Meter Readings']}
        title="Meter Readings"
        description="Record field consumption dial values, calculate net water usage, and approve data for billing runs."
        primaryAction={{
          label: '+ Record Reading',
          icon: <Plus className="w-4 h-4" />,
          onClick: handleOpenModal,
        }}
      />

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Meters Due For Reading
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums block mt-1">
            {totalDue}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-[#399D9D] uppercase tracking-wider block">
            Readings Submitted
          </span>
          <span className="text-2xl font-bold font-mono text-[#399D9D] tabular-nums block mt-1">
            {submittedCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
            Awaiting Review
          </span>
          <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums block mt-1">
            {pendingReviewCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
            Flagged / Rejected
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums block mt-1">
            {rejectedCount}
          </span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search customer, account or meter serial..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={periodFilter}
            onChange={(e) => setPeriodFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
          >
            <option value="all">All Billing Periods</option>
            <option value="November 2026">November 2026</option>
            <option value="October 2026">October 2026</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
          >
            <option value="all">All Review States</option>
            <option value="pending_review">Pending Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
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

      {/* Readings Table */}
      <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Account</th>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Meter Serial</th>
                <th className="py-3 px-4 text-right">Previous (m³)</th>
                <th className="py-3 px-4 text-right">Current (m³)</th>
                <th className="py-3 px-4 text-right">Consumption</th>
                <th className="py-3 px-4">Reading Date</th>
                <th className="py-3 px-4">Reader</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-center">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReadings.map((r) => (
                <tr key={r.id} className="hover:bg-[#FAF8F1] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                    {r.customerAccount}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {r.customerName}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-700">
                    {r.meterSerialNumber}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums text-slate-500">
                    {r.previousReading}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-bold text-slate-900">
                    {r.currentReading}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono tabular-nums font-black text-[#399D9D]">
                    {r.consumption} m³
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {r.readingDate}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{r.readerName}</td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={r.status} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    {r.status === 'pending_review' ? (
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => approveReading(r.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Approve</span>
                        </button>
                        <button
                          onClick={() => rejectReading(r.id, 'Dial mismatch')}
                          className="px-2 py-1 text-xs font-semibold text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 font-mono">
                        {r.status === 'approved' ? '✓ Ready for bill' : 'Flagged'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Record Reading Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-[#399D9D]" />
                <h3 className="text-base font-bold text-slate-900">
                  Record Meter Reading
                </h3>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmitReading} className="space-y-4 pt-4 text-xs">
              {/* Customer selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Customer Account <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedCustomerId}
                  onChange={(e) => handleCustomerChange(e.target.value)}
                  className="w-full px-3 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
                >
                  {customers.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} ({c.accountNumber}) · {c.zone}
                    </option>
                  ))}
                </select>
              </div>

              {/* Meter information read-only banner */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Meter Serial</span>
                  <span className="font-mono font-bold text-[#164E63]">
                    {customerMeter?.serialNumber || 'No meter attached'}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block">Previous Dial Reading</span>
                  <span className="font-mono font-bold text-slate-800">
                    {prevReading} m³
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {/* Period */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reading Period
                  </label>
                  <select
                    value={readingPeriod}
                    onChange={(e) => setReadingPeriod(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] min-h-[42px]"
                  >
                    <option value="November 2026">November 2026</option>
                    <option value="December 2026">December 2026</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reading Date
                  </label>
                  <input
                    type="date"
                    required
                    value={readingDate}
                    onChange={(e) => setReadingDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] min-h-[42px]"
                  >
                  </input>
                </div>
              </div>

              {/* Current Reading input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Current Dial Reading (m³) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  value={currentReadingInput}
                  onChange={(e) => setCurrentReadingInput(parseFloat(e.target.value) || 0)}
                  className={`w-full px-3.5 py-2.5 bg-[#FAF8F1] border rounded-[10px] font-mono text-sm font-bold tabular-nums focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[46px] ${
                    isLowerReading ? 'border-rose-400 text-rose-700' : 'border-slate-300 text-slate-900'
                  }`}
                />
              </div>

              {/* Real-time Dynamic Consumption Calculator */}
              <div
                className={`p-3.5 rounded-xl border flex items-center justify-between ${
                  isLowerReading
                    ? 'bg-rose-50 border-rose-200 text-rose-800'
                    : isHighConsumption
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-[#E6F3F3] border-[#399D9D]/30 text-[#164E63]'
                }`}
              >
                <div>
                  <span className="text-[11px] font-medium block">
                    Calculated Net Consumption
                  </span>
                  <span className="font-mono text-xs text-slate-600">
                    {currentReadingInput} m³ - {prevReading} m³
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xl font-black font-mono tabular-nums">
                    {computedConsumption} m³
                  </span>
                  {isLowerReading && (
                    <span className="text-[10px] block text-rose-600 font-bold">
                      Lower than previous!
                    </span>
                  )}
                  {isHighConsumption && (
                    <span className="text-[10px] block text-amber-700 font-bold">
                      High usage flag
                    </span>
                  )}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Observations / Field Notes
                </label>
                <input
                  type="text"
                  value={readingNotes}
                  onChange={(e) => setReadingNotes(e.target.value)}
                  placeholder="e.g. Clean dial visible, zero leakage detected."
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLowerReading}
                  className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] disabled:opacity-50 disabled:cursor-not-allowed rounded-[10px] shadow-sm"
                >
                  Save Reading
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
