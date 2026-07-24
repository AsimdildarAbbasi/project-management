import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchMyTasksApi, toggleTaskCompleteApi } from '../api/taskApi';
import { TicketCard } from '../components/TicketCard';
import { TaskFilterBar } from '../components/TaskFilterBar';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Inbox, Archive, CheckSquare } from 'lucide-react';

export function TasksUser() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState('ACTIVE'); // 'ACTIVE' vs 'COMPLETED'
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [sortBy, setSortBy] = useState('due_date');
  const [currentPage, setCurrentPage] = useState(1);

  const PAGE_SIZE = 9;

  // Fetch Assigned Tasks
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['myTasks'],
    queryFn: fetchMyTasksApi,
    staleTime: 30000,
  });

  // Optimistic Toggle Complete Mutation
  const toggleMutation = useMutation({
    mutationFn: (taskId) => toggleTaskCompleteApi(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['myTasks'] });

      const previousTasks = queryClient.getQueryData(['myTasks']);

      queryClient.setQueryData(['myTasks'], (old = []) =>
        old.map((t) => {
          if (t.id === taskId) {
            const nextStatus = t.status === 'completed' ? 'pending' : 'completed';
            return { ...t, status: nextStatus };
          }
          return t;
        })
      );

      return { previousTasks };
    },
    onError: (err, taskId, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(['myTasks'], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });
      queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
    },
  });

  const taskList = Array.isArray(tasks) ? tasks : [];

  // 1. Filter by Tab (Active vs Completed)
  const tabFilteredTasks = taskList.filter((t) => {
    const isDone = String(t.status).toLowerCase() === 'completed';
    if (activeTab === 'ACTIVE') return !isDone;
    return isDone;
  });

  // 2. Filter by Status (Segmented Bar)
  const statusFilteredTasks = tabFilteredTasks.filter((t) => {
    if (selectedStatus === 'ALL') return true;
    return String(t.status).toUpperCase() === selectedStatus;
  });

  // 3. Sort Tasks
  const sortedTasks = [...statusFilteredTasks].sort((a, b) => {
    if (sortBy === 'due_date') {
      if (!a.due_date) return 1;
      if (!b.due_date) return -1;
      return new Date(a.due_date) - new Date(b.due_date);
    }
    if (sortBy === 'created_at') {
      return new Date(b.created_at) - new Date(a.created_at);
    }
    if (sortBy === 'status') {
      return a.status.localeCompare(b.status);
    }
    return 0;
  });

  // 4. Pagination
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / PAGE_SIZE));
  const paginatedTasks = sortedTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const activeCount = taskList.filter((t) => String(t.status).toLowerCase() !== 'completed').length;
  const completedCount = taskList.filter((t) => String(t.status).toLowerCase() === 'completed').length;

  return (
    <div className="space-y-6 font-body">
      {/* Header Strip */}
      <div className="flex items-center justify-between border-b border-slate/20 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-sage uppercase tracking-widest">
            STATION TASK BOARD // MY ASSIGNED STUBS
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">
            My Task Board
          </h1>
        </div>

        <button
          onClick={() => refetch()}
          title="Refresh tasks"
          className="text-slate hover:text-ink p-2 rounded-xs border border-slate/30 hover:border-slate/50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-sage' : ''}`} />
        </button>
      </div>

      {/* Two-Tab Split: Active vs Completed */}
      <div className="border-b border-slate/30 flex items-center gap-6">
        <button
          onClick={() => {
            setActiveTab('ACTIVE');
            setCurrentPage(1);
          }}
          className={`
            pb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer
            ${
              activeTab === 'ACTIVE'
                ? 'border-brass text-ink font-bold'
                : 'border-transparent text-slate hover:text-ink'
            }
          `}
        >
          <CheckSquare className={`w-4 h-4 ${activeTab === 'ACTIVE' ? 'text-brass' : 'text-slate'}`} />
          <span>Active Tickets</span>
          <span className="ml-1 bg-brass/15 text-brass font-bold px-2 py-0.5 rounded-xs text-[10px]">
            {activeCount}
          </span>
        </button>

        <button
          onClick={() => {
            setActiveTab('COMPLETED');
            setCurrentPage(1);
          }}
          className={`
            pb-3 flex items-center gap-2 font-mono text-xs uppercase tracking-wider font-semibold border-b-2 transition-all cursor-pointer
            ${
              activeTab === 'COMPLETED'
                ? 'border-sage text-ink font-bold'
                : 'border-transparent text-slate hover:text-ink'
            }
          `}
        >
          <Archive className={`w-4 h-4 ${activeTab === 'COMPLETED' ? 'text-sage' : 'text-slate'}`} />
          <span>Completed & Filed</span>
          <span className="ml-1 bg-sage/15 text-sage font-bold px-2 py-0.5 rounded-xs text-[10px]">
            {completedCount}
          </span>
        </button>
      </div>

      {/* Filter Bar */}
      <TaskFilterBar
        selectedStatus={selectedStatus}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showAssigneeFilter={false} // Implicitly "me"
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 bg-slate/20 rounded-xs animate-pulse" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-rust/10 border border-rust p-6 rounded-xs space-y-4 text-rust font-body max-w-xl my-6">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <AlertTriangle className="w-5 h-5" />
            <span>Failed to load assigned task board</span>
          </div>
          <p className="text-xs font-mono">{error?.message || 'Server error occurred while fetching tasks.'}</p>
          <Button variant="destructive" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
          </Button>
        </div>
      )}

      {/* Ticket Cards Grid */}
      {!isLoading && !isError && (
        <>
          {paginatedTasks.length === 0 ? (
            <div className="bg-paper-2 border border-slate/30 rounded-xs p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center mx-auto border border-slate/20">
                <Inbox className="w-6 h-6 text-slate" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                {activeTab === 'ACTIVE'
                  ? 'No active tickets assigned to you.'
                  : 'No completed tickets filed away yet.'}
              </h3>
              <p className="font-body text-xs text-slate max-w-sm mx-auto">
                {activeTab === 'ACTIVE'
                  ? 'All clear! When station administration dispatches new work stubs to your account, they will appear here.'
                  : 'Completed task stubs will be archived here for historical record.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedTasks.map((task) => {
                const isAssignedToMe = task.assigned_to === user?.id;
                const isAdmin = user?.role === 'admin';
                const canComplete = isAssignedToMe || isAdmin;

                return (
                  <TicketCard
                    key={task.id}
                    id={`TCK-${String(task.id).padStart(4, '0')}`}
                    title={task.title}
                    description={task.description}
                    status={task.status}
                    priority="NORMAL"
                    assignee={{ name: task.created_by_name || 'Admin' }}
                    dueDate={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null}
                    fileCount={task.file_count || 0}
                    commentCount={task.comment_count || 0}
                    onClick={() => navigate(`/tasks/${task.id}`)}
                    canComplete={canComplete}
                    onToggleComplete={() => toggleMutation.mutate(task.id)}
                  />
                );
              })}
            </div>
          )}

          {/* Clean Pagination Bar */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate/20 pt-4 font-mono text-xs text-slate">
              <span>
                SHOWING PAGE {currentPage} OF {totalPages} ({sortedTasks.length} TICKETS TOTAL)
              </span>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="w-3.5 h-3.5" /> Previous
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`
                        w-7 h-7 rounded-xs font-mono text-xs transition-colors cursor-pointer border
                        ${
                          currentPage === page
                            ? 'bg-ink text-paper border-ink font-bold'
                            : 'bg-paper-2 text-slate border-slate/30 hover:border-slate/60 hover:text-ink'
                        }
                      `}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  variant="secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                >
                  Next <ChevronRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
