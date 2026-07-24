import React from 'react';

export function LedgerStripSkeleton() {
  return (
    <div className="bg-paper-2 border border-slate/30 rounded-xs p-4 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
      <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-4 w-full divide-y sm:divide-y-0 sm:divide-x divide-slate/20">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="pt-2 sm:pt-0 sm:px-4 space-y-1.5 first:pl-0">
            <div className="h-7 w-12 bg-slate/20 rounded-xs" />
            <div className="h-3 w-20 bg-slate/20 rounded-xs" />
          </div>
        ))}
      </div>
    </div>
  );
}
