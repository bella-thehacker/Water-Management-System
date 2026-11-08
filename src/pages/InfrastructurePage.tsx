import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import {
  Building2,
  Plus,
  Wrench,
  Search,
  FilterX,
  X,
  Clock,
  Coins,
  ShieldCheck,
  AlertTriangle,
} from 'lucide-react';
import { Asset } from '../types';
import { ZONES } from '../data/mockData';

export const InfrastructurePage: React.FC = () => {
  const { assets, addAsset, addAssetMaintenance } = useApp();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // Add Asset Modal
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState<Asset['category']>('Pumps');
  const [location, setLocation] = useState('');
  const [zone, setZone] = useState(ZONES[0]);
  const [description, setDescription] = useState('');
  const [responsiblePerson, setResponsiblePerson] = useState('Grace Wambui');

  // Add Maintenance Modal
  const [maintenanceModalOpen, setMaintenanceModalOpen] = useState(false);
  const [maintType, setMaintType] = useState('Quarterly Pump Servicing');
  const [maintCost, setMaintCost] = useState(12000);
  const [maintNotes, setMaintNotes] = useState('');

  // Summaries
  const totalAssets = assets.length;
  const operationalCount = assets.filter((a) => a.operationalStatus === 'Operational').length;
  const underMaintenanceCount = assets.filter((a) => a.operationalStatus === 'Under Maintenance').length;
  const criticalCount = assets.filter((a) => a.condition === 'Critical' || a.condition === 'Needs Servicing').length;

  const filteredAssets = assets.filter((a) => {
    if (categoryFilter !== 'all' && a.category !== categoryFilter) return false;
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      if (
        !a.name.toLowerCase().includes(q) &&
        !a.assetId.toLowerCase().includes(q) &&
        !a.location.toLowerCase().includes(q)
      ) {
        return false;
      }
    }
    return true;
  });

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const nextDate = new Date();
    nextDate.setMonth(nextDate.getMonth() + 3);

    addAsset({
      name,
      category,
      location,
      zone,
      condition: 'Good',
      operationalStatus: 'Operational',
      responsiblePerson,
      installationDate: today,
      lastMaintenanceDate: today,
      nextMaintenanceDate: nextDate.toISOString().split('T')[0],
      description,
    });
    setAddModalOpen(false);
    setName('');
    setLocation('');
    setDescription('');
  };

  const handleAddMaintenanceRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAsset) return;

    addAssetMaintenance(selectedAsset.id, {
      date: new Date().toISOString().split('T')[0],
      type: maintType,
      technician: 'Grace Wambui',
      cost: maintCost,
      notes: maintNotes,
    });
    setMaintenanceModalOpen(false);
    setMaintNotes('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Water Operations', 'Infrastructure']}
        title="Physical Asset Register"
        description="Boreholes, storage reservoirs, booster pumps, pipelines, and preventative maintenance audit logs."
        primaryAction={{
          label: '+ Add Asset',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => setAddModalOpen(true),
        }}
      />

      {/* Summary Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 block">
            Total Assets Recorded
          </span>
          <span className="text-2xl font-bold font-mono text-slate-900 tabular-nums block mt-1">
            {totalAssets}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
            Operational Assets
          </span>
          <span className="text-2xl font-bold font-mono text-emerald-700 tabular-nums block mt-1">
            {operationalCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
            Under Maintenance
          </span>
          <span className="text-2xl font-bold font-mono text-amber-600 tabular-nums block mt-1">
            {underMaintenanceCount}
          </span>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-[#E7E2D6] shadow-2xs">
          <span className="text-xs font-semibold text-rose-700 uppercase tracking-wider block">
            Needs Servicing / Critical
          </span>
          <span className="text-2xl font-bold font-mono text-rose-600 tabular-nums block mt-1">
            {criticalCount}
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
            placeholder="Search asset ID, name or location..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F1] border border-[#CBD5E1] rounded-[10px] focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[44px]"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-xs font-medium text-slate-700 bg-white border border-[#CBD5E1] rounded-[10px] px-3 py-2 min-h-[44px]"
          >
            <option value="all">All Asset Categories</option>
            <option value="Water sources">Water sources</option>
            <option value="Storage tanks">Storage tanks</option>
            <option value="Pumps">Pumps</option>
            <option value="Pipelines">Pipelines</option>
            <option value="Valves">Valves</option>
            <option value="Distribution points">Distribution points</option>
          </select>
        </div>
      </div>

      {/* Assets Table */}
      <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Asset ID</th>
                <th className="py-3 px-4">Asset Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Condition</th>
                <th className="py-3 px-4">Operational Status</th>
                <th className="py-3 px-4">Last Service</th>
                <th className="py-3 px-4">Next Due</th>
                <th className="py-3 px-4 text-center">Inspect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => (
                <tr
                  key={asset.id}
                  onClick={() => setSelectedAsset(asset)}
                  className="hover:bg-[#FAF8F1] transition-colors cursor-pointer"
                >
                  <td className="py-3.5 px-4 font-mono font-bold text-[#164E63]">
                    {asset.assetId}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-slate-900">
                    {asset.name}
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {asset.category}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 truncate max-w-[160px]">
                    {asset.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={asset.condition} size="sm" />
                  </td>
                  <td className="py-3.5 px-4">
                    <StatusBadge status={asset.operationalStatus} size="sm" />
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {asset.lastMaintenanceDate}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-500">
                    {asset.nextMaintenanceDate}
                  </td>
                  <td
                    className="py-3.5 px-4 text-center"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      onClick={() => setSelectedAsset(asset)}
                      className="px-2.5 py-1 text-xs font-semibold text-[#164E63] bg-[#E6F3F3] hover:bg-[#D4EBEA] rounded-lg transition-colors"
                    >
                      History ({asset.maintenanceHistory.length})
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ASSET DETAIL & SERVICE LOG MODAL */}
      {selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-xl border border-slate-200 p-6 overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-[#164E63] text-sm">
                  {selectedAsset.assetId}
                </span>
                <span className="font-bold text-slate-900">· {selectedAsset.name}</span>
                <StatusBadge status={selectedAsset.operationalStatus} size="sm" />
              </div>
              <button
                onClick={() => setSelectedAsset(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 pt-4 text-xs">
              <div className="p-4 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6] space-y-2">
                <div>
                  <span className="text-[11px] text-slate-400 block">Description</span>
                  <p className="text-slate-800 text-xs font-medium mt-0.5">
                    {selectedAsset.description}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60">
                  <div>
                    <span className="text-[11px] text-slate-400 block">Category</span>
                    <span className="font-bold text-slate-800">{selectedAsset.category}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Location</span>
                    <span className="text-slate-700">{selectedAsset.location}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Responsible Person</span>
                    <span className="text-slate-800">{selectedAsset.responsiblePerson}</span>
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-400 block">Installed On</span>
                    <span className="font-mono text-slate-700">{selectedAsset.installationDate}</span>
                  </div>
                </div>
              </div>

              {/* Maintenance History List */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Maintenance History ({selectedAsset.maintenanceHistory.length} records)
                  </h4>
                  <button
                    onClick={() => setMaintenanceModalOpen(true)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#399D9D] hover:underline"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Service</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {selectedAsset.maintenanceHistory.map((rec) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-white rounded-xl border border-slate-200 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900">{rec.type}</span>
                        <span className="font-mono text-slate-500 text-[11px]">{rec.date}</span>
                      </div>
                      <p className="text-slate-600 mt-1">{rec.notes}</p>
                      <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                        <span>Technician: {rec.technician}</span>
                        <span className="font-mono font-bold text-slate-700">
                          Cost: KSh {rec.cost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADD ASSET MODAL */}
      {addModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#164E63] mb-1">
              Add Infrastructure Asset
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Register a borehole, storage tank, booster pump, or trunk pipeline into the scheme register.
            </p>

            <form onSubmit={handleCreateAsset} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Asset Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Ondiri Wetland Deep Borehole #2"
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                >
                  <option value="Water sources">Water sources</option>
                  <option value="Storage tanks">Storage tanks</option>
                  <option value="Pumps">Pumps</option>
                  <option value="Pipelines">Pipelines</option>
                  <option value="Valves">Valves</option>
                  <option value="Distribution points">Distribution points</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Location & Zone
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Ondiri Sanctuary, Zone 3"
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Technical Description & Specifications
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g. 18.5kW submersible pump with digital telemetry controller..."
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm"
                >
                  Register Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LOG MAINTENANCE MODAL */}
      {maintenanceModalOpen && selectedAsset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <h3 className="text-base font-bold text-[#164E63] mb-1">
              Log Preventative Maintenance
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Recording maintenance service for {selectedAsset.name}.
            </p>

            <form onSubmit={handleAddMaintenanceRecord} className="space-y-3 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Maintenance Type
                </label>
                <input
                  type="text"
                  required
                  value={maintType}
                  onChange={(e) => setMaintType(e.target.value)}
                  placeholder="e.g. Impeller replacement & motor rewinding"
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Total Servicing Cost (KSh)
                </label>
                <input
                  type="number"
                  required
                  value={maintCost}
                  onChange={(e) => setMaintCost(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Service Notes & Observations
                </label>
                <textarea
                  rows={2}
                  required
                  value={maintNotes}
                  onChange={(e) => setMaintNotes(e.target.value)}
                  placeholder="e.g. Flushed cooling jackets, greased bearings, static test passed."
                  className="w-full px-3 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setMaintenanceModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-[10px]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm"
                >
                  Save Maintenance Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
