import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchUserDashboard } from '../api/dashboardApi';
import { TicketCard } from '../components/TicketCard';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, AlertTriangle, CheckSquare, Clock3, Inbox, ArrowRight } from 'lucide-react';

export function DashboardUser() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['userDashboard'],
    queryFn: fetchUserDashboard,
    staleTime: 30000,
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-slate-800/50 rounded animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="h-24 bg-slate-800/50 rounded animate-pulse" />
          <div className="h-24 bg-slate-800/50 rounded animate-pulse" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-rose-500/10 border border-rose-500/30 p-6 rounded-md space-y-4 text-rose-300 font-body max-w-xl my-6 backdrop-blur-md">
        <div className="flex items-center gap-2 font-display text-lg font-bold">
          <AlertTriangle className="w-5 h-5 text-rose-400" />
          <span>Failed to load assigned dashboard metrics</span>
        </div>
        <p className="text-xs font-mono text-rose-400/80">{error?.message || 'Server error occurred while fetching user dashboard.'}</p>
        <Button variant="destructive" size="sm" onClick={() => refetch()}>
          <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
        </Button>
      </div>
    );
  }

  const {
    assigned_total = 0,
    assigned_pending = 0,
    assigned_completed = 0,
    tasks = [],
  } = data || {};

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-widest block mb-1">
            STATION OVERVIEW // MEMBER DISPATCH
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-slate-100">
            Welcome back, {user?.name || 'Station Member'}
          </h1>
        </div>

        <button
          onClick={() => refetch()}
          title="Refresh metrics"
          className="text-slate-400 hover:text-slate-100 p-2 rounded-md border border-white/10 hover:border-white/20 bg-slate-900/60 transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-emerald-400' : ''}`} />
        </button>
      </div>

      {/* Two Metric Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="glass-card p-5 rounded-md border-t-2 border-t-amber-400 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-xs font-semibold uppercase text-slate-400 block">PENDING STUBS</span>
            <p className="font-mono text-3xl font-bold text-amber-400">{assigned_pending}</p>
          </div>
          <div className="p-3 bg-amber-500/10 text-amber-400 rounded-md border border-amber-500/20">
            <Clock3 className="w-6 h-6" />
          </div>
        </div>

        <div className="glass-card p-5 rounded-md border-t-2 border-t-emerald-500 flex items-center justify-between">
          <div className="space-y-1">
            <span className="font-mono text-xs font-semibold uppercase text-slate-400">COMPLETED STUBS</span>
            <p className="font-mono text-3xl font-bold text-emerald-400">{assigned_completed}</p>
          </div>
          <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-md border border-emerald-500/20">
            <CheckSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Recent Assigned Tasks */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" /> My Assigned Work Stubs ({assigned_total})
          </h2>
          <Button variant="outline" size="sm" onClick={() => navigate('/tasks')}>
            View All Stubs <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </div>

        {tasks.length === 0 ? (
          <div className="glass-panel rounded-md p-10 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center mx-auto border border-white/10">
              <Inbox className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-display text-lg font-bold text-slate-100">
              No tasks currently assigned to your account.
            </h3>
            <p className="font-body text-xs text-slate-400 max-w-sm mx-auto">
              When station administrators dispatch new ticket stubs to your user account, they will be listed here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tasks.slice(0, 6).map((task) => (
              <TicketCard
                key={task.id}
                id={`TCK-${String(task.id).padStart(4, '0')}`}
                title={task.title}
                description={task.description}
                status={task.status}
                priority="NORMAL"
                assignee={{ name: user?.name }}
                dueDate={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null}
                fileCount={task.file_count || 0}
                commentCount={task.comment_count || 0}
                onClick={() => navigate(`/tasks/${task.id}`)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
