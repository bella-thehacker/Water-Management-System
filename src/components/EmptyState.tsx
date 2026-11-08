import React from 'react';
import { PipMascot, PipState } from './PipMascot';

interface EmptyStateProps {
  state?: PipState;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  state = 'idle',
  title,
  description,
  action,
}) => {
  return (
    <div className="py-12 px-6 flex flex-col items-center justify-center text-center max-w-md mx-auto">
      <PipMascot state={state} size={110} className="mb-4" />
      <h3 className="text-lg font-bold text-slate-800 tracking-tight mb-1">
        {title}
      </h3>
      <p className="text-sm text-slate-500 mb-5 leading-relaxed">
        {description}
      </p>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#399D9D] hover:bg-[#2E8383] rounded-[10px] shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#399D9D]/30 min-h-[42px]"
        >
          {action.label}
        </button>
      )}
    </div>
  );
};
