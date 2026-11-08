import React from 'react';
import { ChevronRight } from 'lucide-react';

interface PageHeaderProps {
  breadcrumbs: string[];
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
    disabled?: boolean;
    loading?: boolean;
  };
  secondaryActions?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  breadcrumbs,
  title,
  description,
  primaryAction,
  secondaryActions,
}) => {
  return (
    <div className="mb-6">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 mb-2">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb}>
            {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
            <span className={idx === breadcrumbs.length - 1 ? 'font-medium text-slate-800' : 'hover:text-slate-700'}>
              {crumb}
            </span>
          </React.Fragment>
        ))}
      </nav>

      {/* Title & Actions Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-extrabold text-[#164E63] tracking-tight">
            {title}
          </h1>
          <p className="text-sm text-slate-600 mt-1 max-w-3xl">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          {secondaryActions?.map((sec, idx) => (
            <button
              key={idx}
              onClick={sec.onClick}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-[#164E63] bg-white border border-[#CBD5E1] rounded-[10px] hover:bg-slate-50 hover:border-[#94A3B8] transition-colors focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[42px]"
            >
              {sec.icon}
              <span className="whitespace-nowrap">{sec.label}</span>
            </button>
          ))}

          {primaryAction && (
            <button
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled || primaryAction.loading}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#399D9D] hover:bg-[#2E8383] active:bg-[#246969] disabled:opacity-50 disabled:cursor-not-allowed rounded-[10px] shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-[#399D9D]/40 min-h-[42px]"
            >
              {primaryAction.loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                primaryAction.icon
              )}
              <span className="whitespace-nowrap">{primaryAction.label}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
