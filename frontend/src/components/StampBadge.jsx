import React from 'react';

export function StampBadge({ status = 'pending', className = '' }) {
  const normStatus = String(status).toLowerCase();

  const statusConfig = {
    completed: {
      label: 'COMPLETED',
      styles: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/40 glow-sage',
    },
    in_progress: {
      label: 'IN PROGRESS',
      styles: 'bg-amber-500/15 text-amber-400 border-amber-500/40 glow-brass',
    },
    pending: {
      label: 'PENDING',
      styles: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/40',
    },
    overdue: {
      label: 'OVERDUE',
      styles: 'bg-rose-500/15 text-rose-400 border-rose-500/40 glow-rust',
    },
  };

  const current = statusConfig[normStatus] || statusConfig.pending;

  return (
    <span
      className={`
        inline-flex items-center gap-1 font-mono text-[10px] font-bold px-2 py-0.5 rounded
        uppercase tracking-wider border backdrop-blur-md animate-stamp select-none
        ${current.styles} ${className}
      `}
      style={{
        transform: 'rotate(-2deg)',
      }}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {current.label}
    </span>
  );
}
