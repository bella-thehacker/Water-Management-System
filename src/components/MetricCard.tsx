import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
  onClick?: () => void;
  accentBorder?: boolean;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-[#E6F3F3]',
  iconColor = 'text-[#399D9D]',
  onClick,
}) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-white rounded-2xl p-5 border border-[#E7E2D6] shadow-sm transition-all duration-200 text-left ${
        onClick
          ? 'cursor-pointer hover:border-[#399D9D]/50 hover:shadow-md hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-[#399D9D]/20'
          : ''
      }`}
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBgColor} ${iconColor}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="text-2xl lg:text-3xl font-bold text-slate-900 tabular-nums tracking-tight mb-1">
        {value}
      </div>

      <div className="text-xs text-slate-500 flex items-center gap-1.5 truncate">
        {subtitle}
      </div>
    </div>
  );
};
