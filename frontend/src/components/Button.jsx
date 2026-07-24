import React from 'react';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center font-mono font-semibold rounded-md transition-all duration-150 ease-out cursor-pointer select-none disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500';

  const variants = {
    primary:
      'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-bold hover:from-amber-400 hover:to-amber-500 active:scale-[0.98] shadow-md shadow-amber-500/20 border border-amber-400/30',
    secondary:
      'bg-slate-800/80 text-slate-100 border border-white/10 hover:border-white/20 hover:bg-slate-800 active:scale-[0.98]',
    outline:
      'bg-transparent text-slate-200 border border-white/20 hover:border-amber-400 hover:text-amber-400 hover:bg-amber-500/10 active:scale-[0.98]',
    destructive:
      'bg-gradient-to-r from-rose-600 to-rose-700 text-white font-bold hover:from-rose-500 hover:to-rose-600 active:scale-[0.98] shadow-md shadow-rose-500/20 border border-rose-500/30',
    ghost:
      'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-white/5 active:scale-[0.98]',
  };

  const sizes = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-xs px-4 py-2 gap-2',
    lg: 'text-sm px-5 py-2.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
