import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';
import { TicketPerforation } from './TicketPerforation';
import { apiClient } from '../api/axios';
import { fetchUsersApi } from '../api/userApi';
import { Loader2, PlusCircle, AlertCircle } from 'lucide-react';

export function CreateTaskModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
  });
  const [error, setError] = useState(null);

  // Fetch users for Assignee dropdown
  const { data: users = [] } = useQuery({
    queryKey: ['usersList'],
    queryFn: fetchUsersApi,
    enabled: isOpen,
    staleTime: 60000,
  });

  const createTaskMutation = useMutation({
    mutationFn: (newTasksData) => apiClient.post('/tasks', newTasksData),
    onSuccess: () => {
      // Invalidate relevant TanStack Query caches so lists update instantly
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['userDashboard'] });
      queryClient.invalidateQueries({ queryKey: ['myTasks'] });

      // Reset & close
      setFormData({ title: '', description: '', assigned_to: '', due_date: '' });
      setError(null);
      onClose();
    },
    onError: (err) => {
      const msg = err.response?.data?.message || err.response?.data?.error || 'Failed to dispatch ticket.';
      setError(msg);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setError('Ticket title is required.');
      return;
    }

    createTaskMutation.mutate({
      title: formData.title.trim(),
      description: formData.description.trim() || null,
      assigned_to: formData.assigned_to ? Number(formData.assigned_to) : null,
      due_date: formData.due_date || null,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Issue Dispatch Ticket">
      <form onSubmit={handleSubmit} className="space-y-4 font-body" noValidate>
        {/* Ticket Auto-Preview Header Stub */}
        <div className="bg-paper border border-slate/20 p-3 rounded-xs flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brass" />
            <span className="font-bold text-slate uppercase">NEW TICKET DISPATCH</span>
          </div>
          <span className="font-bold text-slate/50 bg-paper-2 px-2 py-0.5 rounded-xs border border-slate/20">
            TCK-XXXX
          </span>
        </div>

        <TicketPerforation />

        {/* Server Error Banner */}
        {error && (
          <div className="bg-rust/10 border border-rust text-rust p-3 rounded-xs text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Title */}
        <Input
          label="Ticket Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="e.g. Implement User Role Update Endpoint"
          disabled={createTaskMutation.isPending}
          required
        />

        {/* Description */}
        <div className="space-y-1">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Detailed instructions and requirements..."
            rows={3}
            disabled={createTaskMutation.isPending}
            className="w-full bg-paper-2 text-ink font-body text-xs p-3 rounded-xs border border-slate/30 focus:border-brass outline-none"
          />
        </div>

        {/* Assignee & Due Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate">
              Assignee
            </label>
            <select
              name="assigned_to"
              value={formData.assigned_to}
              onChange={handleChange}
              disabled={createTaskMutation.isPending}
              className="w-full bg-paper-2 text-ink font-body text-xs p-2.5 rounded-xs border border-slate/30 focus:border-brass outline-none"
            >
              <option value="">Unassigned</option>
              {users.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name} ({u.role})
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Due Date"
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            disabled={createTaskMutation.isPending}
          />
        </div>

        {/* Action Controls */}
        <div className="flex justify-end gap-2 pt-3 border-t border-slate/20">
          <Button
            variant="secondary"
            type="button"
            onClick={onClose}
            disabled={createTaskMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            type="submit"
            disabled={createTaskMutation.isPending}
          >
            {createTaskMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brass" />
                <span>Dispatching...</span>
              </>
            ) : (
              <>
                <PlusCircle className="w-4 h-4" /> Dispatch Ticket
              </>
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
