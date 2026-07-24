import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../api/axios';
import { fetchTaskFilesApi, uploadTaskFileApi, downloadFileApi, deleteTaskFileApi } from '../api/fileApi';
import { fetchTaskCommentsApi, addCommentApi, deleteCommentApi } from '../api/commentApi';
import { StampBadge } from '../components/StampBadge';
import { TicketPerforation } from '../components/TicketPerforation';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { FileDropZone } from '../components/FileDropZone';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  User,
  Paperclip,
  MessageSquare,
  Download,
  Trash2,
  Edit2,
  Check,
  X,
  AlertTriangle,
  Lock,
  ArrowLeft,
  Loader2,
  Send,
} from 'lucide-react';

export function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user: currentUser } = useAuth();

  // Inline edit state for admin
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    assigned_to: '',
    due_date: '',
    status: 'pending',
  });

  // Comment input state
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // File upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Inline delete confirmation state for comments
  const [confirmDeleteCommentId, setConfirmDeleteCommentId] = useState(null);

  // Fetch Task Details
  const {
    data: task,
    isLoading: loadingTask,
    isError: isTaskError,
    error: taskError,
    refetch: refetchTask,
  } = useQuery({
    queryKey: ['taskDetail', id],
    queryFn: async () => {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data?.task || response.data;
    },
  });

  // Fetch Users list (for Admin Inline Edit Assignee Dropdown)
  const { data: usersList = [] } = useQuery({
    queryKey: ['usersList'],
    queryFn: async () => {
      const res = await apiClient.get('/users');
      return res.data?.users || [];
    },
    enabled: currentUser?.role === 'admin',
  });

  // Fetch Attached Files
  const { data: files = [], refetch: refetchFiles } = useQuery({
    queryKey: ['taskFiles', id],
    queryFn: () => fetchTaskFilesApi(id),
    enabled: !!task && !isTaskError,
  });

  // Fetch Comments
  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ['taskComments', id],
    queryFn: () => fetchTaskCommentsApi(id),
    enabled: !!task && !isTaskError,
  });

  // Admin Inline Edit Task Mutation
  const editTaskMutation = useMutation({
    mutationFn: (updatedFields) => apiClient.put(`/tasks/${id}`, updatedFields),
    onSuccess: () => {
      setIsEditing(false);
      queryClient.invalidateQueries({ queryKey: ['taskDetail', id] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });

  // File Delete Mutation
  const deleteFileMutation = useMutation({
    mutationFn: (fileId) => deleteTaskFileApi(fileId),
    onSuccess: () => {
      refetchFiles();
      queryClient.invalidateQueries({ queryKey: ['taskDetail', id] });
    },
  });

  // Comment Delete Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId) => deleteCommentApi(commentId),
    onSuccess: () => {
      setConfirmDeleteCommentId(null);
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ['taskDetail', id] });
    },
  });

  const startInlineEdit = () => {
    if (!task) return;
    setEditForm({
      title: task.title || '',
      description: task.description || '',
      assigned_to: task.assigned_to || '',
      due_date: task.due_date ? new Date(task.due_date).toISOString().split('T')[0] : '',
      status: task.status || 'pending',
    });
    setIsEditing(true);
  };

  const handleSaveInlineEdit = (e) => {
    e.preventDefault();
    editTaskMutation.mutate({
      title: editForm.title,
      description: editForm.description,
      assigned_to: editForm.assigned_to ? Number(editForm.assigned_to) : null,
      due_date: editForm.due_date || null,
      status: editForm.status,
    });
  };

  const handleFileUpload = async (file) => {
    setIsUploading(true);
    setUploadProgress(0);
    try {
      await uploadTaskFileApi(id, file, (percent) => setUploadProgress(percent));
      refetchFiles();
      queryClient.invalidateQueries({ queryKey: ['taskDetail', id] });
    } catch (err) {
      console.error('File upload error:', err);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await addCommentApi(id, newComment.trim());
      setNewComment('');
      refetchComments();
      queryClient.invalidateQueries({ queryKey: ['taskDetail', id] });
    } catch (err) {
      console.error('Add comment error:', err);
    } finally {
      setSubmittingComment(false);
    }
  };

  // Loading State
  if (loadingTask) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center space-y-3 font-body text-ink">
        <Loader2 className="w-8 h-8 animate-spin text-brass" />
        <p className="font-mono text-xs text-slate uppercase">PULLING TICKET FOLDER #{id}...</p>
      </div>
    );
  }

  // Calm 403 / Access Restricted Fallback State
  const isAccessDenied = isTaskError && (taskError?.response?.status === 403 || taskError?.response?.status === 404);

  if (isAccessDenied) {
    return (
      <div className="bg-paper-2 border border-slate/30 p-8 rounded-xs space-y-4 max-w-xl mx-auto my-12 text-center font-body">
        <div className="w-12 h-12 rounded-full bg-paper flex items-center justify-center mx-auto border border-slate/20">
          <Lock className="w-6 h-6 text-rust" />
        </div>
        <h2 className="font-display text-2xl font-bold text-ink">
          Access Restricted
        </h2>
        <p className="font-body text-xs text-slate max-w-md mx-auto leading-relaxed">
          You do not have administrative or assignee privileges to inspect dispatch ticket stub #{id}.
        </p>
        <div className="pt-2">
          <Button variant="primary" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4" /> Return to Dashboard
          </Button>
        </div>
      </div>
    );
  }

  // Other Error State
  if (isTaskError) {
    return (
      <div className="bg-rust/10 border border-rust p-6 rounded-xs space-y-3 text-rust font-body max-w-xl my-6">
        <div className="flex items-center gap-2 font-display text-lg font-bold">
          <AlertTriangle className="w-5 h-5" />
          <span>Error Loading Ticket Folder</span>
        </div>
        <p className="text-xs font-mono">{taskError?.message || 'Failed to retrieve task detail.'}</p>
        <Button variant="destructive" size="sm" onClick={() => refetchTask()}>
          Retry
        </Button>
      </div>
    );
  }

  const isAdmin = currentUser?.role === 'admin';
  const isAssignee = currentUser?.id === task?.assigned_to;
  const canModifyOrComment = isAdmin || isAssignee;

  const filesList = Array.isArray(files) ? files : (files?.files || []);
  const commentsList = Array.isArray(comments) ? comments : (comments?.comments || []);

  return (
    <div className="space-y-8 font-body max-w-5xl mx-auto">
      {/* Back Button */}
      <div>
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 font-mono text-xs text-slate hover:text-ink transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO DISPATCH BOARD</span>
        </button>
      </div>

      {/* Ticket Folder Sheet */}
      <div className="bg-paper-2 border border-slate/30 rounded-xs p-6 md:p-8 space-y-6 shadow-sm relative">
        {/* Top Ledger Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate/20 pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-slate bg-paper px-2.5 py-1 rounded-xs border border-slate/20">
              TCK-{String(task.id).padStart(4, '0')}
            </span>
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-xs uppercase bg-ink text-paper">
              DISPATCH FOLDER
            </span>
          </div>

          <div className="flex items-center gap-3">
            <StampBadge status={task.status} />

            {isAdmin && !isEditing && (
              <Button variant="secondary" size="sm" onClick={startInlineEdit}>
                <Edit2 className="w-3.5 h-3.5" /> Edit Folder
              </Button>
            )}
          </div>
        </div>

        {/* Perforation Aesthetic Divider */}
        <TicketPerforation />

        {/* Admin Inline Edit Form OR Header Render */}
        {isEditing ? (
          <form onSubmit={handleSaveInlineEdit} className="bg-paper border border-brass/40 p-4 rounded-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate/20 pb-2">
              <span className="font-mono text-xs font-bold text-brass uppercase">
                ADMIN INLINE EDIT MODE
              </span>
              <div className="flex items-center gap-2">
                <Button variant="secondary" size="sm" onClick={() => setIsEditing(false)}>
                  <X className="w-3.5 h-3.5" /> Cancel
                </Button>
                <Button variant="primary" size="sm" type="submit" disabled={editTaskMutation.isPending}>
                  <Check className="w-3.5 h-3.5" /> Save Changes
                </Button>
              </div>
            </div>

            <Input
              label="Ticket Title"
              value={editForm.title}
              onChange={(e) => setEditForm((prev) => ({ ...prev, title: e.target.value }))}
              required
            />

            <div className="space-y-1">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate">
                Description
              </label>
              <textarea
                value={editForm.description}
                onChange={(e) => setEditForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full bg-paper-2 text-ink font-body text-sm p-3 rounded-xs border border-slate/30 focus:border-brass focus:ring-1 focus:ring-brass outline-none"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-1">
                  Assignee
                </label>
                <select
                  value={editForm.assigned_to}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, assigned_to: e.target.value }))}
                  className="w-full bg-paper-2 text-ink font-body text-xs p-2 rounded-xs border border-slate/30"
                >
                  <option value="">Unassigned</option>
                  {usersList.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.role})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate mb-1">
                  Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm((prev) => ({ ...prev, status: e.target.value }))}
                  className="w-full bg-paper-2 text-ink font-body text-xs p-2 rounded-xs border border-slate/30"
                >
                  <option value="pending">pending</option>
                  <option value="in_progress">in_progress</option>
                  <option value="completed">completed</option>
                </select>
              </div>

              <Input
                label="Due Date"
                type="date"
                value={editForm.due_date}
                onChange={(e) => setEditForm((prev) => ({ ...prev, due_date: e.target.value }))}
              />
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-ink leading-snug">
              {task.title}
            </h1>

            {/* Metadata Bar */}
            <div className="flex flex-wrap items-center gap-6 text-xs text-slate border-y border-slate/15 py-3">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-brass" />
                <span className="font-body">Assignee:</span>
                <Avatar name={task.assigned_to_name || 'Unassigned'} size="sm" />
                <span className="font-semibold text-ink">{task.assigned_to_name || 'Unassigned'}</span>
              </div>

              {task.due_date && (
                <div className="flex items-center gap-1.5 font-mono">
                  <Calendar className="w-4 h-4 text-slate" />
                  <span>DUE: {new Date(task.due_date).toISOString().split('T')[0]}</span>
                </div>
              )}

              <div className="font-mono text-[11px] text-slate/70">
                CREATED BY: {task.created_by_name || 'Admin'} • {new Date(task.created_at).toLocaleDateString()}
              </div>
            </div>

            {/* Description Block */}
            <div className="space-y-1.5 pt-2">
              <span className="font-mono text-xs text-slate font-bold uppercase tracking-wider">
                TICKET REQUIREMENTS & DESCRIPTION
              </span>
              <p className="font-body text-ink text-sm leading-relaxed whitespace-pre-wrap bg-paper/60 p-4 rounded-xs border border-slate/15">
                {task.description || 'No detailed description provided for this ticket.'}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Attached Files Section */}
      <section className="bg-paper-2 border border-slate/30 rounded-xs p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate/20 pb-3">
          <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-brass" /> Attached Station Files ({filesList.length})
          </h2>
        </div>

        {/* Compact File Table */}
        {filesList.length === 0 ? (
          <p className="font-mono text-xs text-slate py-2">NO ATTACHED FILES FOR THIS TICKET.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left font-body text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate/20 font-mono text-[11px] text-slate uppercase">
                  <th className="py-2 px-3">FILE NAME</th>
                  <th className="py-2 px-3">UPLOADED BY</th>
                  <th className="py-2 px-3">TIMESTAMP</th>
                  <th className="py-2 px-3 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate/15">
                {filesList.map((file) => (
                  <tr key={file.id} className="hover:bg-paper/40 transition-colors">
                    <td className="py-2.5 px-3 font-semibold text-ink">
                      {file.file_name}
                    </td>
                    <td className="py-2.5 px-3 text-slate">
                      {file.uploaded_by_name || 'Station User'}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate/80">
                      {new Date(file.uploaded_at).toLocaleString()}
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-2">
                      <button
                        onClick={() => downloadFileApi(file.id, file.file_name)}
                        className="text-brass hover:text-ink font-mono text-[11px] font-bold p-1 rounded-xs inline-flex items-center gap-1 cursor-pointer"
                        title="Download file"
                      >
                        <Download className="w-3.5 h-3.5" /> Download
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => deleteFileMutation.mutate(file.id)}
                          className="text-slate hover:text-rust p-1 rounded-xs inline-flex items-center transition-colors cursor-pointer"
                          title="Delete file (admin only)"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Upload Control Drop Zone (Assignee or Admin Only) */}
        {canModifyOrComment && (
          <div className="pt-3 border-t border-slate/15">
            <span className="font-mono text-[11px] font-bold text-slate uppercase tracking-wider block mb-2">
              UPLOAD ATTACHMENT
            </span>
            <FileDropZone
              onUpload={handleFileUpload}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>
        )}
      </section>

      {/* Station Logbook Comments Section */}
      <section className="bg-paper-2 border border-slate/30 rounded-xs p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-slate/20 pb-3">
          <h2 className="font-display text-lg font-bold text-ink flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-sage" /> Station Logbook Thread ({commentsList.length})
          </h2>
          <span className="font-mono text-xs text-slate">CHRONOLOGICAL RECORD</span>
        </div>

        {/* Vertical Logbook Comments List (Ledger Entries, NOT chat bubbles) */}
        {commentsList.length === 0 ? (
          <p className="font-mono text-xs text-slate py-2">NO LOGBOOK COMMENTS ADDED YET.</p>
        ) : (
          <div className="space-y-4">
            {commentsList.map((comment) => (
              <div
                key={comment.id}
                className="bg-paper border border-slate/20 p-4 rounded-xs space-y-2 relative"
              >
                {/* Comment Header Strip */}
                <div className="flex items-center justify-between gap-2 border-b border-slate/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Avatar name={comment.user_name || comment.name || 'User'} size="sm" />
                    <span className="font-body text-xs font-semibold text-ink">
                      {comment.user_name || comment.name || 'Station User'}
                    </span>
                    {comment.role === 'admin' && (
                      <span className="font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-xs bg-ink text-paper uppercase">
                        ADMIN
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 font-mono text-[11px] text-slate">
                    <span>{new Date(comment.created_at).toLocaleString()}</span>

                    {/* Admin Delete Icon with Inline Confirmation Step */}
                    {isAdmin && (
                      <div className="inline-flex items-center gap-1">
                        {confirmDeleteCommentId === comment.id ? (
                          <div className="flex items-center gap-1 bg-rust/10 border border-rust px-2 py-0.5 rounded-xs animate-in fade-in">
                            <span className="text-[10px] text-rust font-bold">Delete?</span>
                            <button
                              onClick={() => deleteCommentMutation.mutate(comment.id)}
                              className="text-rust font-bold hover:underline px-1"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => setConfirmDeleteCommentId(null)}
                              className="text-slate hover:text-ink px-1"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteCommentId(comment.id)}
                            className="text-slate hover:text-rust p-1 rounded-xs transition-colors cursor-pointer"
                            title="Delete comment (admin only)"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Comment Text */}
                <p className="font-body text-xs text-ink leading-relaxed whitespace-pre-wrap">
                  {comment.comment_text}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Comment Input or RBAC Explanation Note */}
        {canModifyOrComment ? (
          <form onSubmit={handleAddComment} className="space-y-3 pt-3 border-t border-slate/20">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate">
              Add Logbook Comment Entry
            </label>
            <div className="flex gap-2">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write official station comment entry..."
                rows={2}
                className="flex-1 bg-paper text-ink font-body text-xs p-3 rounded-xs border border-slate/30 focus:border-brass outline-none"
                disabled={submittingComment}
              />
              <Button
                type="submit"
                variant="primary"
                className="self-end"
                disabled={submittingComment || !newComment.trim()}
              >
                {submittingComment ? (
                  <Loader2 className="w-4 h-4 animate-spin text-brass" />
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" /> Post Entry
                  </>
                )}
              </Button>
            </div>
          </form>
        ) : (
          <div className="pt-3 border-t border-slate/20 font-mono text-xs text-slate bg-paper/60 p-3 rounded-xs border border-slate/20">
            Only the assigned team member and admins can comment on this ticket.
          </div>
        )}
      </section>
    </div>
  );
}
