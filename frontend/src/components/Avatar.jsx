import React from 'react';

export function Avatar({ name = '', src = null, size = 'md', className = '' }) {
  const getInitials = (str) => {
    if (!str) return 'U';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const sizeClasses = {
    sm: 'w-6 h-6 text-xs',
    md: 'w-8 h-8 text-xs font-semibold',
    lg: 'w-10 h-10 text-sm font-semibold',
  };

  return (
    <div
      className={`
        relative inline-flex items-center justify-center rounded-full
        bg-paper-2 border border-slate/30 text-ink font-mono shrink-0 overflow-hidden
        ${sizeClasses[size] || sizeClasses.md}
        ${className}
      `}
      title={name}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span>{getInitials(name)}</span>
      )}
    </div>
  );
}
