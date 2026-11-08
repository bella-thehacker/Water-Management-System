import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { Settings, RefreshCw, Save, Check, Database, MapPin, Building, Shield } from 'lucide-react';
import { ZONES } from '../data/mockData';

export const SettingsPage: React.FC = () => {
  const { resetToDemoData, addToast } = useApp();

  const [orgName, setOrgName] = useState('Kikuyu Community Water Supply Scheme');
  const [address, setAddress] = useState('P.O. Box 244-00902 Kikuyu, Kiambu County, Kenya');
  const [phone, setPhone] = useState('+254 722 000 111');
  const [currency, setCurrency] = useState('KSh (Kenyan Shilling)');
  const [dueDays, setDueDays] = useState(14);
  const [paybillNumber, setPaybillNumber] = useState('400200');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Settings saved',
      message: 'Operational parameters updated.',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <PageHeader
        breadcrumbs={['Management', 'Settings']}
        title="Scheme Settings & Parameters"
        description="Organisation branding, community zone definitions, default billing periods, and database controls."
      />

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Organisation Details */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Building className="w-4 h-4 text-[#399D9D]" />
            <h3 className="text-sm font-bold text-[#164E63]">
              Organisation & Contact Details
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Scheme Display Name
              </label>
              <input
                type="text"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Official Helpline Telephone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Functional Currency
              </label>
              <input
                type="text"
                readOnly
                value={currency}
                className="w-full px-3.5 py-2 bg-slate-100 border border-slate-300 rounded-[10px] text-slate-600"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Postal & Physical Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
              />
            </div>
          </div>
        </div>

        {/* Community Zones */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-[#399D9D]" />
            <h3 className="text-sm font-bold text-[#164E63]">
              Active Community Scheme Zones ({ZONES.length})
            </h3>
          </div>

          <div className="space-y-2">
            {ZONES.map((z, idx) => (
              <div
                key={idx}
                className="p-3 bg-[#FAF8F1] rounded-xl border border-[#E7E2D6] flex items-center justify-between"
              >
                <div>
                  <span className="font-bold text-slate-900">{z}</span>
                  <span className="text-[11px] text-slate-500 block">
                    Gravity feed network via Kikuyu Central reservoir.
                  </span>
                </div>
                <span className="text-emerald-700 font-semibold text-[11px] bg-emerald-50 px-2 py-0.5 rounded">
                  Active Distribution
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Billing & M-Pesa Setup */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield className="w-4 h-4 text-[#399D9D]" />
            <h3 className="text-sm font-bold text-[#164E63]">
              Billing Defaults & M-Pesa Paybill
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                M-Pesa Business Paybill Number
              </label>
              <input
                type="text"
                value={paybillNumber}
                onChange={(e) => setPaybillNumber(e.target.value)}
                className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Default Invoice Payment Terms (Days)
              </label>
              <input
                type="number"
                value={dueDays}
                onChange={(e) => setDueDays(parseInt(e.target.value, 10) || 14)}
                className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px] font-mono"
              />
            </div>
          </div>

          <div className="pt-2 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-xs"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </div>
        </div>

        {/* Data Management & Demo Reset */}
        <div className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 mb-4">
            <Database className="w-4 h-4 text-rose-600" />
            <h3 className="text-sm font-bold text-[#164E63]">
              Demo Reset & Data Storage
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-rose-50/70 rounded-xl border border-rose-200">
            <div>
              <h4 className="font-bold text-rose-900">
                Reset to Original Demonstration Database
              </h4>
              <p className="text-slate-600 text-[11px] mt-0.5">
                Clears all created test customers, readings, and invoices and restores pre-seeded demo records for Mary Wanjiku and Kikuyu community.
              </p>
            </div>
            <button
              type="button"
              onClick={resetToDemoData}
              className="px-4 py-2 text-xs font-bold text-rose-700 bg-white border border-rose-300 hover:bg-rose-100 rounded-xl transition-colors shrink-0"
            >
              Reset Demo Data
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
