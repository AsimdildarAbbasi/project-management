import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAdminDashboard } from '../api/dashboardApi';
import { StampBadge } from '../components/StampBadge';
import { Button } from '../components/Button';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { LedgerStripSkeleton } from '../components/LedgerStripSkeleton';
import {
  Plus,
  RefreshCw,
  FilePlus,
  MessageSquare,
  Paperclip,
  Clock,
  AlertTriangle,
  Activity,
  CheckCircle,
  Clock3,
  Layers,
} from 'lucide-react';

export function DashboardAdmin() {
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: fetchAdminDashboard,
    staleTime: 30000,
  });

  const getActivityIcon = (type) => {
    switch (type) {
      case 'task_created':
        return <FilePlus className="w-4 h-4 text-amber-400" />;
      case 'comment_added':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'file_uploaded':
        return <Paperclip className="w-4 h-4 text-rose-400" />;
      default:
        return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  const getActivityTypeBadge = (type) => {
    switch (type) {
      case 'task_created':
        return <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 uppercase">CREATED</span>;
      case 'comment_added':
        return <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase">COMMENT</span>;
      case 'file_uploaded':
        return <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20 uppercase">FILE</span>;
      default:
        return <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-500/10 text-slate-400 border border-slate-500/20 uppercase">EVENT</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="h-8 w-48 bg-slate-800/50 rounded animate-pulse" />
          <div className="h-9 w-32 bg-slate-800/50 rounded animate-pulse" />
        </div>
        <LedgerStripSkeleton />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-md space-y-4 text-rose-300 font-body max-w-xl my-6 backdrop-blur-md">
        <div className="flex items-center gap-2 font-display text-lg font-bold">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>Failed to load station metrics</span>
        </div>
        <p className="text-xs font-mono text-rose-400/80">{error?.message || 'Server error occurred while fetching admin dashboard.'}</p>
        <Button variant="destructive" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
        </Button>
      </div>
    );
  }

  const {
    total_tasks = 0,
    pending = 0,
    in_progress = 0,
    completed = 0,
    overdue_count = 0,
    recent_activity = [],
  } = data || {};

  return (
    <div className="space-y-8 font-body">
      {/* Top Header Strip with Action Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            STATION OVERVIEW // ADMIN CONTROL
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-100">
            Station Dispatch Control
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            title="Refresh metrics"
            className="text-slate-400 hover:text-slate-100 p-2 rounded-md border border-white/10 hover:border-white/20 bg-slate-900/60 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-amber-400' : ''}`} />
          </button>
          <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4" /> Create Task
          </Button>
        </div>
      </div>

      {/* Overdue Callout Banner */}
      {overdue_count > 0 && (
        <div className="bg-rose-500/10 border border-rose-500/30 p-4 rounded-md flex items-center justify-between gap-3 animate-in fade-in duration-150 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <StampBadge status="OVERDUE" />
            <p className="text-xs font-body font-semibold text-rose-300">
              {overdue_count} {overdue_count === 1 ? 'task is' : 'tasks are'} currently past due date and requiring administrative attention.
            </p>
          </div>
          <span className="font-mono text-xs text-rose-400 font-bold bg-rose-500/20 px-2.5 py-1 rounded border border-rose-500/30">
            {overdue_count} OVERDUE
          </span>
        </div>
      )}

      {/* Stat Grid Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card p-5 rounded-md border-t-2 border-t-amber-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase text-slate-400">TOTAL TASKS</span>
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-slate-100">{total_tasks}</p>
        </div>

        <div className="glass-card p-5 rounded-md border-t-2 border-t-indigo-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase text-slate-400">PENDING</span>
            <div className="p-2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Clock3 className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-indigo-400">{pending}</p>
        </div>

        <div className="glass-card p-5 rounded-md border-t-2 border-t-amber-400 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase text-slate-400">IN PROGRESS</span>
            <div className="p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-amber-400">{in_progress}</p>
        </div>

        <div className="glass-card p-5 rounded-md border-t-2 border-t-emerald-500 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs font-semibold uppercase text-slate-400">COMPLETED</span>
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="font-mono text-3xl font-bold text-emerald-400">{completed}</p>
        </div>
      </section>

      {/* Station Logbook Activity Feed */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" /> Station Logbook Activity
          </h2>
          <span className="font-mono text-xs text-slate-400">LAST 10 EVENTS</span>
        </div>

        <div className="glass-panel rounded-md p-5 space-y-4">
          {recent_activity.length === 0 ? (
            <p className="font-mono text-xs text-slate-400 py-4 text-center">NO LOGBOOK ACTIVITY RECORDED YET.</p>
          ) : (
            <div className="divide-y divide-white/10">
              {recent_activity.map((activity, idx) => (
                <div
                  key={idx}
                  className="py-3 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-white/5 px-3 rounded-md transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 bg-slate-900 rounded border border-white/10 shrink-0">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-body text-xs font-semibold text-slate-200 truncate">
                        {activity.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    {getActivityTypeBadge(activity.type)}
                    <span className="font-mono text-xs text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded border border-white/10">
                      {new Date(activity.timestamp).toLocaleString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
