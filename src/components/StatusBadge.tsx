import React from 'react';

interface StatusBadgeProps {
  status: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const norm = status.toLowerCase();

  let dotColor = 'bg-slate-400';
  let textColor = 'text-slate-700';
  let bgColor = 'bg-slate-100';

  if (['active', 'paid', 'operational', 'completed', 'resolved', 'good', 'excellent'].includes(norm)) {
    dotColor = 'bg-emerald-500';
    textColor = 'text-emerald-800';
    bgColor = 'bg-emerald-50/80 border-emerald-200';
  } else if (['pending', 'pending_review', 'partially_paid', 'in progress', 'assigned', 'fair', 'needs servicing'].includes(norm)) {
    dotColor = 'bg-amber-500';
    textColor = 'text-amber-800';
    bgColor = 'bg-amber-50/80 border-amber-200';
  } else if (['unpaid', 'overdue', 'disconnected', 'suspended', 'critical', 'faulty', 'rejected', 'open'].includes(norm)) {
    dotColor = 'bg-rose-500';
    textColor = 'text-rose-800';
    bgColor = 'bg-rose-50/80 border-rose-200';
  } else if (['closed', 'decommissioned', 'archived', 'awaiting parts'].includes(norm)) {
    dotColor = 'bg-slate-400';
    textColor = 'text-slate-600';
    bgColor = 'bg-slate-100 border-slate-200';
  }

  // Format label
  const formatted = status
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium border rounded-md ${bgColor} ${textColor} ${
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs'
      }`}
    >
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotColor}`} />
      <span className="whitespace-nowrap">{formatted}</span>
    </span>
  );
};
