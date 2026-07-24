import React from 'react';

export function Input({
  label,
  error,
  type = 'text',
  placeholder = '',
  value,
  onChange,
  disabled = false,
  required = false,
  className = '',
  name,
  id,
  ...props
}) {
  const inputId = id || name || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="space-y-1.5 font-body">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold uppercase tracking-wider text-slate-300"
        >
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
      )}
      <input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        className={`
          w-full bg-slate-900/80 text-slate-100 font-body text-xs p-2.5 rounded-md border border-white/10
          transition-all duration-150 outline-none placeholder:text-slate-500
          focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 focus:bg-slate-900
          disabled:opacity-50 disabled:cursor-not-allowed
          ${error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-[11px] text-rose-400 font-medium mt-0.5">{error}</p>}
    </div>
  );
}
