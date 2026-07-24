import React from 'react';
import { StampBadge } from './StampBadge';
import { Avatar } from './Avatar';
import { TicketPerforation } from './TicketPerforation';
import { Calendar, Paperclip, MessageSquare, CheckCircle2, Clock } from 'lucide-react';

export function TicketCard({
  id = 'TCK-0000',
  title = 'Untitled Task',
  description = '',
  status = 'pending',
  priority = 'NORMAL',
  assignee = { name: 'Unassigned' },
  dueDate = null,
  fileCount = 0,
  commentCount = 0,
  onClick,
  canComplete = false,
  onToggleComplete,
  className = '',
}) {
  const isCompleted = status === 'completed';

  const handleQuickComplete = (e) => {
    e.stopPropagation();
    if (onToggleComplete) onToggleComplete();
  };

  const getStatusBorderColor = () => {
    switch (status) {
      case 'completed':
        return 'border-t-emerald-500';
      case 'in_progress':
        return 'border-t-amber-500';
      case 'pending':
      default:
        return 'border-t-indigo-500';
    }
  };

  return (
    <div
      onClick={onClick}
      className={`
        glass-card rounded-md p-5 flex flex-col justify-between transition-all duration-200 ease-out
        cursor-pointer group relative overflow-hidden border-t-2 ${getStatusBorderColor()} ${className}
      `}
    >
      {/* Background Subtle Radial Accent */}
      <div className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full bg-amber-500/5 group-hover:bg-amber-500/10 transition-colors pointer-events-none" />

      {/* Top Header Strip */}
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {id}
            </span>
            {priority && (
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {priority}
              </span>
            )}
          </div>

          <StampBadge status={status} />
        </div>

        <TicketPerforation />

        {/* Title */}
        <h3 className="font-display text-lg font-bold text-slate-100 group-hover:text-amber-400 transition-colors line-clamp-2 leading-snug">
          {title}
        </h3>

        {/* Description Snippet */}
        {description && (
          <p className="font-body text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Footer Area */}
      <div className="mt-5 pt-3 border-t border-white/10 flex items-center justify-between gap-2 font-body text-xs">
        {/* Assignee & Due Date */}
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={assignee?.name || 'Unassigned'} size="sm" />
          <div className="min-w-0">
            <p className="text-slate-200 font-semibold text-[11px] truncate">
              {assignee?.name || 'Unassigned'}
            </p>
            {dueDate ? (
              <p className="font-mono text-[10px] text-slate-400 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-amber-400/80" /> {dueDate}
              </p>
            ) : (
              <p className="font-mono text-[10px] text-slate-500">NO DUE DATE</p>
            )}
          </div>
        </div>

        {/* Counters & Quick Complete Action */}
        <div className="flex items-center gap-2">
          {(fileCount > 0 || commentCount > 0) && (
            <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400 bg-slate-800/60 px-2 py-1 rounded border border-white/5">
              {fileCount > 0 && (
                <span className="flex items-center gap-0.5" title={`${fileCount} files`}>
                  <Paperclip className="w-3 h-3 text-amber-400" /> {fileCount}
                </span>
              )}
              {commentCount > 0 && (
                <span className="flex items-center gap-0.5" title={`${commentCount} comments`}>
                  <MessageSquare className="w-3 h-3 text-emerald-400" /> {commentCount}
                </span>
              )}
            </div>
          )}

          {canComplete && (
            <button
              onClick={handleQuickComplete}
              className={`
                p-1.5 rounded transition-all duration-150 cursor-pointer border
                ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 hover:bg-emerald-500/30'
                    : 'bg-slate-800/80 text-slate-400 border-white/10 hover:text-emerald-400 hover:border-emerald-500/40 hover:bg-emerald-500/10'
                }
              `}
              title={isCompleted ? 'Mark as Pending' : 'Mark as Complete'}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
