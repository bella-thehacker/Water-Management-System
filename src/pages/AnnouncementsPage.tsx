import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { Megaphone, Plus, Calendar, Users, X, Send } from 'lucide-react';
import { ZONES } from '../data/mockData';

export const AnnouncementsPage: React.FC = () => {
  const { announcements, addAnnouncement, currentUser } = useApp();

  const [modalOpen, setModalOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState<'All customers' | 'Selected zones' | 'All staff' | 'Selected roles'>('All customers');
  const [targetZone, setTargetZone] = useState(ZONES[0]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split('T')[0];
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 14);

    addAnnouncement({
      title,
      message,
      audience,
      targetZone: audience === 'Selected zones' ? targetZone : undefined,
      publishedDate: today,
      expiryDate: expiry.toISOString().split('T')[0],
      status: 'Active',
      author: currentUser?.name || 'Administrator',
    });

    setModalOpen(false);
    setTitle('');
    setMessage('');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Management', 'Announcements']}
        title="Community Announcements"
        description="Broadcast water pressure notices, maintenance alerts, and scheme updates to community zones and staff."
        primaryAction={{
          label: '+ New Announcement',
          icon: <Plus className="w-4 h-4" />,
          onClick: () => setModalOpen(true),
        }}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {announcements.map((anc) => (
          <div
            key={anc.id}
            className="bg-white rounded-2xl p-6 border border-[#E7E2D6] shadow-sm flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="px-2.5 py-1 text-[11px] font-bold text-[#164E63] bg-[#E6F3F3] rounded-lg">
                  {anc.audience} {anc.targetZone ? `· ${anc.targetZone.split(':')[0]}` : ''}
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  {anc.publishedDate}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-2">
                {anc.title}
              </h3>

              <p className="text-xs text-slate-600 leading-relaxed">
                {anc.message}
              </p>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Author: {anc.author}</span>
              <span className="text-emerald-700 font-semibold">Active Notice</span>
            </div>
          </div>
        ))}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-[#164E63]">
                Create Community Announcement
              </h3>
              <button
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4 pt-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Scheduled Pipe Flush in Zone 2"
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Audience
                  </label>
                  <select
                    value={audience}
                    onChange={(e) => setAudience(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                  >
                    <option value="All customers">All customers</option>
                    <option value="Selected zones">Selected zones</option>
                    <option value="All staff">All staff</option>
                  </select>
                </div>

                {audience === 'Selected zones' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Target Zone
                    </label>
                    <select
                      value={targetZone}
                      onChange={(e) => setTargetZone(e.target.value)}
                      className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
                    >
                      {ZONES.map((z) => (
                        <option key={z} value={z}>
                          {z}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Broadcast Message
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Details regarding water pressure, service hours, or payments..."
                  className="w-full px-3.5 py-2 bg-[#FAF8F1] border border-slate-300 rounded-[10px]"
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
                  className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish Notice</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
