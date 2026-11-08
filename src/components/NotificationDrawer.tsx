import React from 'react';
import { useApp } from '../context/AppContext';
import { Bell, CheckCheck, X, FileText, Wrench, CreditCard, Gauge } from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({ isOpen, onClose }) => {
  const { notifications, markNotificationRead, markAllNotificationsRead, setActiveNavPage } = useApp();

  if (!isOpen) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'billing':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'fault':
        return <Wrench className="w-4 h-4 text-amber-500" />;
      case 'payment':
        return <CreditCard className="w-4 h-4 text-emerald-500" />;
      case 'reading':
        return <Gauge className="w-4 h-4 text-teal-600" />;
      default:
        return <Bell className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-slate-900/20 backdrop-blur-2xs"
        onClick={onClose}
      />
      <div className="absolute right-4 top-16 z-50 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-top-2">
        <div className="flex items-center justify-between px-5 py-3.5 bg-slate-50 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Notifications
            </span>
            <span className="px-2 py-0.5 text-[10px] font-bold bg-[#E6F3F3] text-[#164E63] rounded-full">
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={markAllNotificationsRead}
              title="Mark all as read"
              className="text-xs text-slate-500 hover:text-[#399D9D] font-medium flex items-center gap-1"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>Mark read</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
          {notifications.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              No notifications at this time.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                onClick={() => {
                  markNotificationRead(notif.id);
                  setActiveNavPage(notif.linkTo as any);
                  onClose();
                }}
                className={`p-3.5 flex items-start gap-3 cursor-pointer hover:bg-slate-50 transition-colors ${
                  !notif.read ? 'bg-[#FAF8F1]/70' : ''
                }`}
              >
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {notif.title}
                    </h5>
                    {!notif.read && (
                      <span className="w-2 h-2 rounded-full bg-[#399D9D] shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                    {notif.message}
                  </p>
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    {notif.timestamp}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
};
