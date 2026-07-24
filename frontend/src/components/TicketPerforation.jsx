import React from 'react';

export function TicketPerforation({ className = '' }) {
  return (
    <div className={`relative w-full my-3 flex items-center ${className}`}>
      {/* Left circular cutout */}
      <div 
        className="absolute -left-[17px] w-3 h-3 rounded-full bg-paper border-r border-slate/30 z-10" 
        aria-hidden="true"
      />
      
      {/* Dashed perforation line */}
      <div className="w-full border-t border-dashed border-slate/40" aria-hidden="true" />
      
      {/* Right circular cutout */}
      <div 
        className="absolute -right-[17px] w-3 h-3 rounded-full bg-paper border-l border-slate/30 z-10" 
        aria-hidden="true"
      />
    </div>
  );
}
