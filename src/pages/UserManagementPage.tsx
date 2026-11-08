import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/PageHeader';
import { StatusBadge } from '../components/StatusBadge';
import {
  UserPlus,
  X,
  Shield,
  ShieldCheck,
  Trash2,
  AlertTriangle,
  Mail,
  Phone,
  UserCheck,
} from 'lucide-react';
import { User, UserRole } from '../types';

export const UserManagementPage: React.FC = () => {
  const { users, currentUser, switchUser, addUser, removeUser } = useApp();

  const isAdmin = currentUser?.role === 'admin';

  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Form states for creating staff
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+254 7');
  const [role, setRole] = useState<UserRole>('technician');
  const [zone, setZone] = useState('Zone 1: Kikuyu Township');

  const handleCreateStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    addUser({
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      zone: role === 'technician' || role === 'reader' ? zone : undefined,
    });

    setCreateModalOpen(false);
    setName('');
    setEmail('');
    setPhone('+254 7');
    setRole('technician');
    setZone('Zone 1: Kikuyu Township');
  };

  const handleInitiateDelete = (user: User) => {
    setUserToDelete(user);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    const result = removeUser(userToDelete.id);
    if (result.success) {
      setDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        breadcrumbs={['Management', 'User Management']}
        title="Scheme Staff & User Access"
        description="System administrators, billing officers, meter readers, and field maintenance technicians."
        primaryAction={{
          label: '+ Add Staff Account',
          icon: <UserPlus className="w-4 h-4" />,
          onClick: () => setCreateModalOpen(true),
        }}
      />

      {/* Role Access & Permission Status Banner */}
      {isAdmin ? (
        <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="font-bold text-emerald-950 flex items-center gap-1.5">
                <span>Administrator Session Active:</span>
                <span className="font-mono text-emerald-800">{currentUser?.name}</span>
              </div>
              <p className="text-emerald-800 text-[11px] mt-0.5">
                You have full administrative privileges to provision new credentials and decommission/remove staff accounts.
              </p>
            </div>
          </div>
          <span className="inline-flex items-center gap-1 px-3 py-1 text-[11px] font-bold bg-emerald-200/80 text-emerald-900 rounded-lg shrink-0 self-start sm:self-auto">
            <Shield className="w-3.5 h-3.5" />
            Staff Removal Enabled
          </span>
        </div>
      ) : (
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5 text-amber-700" />
            </div>
            <div>
              <div className="font-bold text-amber-950 flex items-center gap-1.5">
                <span>Current Role:</span>
                <span className="capitalize">{currentUser?.name} ({currentUser?.role?.replace('_', ' ')})</span>
              </div>
              <p className="text-amber-800 text-[11px] mt-0.5">
                Removing or decommissioning staff accounts requires System Administrator access.
              </p>
            </div>
          </div>
          {users.some((u) => u.role === 'admin') && (
            <button
              onClick={() => {
                const adminUser = users.find((u) => u.role === 'admin');
                if (adminUser) switchUser(adminUser.id);
              }}
              className="px-3.5 py-2 text-xs font-bold text-amber-950 bg-amber-200 hover:bg-amber-300 rounded-xl transition-colors shrink-0 flex items-center gap-1.5 shadow-2xs self-start sm:self-auto"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Switch to Admin ({users.find((u) => u.role === 'admin')?.name})</span>
            </button>
          )}
        </div>
      )}

      {/* Staff Directory Table */}
      <div className="bg-white rounded-2xl border border-[#E7E2D6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Staff Member</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Last Login</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map((u) => {
                const isCurrent = currentUser?.id === u.id;
                const isAdminAccount = u.role === 'admin';
                const adminCount = users.filter((usr) => usr.role === 'admin').length;
                const isOnlyAdmin = isAdminAccount && adminCount <= 1;

                return (
                  <tr key={u.id} className="hover:bg-[#FAF8F1] transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#164E63] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                          {u.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')
                            .substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span>{u.name}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded font-mono font-medium">
                                You
                              </span>
                            )}
                          </div>
                          {u.zone && (
                            <span className="text-[11px] text-slate-400 font-normal block">
                              {u.zone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-semibold text-[#164E63] bg-[#E6F3F3] px-2 py-0.5 rounded capitalize inline-flex items-center gap-1">
                        {u.role === 'admin' && <Shield className="w-3 h-3 text-[#399D9D]" />}
                        <span>{u.role.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-mono text-[11px]">{u.email}</td>
                    <td className="py-3.5 px-4 font-mono text-slate-600">{u.phone}</td>
                    <td className="py-3.5 px-4">
                      <StatusBadge status={u.accountStatus} size="sm" />
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {u.lastLogin || 'Never'}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        {/* Simulate Switch / Login */}
                        <button
                          onClick={() => switchUser(u.id)}
                          className="px-2.5 py-1 text-xs font-semibold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-lg shadow-2xs transition-colors"
                          title={`Simulate login as ${u.name}`}
                        >
                          Login As
                        </button>

                        {/* Remove Staff Button */}
                        {isAdmin ? (
                          isCurrent ? (
                            <span
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed select-none"
                              title="Cannot remove currently logged-in administrator"
                            >
                              Active User
                            </span>
                          ) : isOnlyAdmin ? (
                            <span
                              className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 bg-slate-100 rounded-lg cursor-not-allowed select-none"
                              title="Cannot remove the sole administrator"
                            >
                              Sole Admin
                            </span>
                          ) : (
                            <button
                              onClick={() => handleInitiateDelete(u)}
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 hover:border-rose-600 rounded-lg transition-all shadow-2xs"
                              title={`Remove ${u.name} from staff directory`}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              <span>Remove</span>
                            </button>
                          )
                        ) : (
                          <button
                            onClick={() => {
                              const adminUser = users.find((usr) => usr.role === 'admin');
                              if (adminUser) {
                                switchUser(adminUser.id);
                                handleInitiateDelete(u);
                              }
                            }}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-slate-500 hover:text-rose-600 bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 rounded-lg transition-colors"
                            title="Switch to Admin and remove this staff member"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-slate-400" />
                            <span>Remove</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM STAFF REMOVAL MODAL */}
      {deleteModalOpen && userToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7 space-y-5 animate-in zoom-in-95">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-6 h-6 text-rose-600" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900">
                  Remove Staff Member?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This will decommission the account and permanently revoke all system credentials.
                </p>
              </div>
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Target Staff Summary Box */}
            <div className="p-4 bg-[#FAF8F1] rounded-2xl border border-[#E7E2D6] space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Staff Member:</span>
                <span className="font-bold text-slate-900">{userToDelete.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Assigned Role:</span>
                <span className="font-semibold text-[#164E63] bg-[#E6F3F3] px-2 py-0.5 rounded capitalize text-[11px]">
                  {userToDelete.role.replace('_', ' ')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Email Address:</span>
                <span className="font-mono text-slate-700">{userToDelete.email}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Phone Contact:</span>
                <span className="font-mono text-slate-700">{userToDelete.phone}</span>
              </div>
              {userToDelete.zone && (
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Assigned Zone:</span>
                  <span className="text-slate-700">{userToDelete.zone}</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-[11px] text-rose-900 leading-relaxed">
              <strong>Audit Record Notice:</strong> This action will be logged in the permanent Kikuyu Water operations audit log with your administrator signature and timestamp.
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setUserToDelete(null);
                }}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirm & Remove Staff</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE STAFF MODAL */}
      {createModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-200 p-6 sm:p-7">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#E6F3F3] text-[#164E63] flex items-center justify-center font-bold">
                  <UserPlus className="w-4 h-4 text-[#399D9D]" />
                </div>
                <h3 className="text-base font-extrabold text-[#164E63]">
                  Create Staff Account
                </h3>
              </div>
              <button
                onClick={() => setCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateStaffSubmit} className="space-y-3.5 pt-4 text-xs">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Karanja"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.karanja@kikuyuwater.co.ke"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+254 712 345 678"
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] text-xs font-mono font-medium focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Assigned Operational Role
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                >
                  <option value="billing_officer">Billing Officer</option>
                  <option value="technician">Maintenance Technician</option>
                  <option value="reader">Meter Reader</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>

              {(role === 'technician' || role === 'reader') && (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Assigned Field Zone
                  </label>
                  <select
                    value={zone}
                    onChange={(e) => setZone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-[#FAF8F1] border border-slate-300 rounded-[10px] text-xs font-medium focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30"
                  >
                    <option value="Zone 1: Kikuyu Township">Zone 1: Kikuyu Township</option>
                    <option value="Zone 2: Thogoto & Highlands">Zone 2: Thogoto & Highlands</option>
                    <option value="Zone 3: Ondiri Swamp Area">Zone 3: Ondiri Swamp Area</option>
                    <option value="Zone 4: Gitaru Junction">Zone 4: Gitaru Junction</option>
                  </select>
                </div>
              )}

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-xl shadow-xs transition-colors"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
