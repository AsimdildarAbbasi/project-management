import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchTasksApi, toggleTaskCompleteApi } from '../api/taskApi';
import { apiClient } from '../api/axios';
import { TicketCard } from '../components/TicketCard';
import { TaskFilterBar } from '../components/TaskFilterBar';
import { Button } from '../components/Button';
import { CreateTaskModal } from '../components/CreateTaskModal';
import { useAuth } from '../context/AuthContext';
import { Plus, RefreshCw, AlertTriangle, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';

export function TasksAdmin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [sortBy, setSortBy] = useState('due_date');
  const [currentPage, setCurrentPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const PAGE_SIZE = 9;

  // Fetch Team Users for Assignee Filter
  const { data: usersData } = useQuery({
    queryKey: ['usersList'],
    queryFn: async () => {
      const res = await apiClient.get('/users');
      return res.data?.users || [];
    },
    staleTime: 60000,
  });

  // Fetch Tasks with filters
  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['tasks', selectedStatus, selectedAssignee],
    queryFn: () => fetchTasksApi({ status: selectedStatus, assigned_to: selectedAssignee }),
    staleTime: 30000,
  });

  // Optimistic Toggle Complete Mutation
  const toggleMutation = useMutation({
    mutationFn: (taskId) => toggleTaskCompleteApi(taskId),
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });

      const previousTasks = queryClient.getQueryData(['tasks', selectedStatus, selectedAssignee]);

      queryClient.setQueryData(['tasks', selectedStatus, selectedAssignee], (old = []) =>
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
        queryClient.setQueryData(['tasks', selectedStatus, selectedAssignee], context.previousTasks);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });

  const taskList = Array.isArray(tasks) ? tasks : [];

  // Sort tasks
  const sortedTasks = [...taskList].sort((a, b) => {
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

  // Pagination slicing
  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / PAGE_SIZE));
  const paginatedTasks = sortedTasks.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  return (
    <div className="space-y-6 font-body">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate/20 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-brass uppercase tracking-widest">
            STATION TASK BOARD // MASTER LEDGER
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">
            Master Dispatch Board
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => refetch()}
            title="Refresh tasks"
            className="text-slate hover:text-ink p-2 rounded-xs border border-slate/30 hover:border-slate/50 transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-brass' : ''}`} />
          </button>
          <Button variant="primary" onClick={() => setCreateModalOpen(true)}>
            <Plus className="w-4 h-4" /> Issue Ticket
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <TaskFilterBar
        selectedStatus={selectedStatus}
        onStatusChange={(status) => {
          setSelectedStatus(status);
          setCurrentPage(1);
        }}
        selectedAssignee={selectedAssignee}
        onAssigneeChange={(assigneeId) => {
          setSelectedAssignee(assigneeId);
          setCurrentPage(1);
        }}
        assignees={usersData || []}
        sortBy={sortBy}
        onSortChange={setSortBy}
        showAssigneeFilter={true}
      />

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-48 bg-slate/20 rounded-xs animate-pulse" />
          ))}
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-rust/10 border border-rust p-6 rounded-xs space-y-4 text-rust font-body max-w-xl my-6">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <AlertTriangle className="w-5 h-5" />
            <span>Failed to load master task board</span>
          </div>
          <p className="text-xs font-mono">{error?.message || 'Server error occurred while fetching tasks.'}</p>
          <Button variant="destructive" size="sm" onClick={() => refetch()}>
            <RefreshCw className="w-3.5 h-3.5" /> Retry Fetch
          </Button>
        </div>
      )}

      {/* Grid of TicketCards */}
      {!isLoading && !isError && (
        <>
          {paginatedTasks.length === 0 ? (
            <div className="bg-paper-2 border border-slate/30 rounded-xs p-10 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center mx-auto border border-slate/20">
                <Inbox className="w-6 h-6 text-slate" />
              </div>
              <h3 className="font-display text-lg font-bold text-ink">
                No dispatch tickets match the selected filters.
              </h3>
              <p className="font-body text-xs text-slate max-w-sm mx-auto">
                Try selecting a different status filter or clear assignee filtering to view other stubs.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedTasks.map((task) => (
                <TicketCard
                  key={task.id}
                  id={`TCK-${String(task.id).padStart(4, '0')}`}
                  title={task.title}
                  description={task.description}
                  status={task.status}
                  priority="NORMAL"
                  assignee={{ name: task.assigned_to_name || 'Unassigned' }}
                  dueDate={task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : null}
                  fileCount={task.file_count || 0}
                  commentCount={task.comment_count || 0}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                  canComplete={true}
                  onToggleComplete={() => toggleMutation.mutate(task.id)}
                />
              ))}
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

      {/* Create Task Modal */}
      <CreateTaskModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
      />
    </div>
  );
}
