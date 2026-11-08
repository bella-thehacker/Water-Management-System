import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastNotification: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none no-print">
      {toasts.map((toast) => {
        let icon = <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />;
        let border = 'border-emerald-200 bg-white';

        if (toast.type === 'error') {
          icon = <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />;
          border = 'border-rose-200 bg-white';
        } else if (toast.type === 'info') {
          icon = <Info className="w-5 h-5 text-[#399D9D] shrink-0 mt-0.5" />;
          border = 'border-[#399D9D]/30 bg-white';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg ${border} transition-all duration-300 animate-in fade-in slide-in-from-bottom-2`}
          >
            {icon}
            <div className="flex-1 min-w-0">
              <h5 className="text-xs font-bold text-slate-900 tracking-tight">
                {toast.title}
              </h5>
              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                {toast.message}
              </p>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-600 p-0.5 rounded shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
