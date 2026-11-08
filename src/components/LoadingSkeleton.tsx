import React from 'react';

export const LoadingSkeleton: React.FC<{ rows?: number }> = ({ rows = 5 }) => {
  return (
    <div className="space-y-3 animate-pulse">
      <div className="h-10 bg-slate-200/70 rounded-lg w-full mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 py-3 border-b border-slate-100">
          <div className="h-4 bg-slate-200 rounded w-24 shrink-0" />
          <div className="h-4 bg-slate-200/80 rounded w-48 shrink-0" />
          <div className="h-4 bg-slate-200/60 rounded w-32 shrink-0" />
          <div className="h-4 bg-slate-200/50 rounded flex-1" />
          <div className="h-4 bg-slate-200/70 rounded w-20 shrink-0" />
        </div>
      ))}
    </div>
  );
};

export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-3 bg-slate-200 rounded w-24" />
        <div className="w-10 h-10 bg-slate-100 rounded-xl" />
      </div>
      <div className="h-8 bg-slate-200 rounded w-36 mb-2" />
      <div className="h-3 bg-slate-100 rounded w-48" />
    </div>
  );
};
