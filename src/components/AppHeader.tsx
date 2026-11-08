import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Bell,
  HelpCircle,
  User as UserIcon,
  LogOut,
  ChevronDown,
  Layers,
} from 'lucide-react';
import { NotificationDrawer } from './NotificationDrawer';

export const AppHeader: React.FC = () => {
  const {
    activeNavPage,
    currentUser,
    users,
    switchUser,
    logout,
    notifications,
    setSearchOpen,
    setActiveNavPage,
  } = useApp();

  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Context breadcrumb label
  const getContextLabel = () => {
    switch (activeNavPage) {
      case 'overview':
        return 'Overview';
      case 'customers':
      case 'customer_detail':
      case 'add_customer':
        return 'Water Operations / Customers';
      case 'connections':
        return 'Water Operations / Connections & Meters';
      case 'readings':
        return 'Water Operations / Meter Readings';
      case 'billing':
        return 'Water Operations / Billing & Invoices';
      case 'payments':
        return 'Water Operations / Payments';
      case 'faults':
        return 'Water Operations / Fault Reports';
      case 'infrastructure':
        return 'Water Operations / Infrastructure';
      case 'reports':
        return 'Management / Reports & Analytics';
      case 'announcements':
        return 'Management / Announcements';
      case 'users':
        return 'Management / User Management';
      case 'audit_logs':
        return 'Management / Audit Logs';
      case 'settings':
        return 'Management / Settings';
      default:
        return 'Workspace';
    }
  };

  return (
    <header className="h-[72px] bg-white border-b border-[#E7E2D6] px-6 flex items-center justify-between sticky top-0 z-20 shrink-0 select-none no-print">
      {/* Left: Breadcrumb / context */}
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold text-slate-500 font-mono">
          {getContextLabel()}
        </span>
      </div>

      {/* Right: Search, Notifications, User Switcher, Profile */}
      <div className="flex items-center gap-3">
        {/* Search trigger button */}
        <button
          onClick={() => setSearchOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-400 bg-[#FAF8F1] hover:bg-slate-100 hover:text-slate-600 border border-[#E7E2D6] rounded-xl transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search scheme records...</span>
          <kbd className="hidden sm:inline px-1.5 py-0.5 text-[10px] font-mono bg-white border border-slate-200 rounded shadow-2xs text-slate-400">
            ⌘K
          </kbd>
        </button>

      

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#399D9D] rounded-full ring-2 ring-white" />
            )}
          </button>
          <NotificationDrawer isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

        {/* Help icon */}
        <button
          onClick={() => setActiveNavPage('settings')}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors hidden sm:block"
          title="Scheme documentation & settings"
        >
          <HelpCircle className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-6 bg-slate-200 mx-1 hidden sm:block" />

        {/* User Profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#164E63] text-white flex items-center justify-center font-bold text-xs ring-2 ring-[#399D9D]/30 shrink-0">
              {currentUser?.name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2) || 'KW'}
            </div>
            <div className="hidden md:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {currentUser?.name || 'Staff User'}
              </div>
              <div className="text-[10px] text-slate-500 font-medium capitalize">
                {currentUser?.role.replace('_', ' ') || 'Officer'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {profileOpen && (
            <>
              <div
                className="fixed inset-0 z-30"
                onClick={() => setProfileOpen(false)}
              />
              <div className="absolute right-0 top-12 z-40 w-52 bg-white rounded-xl shadow-xl border border-slate-200 py-1 text-xs text-slate-700 animate-in fade-in slide-in-from-top-2">
                <div className="px-3.5 py-2 border-b border-slate-100">
                  <div className="font-bold text-slate-900">{currentUser?.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">
                    {currentUser?.email}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setActiveNavPage('settings');
                    setProfileOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left hover:bg-slate-50 flex items-center gap-2"
                >
                  <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>My Profile & Preferences</span>
                </button>

                <div className="border-t border-slate-100 my-1" />

                <button
                  onClick={() => {
                    logout();
                    setProfileOpen(false);
                  }}
                  className="w-full px-3.5 py-2 text-left text-rose-600 hover:bg-rose-50 flex items-center gap-2 font-medium"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign out</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
