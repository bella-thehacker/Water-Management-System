import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import {
  Wrench,
  AlertTriangle,
  Plus,
  Search,
  FilterX,
  X,
  UserCheck,
  CheckCircle2,
  Clock,
  Eye,
  FileText,
} from 'lucide-react';
import { ZONES } from '../data/mockData';
import { FaultCategory, FaultPriority, FaultReport, WorkOrder } from '../types';

export const FaultsPage: React.FC = () => {
  const {
    faults,
    workOrders,
    createFaultReport,
    updateFaultStatus,
    assignFaultTechnician,
    completeWorkOrder,
    users,
    currentUser,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'reports' | 'work_orders'>('reports');

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [zoneFilter, setZoneFilter] = useState('all');

  // New Fault Modal
  const [newFaultOpen, setNewFaultOpen] = useState(false);
  const [faultCategory, setFaultCategory] = useState<FaultCategory>('Leakage');
  const [faultDescription, setFaultDescription] = useState('');
  const [faultZone, setFaultZone] = useState(ZONES[0]);
  const [faultLandmark, setFaultLandmark] = useState('');
  const [faultPriority, setFaultPriority] = useState<FaultPriority>('High');
  const [reporterName, setReporterName] = useState(currentUser?.name || 'Customer');
  const [reporterPhone, setReporterPhone] = useState('+254 700 000 000');

  // Detail Modal
  const [selectedFault, setSelectedFault] = useState<FaultReport | null>(null);

  // Complete WO Modal
  const [completeWO, setCompleteWO] = useState<WorkOrder | null>(null);
  const [workPerformed, setWorkPerformed] = useState('');
  const [resolutionDesc, setResolutionDesc] = useState('');

  // Summaries
  const totalReports = faults.length;
  const openCount = faults.filter((f) => f.status === 'Open').length;
  const highPriorityCount = faults.filter(
    (f) => (f.priority === 'High' || f.priority === 'Critical') && f.status !== 'Resolved'
  ).length;
  const resolvedCount = faults.filter((f) => f.status === 'Resolved' || f.status === 'Completed').length;

  const filteredFaults = useMemo(() => {
    return faults.filter((f) => {
      if (statusFilter !== 'all' && f.status !== statusFilter) return false;
      if (priorityFilter !== 'all' && f.priority !== priorityFilter) return false;
      if (zoneFilter !== 'all' && f.zone !== zoneFilter) return false;

      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        if (
          !f.faultReference.toLowerCase().includes(q) &&
          !f.category.toLowerCase().includes(q) &&
          !f.reporterName.toLowerCase().includes(q) &&
          !f.landmark.toLowerCase().includes(q)
        ) {
          return false;
        }
      }

      return true;
    });
  }, [faults, statusFilter, priorityFilter, zoneFilter, searchTerm]);

  const handleCreateFault = (e: React.FormEvent) => {
    e.preventDefault();
    createFaultReport({
      category: faultCategory,
      description: faultDescription,
      zone: faultZone,
      landmark: faultLandmark,
      priority: faultPriority,
      reporterName,
      reporterPhone,
    });
    setNewFaultOpen(false);
    setFaultDescription('');
    setFaultLandmark('');
  };

  const handleCompleteWorkOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!completeWO) return;
    completeWorkOrder(completeWO.id, workPerformed, resolutionDesc);
    setCompleteWO(null);
    setWorkPerformed('');
    setResolutionDesc('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Water Operations', 'Fault Reports']}
        title="Fault Reports & Maintenance"
        description="Log pipeline bursts, water leaks, pressure drops, dispatch technician work orders, and track repairs."
        primaryAction={{
          label: 'Report Fault',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => setNewFaultOpen(true),
        }}
      />

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Total Incident Reports
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums block mt-1">
            {totalReports}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
            Open / Awaiting Action
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums block mt-1">
            {openCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
            High Priority Active
          </span>
          <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums block mt-1">
            {highPriorityCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            Resolved This Month
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-600 tabular-nums block mt-1">
            {resolvedCount}
          </span>
        </div>
      </div>

      {/* Segmented Switcher */}
      <div className="flex items-center gap-2 p-1.5 bg-[#EDF5F4] rounded-xl max-w-sm">
        <button
          onClick={() => setActiveTab('reports')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'reports'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Wrench className="w-4 h-4 text-[#399D9D]" />
          <span>Fault Reports ({faults.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('work_orders')}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-2 ${
            activeTab === 'work_orders'
              ? 'bg-white text-[#164E63] shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4 text-[#399D9D]" />
          <span>Work Orders ({workOrders.length})</span>
        </button>
      </div>

      {/* TAB 1: FAULT REPORTS */}
      {activeTab === 'reports' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reference (FLT-...), category or reporter..."
                className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 min-h-[44px]"
              >
                <option value="all">All Statuses</option>
                <option value="Open">Open</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Resolved">Resolved</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 min-h-[44px]"
              >
                <option value="all">All Priorities</option>
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <select
                value={zoneFilter}
                onChange={(e) => setZoneFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 min-h-[44px]"
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
                    <th className="py-3 px-4">Ref #</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Reporter</th>
                    <th className="py-3 px-4">Location / Zone</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Assigned Tech</th>
                    <th className="py-3 px-4">Reported</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredFaults.map((f) => (
                    <tr
                      key={f.id}
                      onClick={() => setSelectedFault(f)}
                      className="hover:bg-[#FAF8F1] transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                        {f.faultReference}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {f.category}
                      </td>
                      <td className="py-3.5 px-4 text-slate-700">
                        {f.reporterName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[160px]">
                        {f.landmark}, {f.zone.split(':')[0]}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded font-bold text-[10px] uppercase font-mono ${
                            f.priority === 'Critical'
                              ? 'bg-rose-100 text-rose-800'
                              : f.priority === 'High'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {f.priority}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {f.assignedTechnician || 'Unassigned'}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {f.dateReported.split(' ')[0]}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={f.status} size="sm" />
                      </td>
                      <td
                        className="py-3.5 px-4 text-center"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => setSelectedFault(f)}
                          className="px-2.5 py-1 text-xs font-semibold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D4EBEA] rounded-lg transition-colors"
                        >
                          Inspect
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

      {/* TAB 2: WORK ORDERS LIFECYCLE */}
      {activeTab === 'work_orders' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">WO Number</th>
                    <th className="py-3 px-4">Related Fault</th>
                    <th className="py-3 px-4">Technician</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Assigned</th>
                    <th className="py-3 px-4">Due Date</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {workOrders.map((wo) => (
                    <tr key={wo.id} className="hover:bg-[#FAF8F1] transition-colors">
                      <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                        {wo.workOrderNumber}
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-800">
                        {wo.faultReference}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-slate-900">
                        {wo.technicianName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 truncate max-w-[180px]">
                        {wo.location}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {wo.assignedDate}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-500">
                        {wo.dueDate}
                      </td>
                      <td className="py-3.5 px-4">
                        <StatusBadge status={wo.status} size="sm" />
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        {wo.status !== 'Completed' && wo.status !== 'Closed' ? (
                          <button
                            onClick={() => setCompleteWO(wo)}
                            className="px-2.5 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-2xs transition-colors"
                          >
                            Mark Completed
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-semibold font-mono">
                            ✓ Done
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE FAULT REPORT MODAL */}
      {newFaultOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#399D9D]" />
                <h3 className="text-base font-bold text-slate-900">
                  Report Scheme Fault / Maintenance
                </h3>
              </div>
              <button
                onClick={() => setNewFaultOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFault} className="space-y-4 pt-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Fault Category <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={faultCategory}
                    onChange={(e) => setFaultCategory(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                  >
                    <option value="Leakage">Leakage (Meter / Line)</option>
                    <option value="Burst pipe">Burst Main Pipeline</option>
                    <option value="No water supply">No Water Supply</option>
                    <option value="Low water pressure">Low Water Pressure</option>
                    <option value="Faulty meter">Faulty / Stalled Meter</option>
                    <option value="Damaged connection">Damaged Service Connection</option>
                    <option value="Infrastructure damage">Pump / Tank Infrastructure</option>
                    <option value="Other">Other Operational Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Priority Level <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={faultPriority}
                    onChange={(e) => setFaultPriority(e.target.value as any)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                  >
                    <option value="Critical">Critical (Immediate Water Loss)</option>
                    <option value="High">High (Major Leak / Pressure)</option>
                    <option value="Medium">Medium (Household Flow Issue)</option>
                    <option value="Low">Low (Minor Non-Emergency)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Community Zone <span className="text-rose-500">*</span>
                </label>
                <select
                  value={faultZone}
                  onChange={(e) => setFaultZone(e.target.value)}
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                >
                  {ZONES.map((z) => (
                    <option key={z} value={z}>
                      {z}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Exact Location / Landmark <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={faultLandmark}
                  onChange={(e) => setFaultLandmark(e.target.value)}
                  placeholder="e.g. Near Thogoto PCEA Church gate, along main tarmac branch"
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Description of Issue <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={faultDescription}
                  onChange={(e) => setFaultDescription(e.target.value)}
                  placeholder="Please describe where water is escaping or the exact symptom observed..."
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reporter Name
                  </label>
                  <input
                    type="text"
                    required
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Reporter Phone
                  </label>
                  <input
                    type="tel"
                    required
                    value={reporterPhone}
                    onChange={(e) => setReporterPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewFaultOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm"
                >
                  Submit Fault Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* INSPECT FAULT MODAL */}
      {selectedFault && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#164E63] text-sm">
                  {selectedFault.faultReference}
                </span>
                <span className="font-bold text-slate-900">· {selectedFault.category}</span>
                <StatusBadge status={selectedFault.status} size="sm" />
              </div>
              <button
                onClick={() => setSelectedFault(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="p-4 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6] space-y-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Description</span>
                  <p className="text-slate-800 text-sm font-medium mt-0.5">
                    {selectedFault.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Location</span>
                    <span className="font-bold text-slate-800">{selectedFault.landmark}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Zone</span>
                    <span className="text-slate-700">{selectedFault.zone}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Reported By</span>
                    <span className="text-slate-800">
                      {selectedFault.reporterName} ({selectedFault.reporterPhone})
                    </span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Reported Timestamp</span>
                    <span className="font-mono text-slate-700">{selectedFault.dateReported}</span>
                  </div>
                </div>
              </div>

              {/* Assigned Technician or Dispatch action */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-800">Dispatched Technician</span>
                  {selectedFault.assignedTechnician ? (
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                      {selectedFault.assignedTechnician}
                    </span>
                  ) : (
                    <span className="text-rose-600 font-semibold">Unassigned</span>
                  )}
                </div>

                {!selectedFault.assignedTechnician && (
                  <div className="flex items-center gap-2 mt-2">
                    <select
                      id="techSelect"
                      className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs"
                    >
                      <option value="Grace Wambui">Grace Wambui (Senior Technician)</option>
                      <option value="Peter Njoroge">Peter Njoroge (Field Ops)</option>
                    </select>
                    <button
                      onClick={() => {
                        const sel = (document.getElementById('techSelect') as HTMLSelectElement).value;
                        assignFaultTechnician(selectedFault.id, sel, selectedFault.priority);
                        setSelectedFault(null);
                      }}
                      className="px-3 py-1.5 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-lg"
                    >
                      Dispatch Work Order
                    </button>
                  </div>
                )}
              </div>

              {/* Status Audit History */}
              <div>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Status Progression History
                </span>
                <div className="space-y-2">
                  {selectedFault.history.map((h, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-white rounded-lg border border-slate-200 text-[11px] flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#399D9D] mt-0.5 shrink-0" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{h.status}</span>
                          <span className="text-slate-400 font-mono">{h.timestamp}</span>
                        </div>
                        <p className="text-slate-600 mt-0.5">{h.comment || 'Status updated.'}</p>
                        <span className="text-slate-400 block mt-0.5">By: {h.actor}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* COMPLETE WORK ORDER MODAL */}
      {completeWO && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#164E63] mb-1">
              Finalize Work Order {completeWO.workOrderNumber}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Record physical repair steps taken to close out related fault {completeWO.faultReference}.
            </p>

            <form onSubmit={handleCompleteWorkOrderSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Work Performed <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={workPerformed}
                  onChange={(e) => setWorkPerformed(e.target.value)}
                  placeholder="e.g. Replaced 2-inch PVC coupling, sealed collar joints"
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Pressure Verification & Resolution Description <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={resolutionDesc}
                  onChange={(e) => setResolutionDesc(e.target.value)}
                  placeholder="Tested under line pressure (4.0 bar); verified clean water supply restored to nearby households."
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCompleteWO(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-[10px] shadow-sm"
                >
                  Certify Repair Complete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
