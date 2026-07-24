import React from 'react';
import { TicketPerforation } from '../components/TicketPerforation';
import { StampBadge } from '../components/StampBadge';

export function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="min-h-screen flex bg-paper text-ink font-body">
      {/* Left Panel: Ink Background, Desktop (~45% width) */}
      <div className="hidden lg:flex lg:w-[45%] bg-ink text-paper p-12 flex-col justify-between relative overflow-hidden select-none">
        {/* Background Watermark Decoration */}
        <div className="absolute -right-16 -bottom-16 opacity-5 pointer-events-none font-display text-9xl font-bold tracking-tighter text-paper">
          DISPATCH
        </div>

        {/* Top Header */}
        <div className="space-y-6 relative z-10">
          <div className="flex items-center gap-3">
            <span className="w-3.5 h-3.5 rounded-full bg-brass" />
            <span className="font-display font-bold text-2xl tracking-wide text-paper">
              DISPATCH<span className="text-brass">.</span>
            </span>
          </div>

          <div className="pt-8 space-y-3">
            <span className="font-mono text-xs font-semibold text-brass uppercase tracking-widest bg-paper/10 px-2.5 py-1 rounded-xs inline-block">
              OFFICE #01 // LOGBOOK CONTROL
            </span>
            <h1 className="font-display text-4xl font-bold leading-tight text-paper">
              Every task, tracked like it matters.
            </h1>
            <p className="font-body text-paper/70 text-sm max-w-md leading-relaxed">
              Purpose-built dispatch management for modern engineering teams. No fluff, no generic dashboard clutter — just clear stubs, priority routing, and real-time accountability.
            </p>
          </div>
        </div>

        {/* Center Ledger Stub Decoration */}
        <div className="relative z-10 bg-paper/5 border border-paper/15 p-5 rounded-xs space-y-3 my-8">
          <div className="flex items-center justify-between font-mono text-xs text-paper/60">
            <span>TCK-DISPATCH-DESK</span>
            <StampBadge status="ACTIVE" className="!text-[10px] !py-0" />
          </div>
          <TicketPerforation className="!my-2 border-paper/20" />
          <div className="font-mono text-xs text-paper/80 space-y-1">
            <p>SYSTEM: ONLINE</p>
            <p>SECURITY: 24-HOUR JWT AUTH</p>
            <p>DB CONNECTION: POSTGRESQL POOL READY</p>
          </div>
        </div>

        {/* Footer */}
        <div className="font-mono text-xs text-paper/40 relative z-10 flex items-center justify-between border-t border-paper/10 pt-4">
          <span>&copy; {new Date().getFullYear()} DISPATCH SYSTEM</span>
          <span>STATION ID: 01-A</span>
        </div>
      </div>

      {/* Right Panel: Form Container (Paper background, Vertically Centered) */}
      <div className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 relative">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Mobile Header Wordmark */}
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <span className="w-3 h-3 rounded-full bg-brass" />
            <span className="font-display font-bold text-xl tracking-wide text-ink">
              DISPATCH<span className="text-brass">.</span>
            </span>
          </div>

          {/* Form Header */}
          <div className="space-y-1">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="font-body text-xs text-slate">{subtitle}</p>
            )}
          </div>

          {/* Form Children */}
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
