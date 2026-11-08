import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import { GitFork, Gauge, Plus, RefreshCw, X, Check } from 'lucide-react';
import { Meter } from '../types';

export const ConnectionsPage: React.FC = () => {
  const {
    connections,
    meters,
    customers,
    setSelectedCustomerId,
    setActiveNavPage,
    addToast,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'connections' | 'meters'>('connections');
  const [replaceModalMeter, setReplaceModalMeter] = useState<Meter | null>(null);

  // Replace meter modal form state
  const [oldFinalReading, setOldFinalReading] = useState(0);
  const [newSerialNumber, setNewSerialNumber] = useState('');
  const [newInitialReading, setNewInitialReading] = useState(0);
  const [replaceReason, setReplaceReason] = useState('Damaged dial mechanism');

  const handleOpenReplace = (meter: Meter) => {
    setReplaceModalMeter(meter);
    setOldFinalReading(meter.lastReading);
    setNewSerialNumber(`WM-${Math.floor(100000 + Math.random() * 900000)}`);
    setNewInitialReading(0);
  };

  const handleConfirmReplace = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replaceModalMeter) return;

    addToast({
      type: 'success',
      title: 'Meter replaced successfully!',
      message: `Decommissioned ${replaceModalMeter.serialNumber} (final ${oldFinalReading} m³). Installed ${newSerialNumber} (initial ${newInitialReading} m³). Historical continuity preserved.`,
    });

    setReplaceModalMeter(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Water Operations', 'Connections & Meters']}
        title="Connections & Water Meters"
        description="Physical branch connections, smart meters, installation histories, and replacement audits."
      />

      {/* Segmented Tab Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#EDF5F4] rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('connections')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'connections'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <GitFork className="w-4 h-4 text-[#399D9D]" />
          <span>Connections ({connections.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('meters')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'meters'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Gauge className="w-4 h-4 text-[#399D9D]" />
          <span>Meters Register ({meters.length})</span>
        </button>
      </div>

      {/* TAB 1: CONNECTIONS */}
      {activeTab === 'connections' && (
        <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Connection #</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Account</th>
                  <th className="py-3 px-4">Zone</th>
                  <th className="py-3 px-4">Classification</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Commissioned</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {connections.map((conn) => (
                  <tr key={conn.id} className="hover:bg-[#FAF8F1] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                      {conn.connectionNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {conn.customerName}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">
                      {conn.customerAccount}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 truncate max-w-[150px]">
                      {conn.zone}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {conn.connectionType}
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={conn.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      {conn.installationDate || 'Pending'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => {
                          setSelectedCustomerId(conn.customerId);
                          setActiveNavPage('customer_detail');
                        }}
                        className="px-2.5 py-1 text-xs font-semibold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D4EBEA] rounded-lg transition-colors"
                      >
                        Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: METERS */}
      {activeTab === 'meters' && (
        <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                  <th className="py-3 px-4">Meter #</th>
                  <th className="py-3 px-4">Serial Number</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 text-right">Last Reading</th>
                  <th className="py-3 px-4">Condition</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {meters.map((meter) => (
                  <tr key={meter.id} className="hover:bg-[#FAF8F1] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                      {meter.meterNumber}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                      {meter.serialNumber}
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {meter.customerName}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{meter.meterType}</td>
                    <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 tabular-nums">
                      {meter.lastReading} m³
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={meter.condition} size="sm" />
                    </td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={meter.status} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenReplace(meter)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                      >
                        <RefreshCw className="w-3 h-3 text-[#399D9D]" />
                        <span>Replace Meter</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Replace Meter Workflow Modal */}
      {replaceModalMeter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#399D9D]" />
                <h3 className="text-base font-bold text-slate-900">
                  Replace Water Meter
                </h3>
              </div>
              <button
                onClick={() => setReplaceModalMeter(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleConfirmReplace} className="space-y-4 pt-4 text-xs">
              <div className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6]">
                <span className="text-[11px] text-slate-500 block">Customer</span>
                <span className="font-bold text-slate-900 text-sm">
                  {replaceModalMeter.customerName}
                </span>
                <span className="text-slate-600 block mt-0.5 font-mono">
                  Current Serial: {replaceModalMeter.serialNumber}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Old Meter Final Dial Reading (m³) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  required
                  value={oldFinalReading}
                  onChange={(e) => setOldFinalReading(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Captures remaining unbilled consumption prior to disconnection.
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Replacement Meter Serial Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newSerialNumber}
                  onChange={(e) => setNewSerialNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  New Meter Initial Reading (m³)
                </label>
                <input
                  type="number"
                  min="0"
                  value={newInitialReading}
                  onChange={(e) => setNewInitialReading(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono tabular-nums focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reason for Meter Replacement
                </label>
                <select
                  value={replaceReason}
                  onChange={(e) => setReplaceReason(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                >
                  <option value="Damaged dial mechanism">Damaged dial mechanism</option>
                  <option value="Digital smart upgrade">Digital smart upgrade</option>
                  <option value="Calibration discrepancy">Calibration discrepancy</option>
                  <option value="Vandalism or physical damage">Vandalism or physical damage</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReplaceModalMeter(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm"
                >
                  Authorize Replacement
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
