import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { History, Search, ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const { auditLogs } = useApp();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLogs = auditLogs.filter((log) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      return (
        log.actor.toLowerCase().includes(q) ||
        log.action.toLowerCase().includes(q) ||
        log.entity.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.entityId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Management', 'Audit Logs']}
        title="Scheme Security & Audit Trail"
        description="Immutable timestamped activity ledger tracking user actions, payment bookings, billing runs, and fault updates."
      />

      <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs flex items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search audit trail by actor, action or record ID..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[42px]"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Tamper-evident operational audit</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Timestamp</th>
                <th className="py-3 px-4">Action</th>
                <th className="py-3 px-4">Actor</th>
                <th className="py-3 px-4">Entity Type</th>
                <th className="py-3 px-4">Reference ID</th>
                <th className="py-3 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-[#FAF8F1] transition-colors">
                  <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {log.action}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">
                    {log.actor}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {log.entity}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                    {log.entityId}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-md">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
