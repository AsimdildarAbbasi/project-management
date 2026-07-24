import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from './Button';

export function Modal({ isOpen, onClose, title, children, className = '' }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'auto';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-ink/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Box */}
      <div
        className={`
          relative w-full max-w-lg rounded-sm bg-paper border border-slate/30 p-6 shadow-xl z-10
          font-body space-y-4 animate-in fade-in zoom-in-95 duration-150
          ${className}
        `}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-slate/20 pb-3">
          <h2 className="font-display text-xl font-semibold text-ink">{title}</h2>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            aria-label="Close modal"
            className="p-1 rounded-full !bg-transparent border-none text-slate hover:text-ink"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div>{children}</div>
      </div>
    </div>
  );
}
