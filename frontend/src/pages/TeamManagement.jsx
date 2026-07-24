import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchUsersApi, updateUserRoleApi, deleteUserApi } from '../api/userApi';
import { Avatar } from '../components/Avatar';
import { Button } from '../components/Button';
import { useAuth } from '../context/AuthContext';
import {
  Users,
  Search,
  ShieldCheck,
  User,
  Trash2,
  AlertTriangle,
  RefreshCw,
  Check,
  X,
  Loader2,
} from 'lucide-react';

export function TeamManagement() {
  const queryClient = useQueryClient();
  const { user: currentUser, logout } = useAuth();

  const [searchTerm, setSearchTerm] = useState('');
  const [confirmRoleId, setConfirmRoleId] = useState(null); // ID of user being confirmed for role toggle
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // ID of user being confirmed for delete

  // Fetch Users List
  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['usersList'],
    queryFn: fetchUsersApi,
    staleTime: 30000,
  });

  // Update User Role Mutation
  const roleMutation = useMutation({
    mutationFn: ({ userId, role }) => updateUserRoleApi(userId, role),
    onSuccess: (data, variables) => {
      setConfirmRoleId(null);
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      // If demoted self, trigger logout/re-evaluation
      if (variables.userId === currentUser?.id && variables.role !== 'admin') {
        logout();
      }
    },
  });

  // Delete User Mutation
  const deleteMutation = useMutation({
    mutationFn: (userId) => deleteUserApi(userId),
    onSuccess: () => {
      setConfirmDeleteId(null);
      queryClient.invalidateQueries({ queryKey: ['usersList'] });
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
  });

  // Search Filter
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    return (
      (u.name && u.name.toLowerCase().includes(term)) ||
      (u.email && u.email.toLowerCase().includes(term))
    );
  });

  return (
    <div className="space-y-6 font-body max-w-6xl mx-auto">
      {/* Header Strip */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate/20 pb-4">
        <div>
          <span className="font-mono text-xs font-bold text-brass uppercase tracking-widest">
            STATION ADMINISTRATION // TEAM CONTROL
          </span>
          <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">
            Team Roster & Station Roles
          </h1>
        </div>

        <button
          onClick={() => refetch()}
          title="Refresh user list"
          className="text-slate hover:text-ink p-2 rounded-xs border border-slate/30 hover:border-slate/50 transition-colors self-start sm:self-center"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-brass' : ''}`} />
        </button>
      </div>

      {/* Search & Statistics Filter Bar */}
      <div className="bg-paper-2 border border-slate/30 p-4 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search member by name or email..."
            className="w-full pl-9 pr-3 py-1.5 bg-paper text-ink font-body text-xs rounded-xs border border-slate/30 focus:border-brass placeholder:text-slate/60 outline-none"
          />
        </div>

        <div className="font-mono text-xs text-slate space-x-3 self-end sm:self-auto">
          <span>TOTAL USERS: <strong className="text-ink">{users.length}</strong></span>
          <span>•</span>
          <span>ADMINS: <strong className="text-brass">{users.filter((u) => u.role === 'admin').length}</strong></span>
        </div>
      </div>

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="bg-paper-2 border border-slate/30 p-6 rounded-xs space-y-3 animate-pulse">
          <div className="h-6 w-48 bg-slate/20 rounded-xs" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full bg-slate/20 rounded-xs" />
            ))}
          </div>
        </div>
      )}

      {/* Error State */}
      {isError && (
        <div className="bg-rust/10 border border-rust p-6 rounded-xs space-y-3 text-rust font-body max-w-xl">
          <div className="flex items-center gap-2 font-display text-lg font-bold">
            <AlertTriangle className="w-5 h-5" />
            <span>Failed to load team roster</span>
          </div>
          <p className="text-xs font-mono">{error?.message || 'Server error occurred while fetching users.'}</p>
          <Button variant="destructive" size="sm" onClick={() => refetch()}>
            Retry
          </Button>
        </div>
      )}

      {/* User Roster Table */}
      {!isLoading && !isError && (
        <div className="bg-paper-2 border border-slate/30 rounded-xs overflow-hidden shadow-xs">
          {filteredUsers.length === 0 ? (
            <p className="font-mono text-xs text-slate p-8 text-center">
              NO TEAM USERS MATCH THE SEARCH FILTER "{searchTerm}".
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs border-collapse">
                <thead>
                  <tr className="bg-paper border-b border-slate/25 font-mono text-[11px] text-slate uppercase">
                    <th className="py-3 px-4">STATION MEMBER</th>
                    <th className="py-3 px-4">EMAIL ADDRESS</th>
                    <th className="py-3 px-4">ROLE BADGE</th>
                    <th className="py-3 px-4">JOINED DATE</th>
                    <th className="py-3 px-4 text-right">ADMIN ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate/15">
                  {filteredUsers.map((u) => {
                    const isAdmin = u.role === 'admin';
                    const isSelf = u.id === currentUser?.id;

                    return (
                      <tr key={u.id} className="hover:bg-paper/40 transition-colors">
                        {/* Member Name + Avatar */}
                        <td className="py-3 px-4 font-semibold text-ink">
                          <div className="flex items-center gap-2.5">
                            <Avatar name={u.name} size="sm" />
                            <span>{u.name}</span>
                            {isSelf && (
                              <span className="font-mono text-[9px] bg-brass/20 text-brass px-1.5 py-0.5 rounded-xs font-bold">
                                (YOU)
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Email */}
                        <td className="py-3 px-4 text-slate font-mono text-[11px]">
                          {u.email}
                        </td>

                        {/* Role StampBadge Tag */}
                        <td className="py-3 px-4">
                          <span
                            className={`
                              font-mono text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase inline-flex items-center gap-1 border tracking-wider
                              ${
                                isAdmin
                                  ? 'bg-ink text-paper border-ink shadow-2xs'
                                  : 'bg-paper text-slate border-slate/30'
                              }
                            `}
                          >
                            {isAdmin ? <ShieldCheck className="w-3 h-3 text-brass" /> : <User className="w-3 h-3 text-slate" />}
                            {u.role}
                          </span>
                        </td>

                        {/* Joined Date */}
                        <td className="py-3 px-4 font-mono text-[11px] text-slate/80">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                        </td>

                        {/* Admin Action Controls */}
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Role Toggle Action */}
                            {confirmRoleId === u.id ? (
                              <div className="inline-flex items-center gap-1 bg-paper border border-brass p-1 rounded-xs animate-in fade-in">
                                <span className="font-mono text-[10px] font-bold text-ink">
                                  Set to {isAdmin ? 'User' : 'Admin'}?
                                </span>
                                <button
                                  onClick={() =>
                                    roleMutation.mutate({
                                      userId: u.id,
                                      role: isAdmin ? 'user' : 'admin',
                                    })
                                  }
                                  className="text-brass hover:text-ink p-1 cursor-pointer font-bold"
                                  title="Confirm role change"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setConfirmRoleId(null)}
                                  className="text-slate hover:text-ink p-1 cursor-pointer"
                                  title="Cancel"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ) : (
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setConfirmRoleId(u.id)}
                                title="Toggle user station role"
                              >
                                {isAdmin ? 'Demote to User' : 'Promote to Admin'}
                              </Button>
                            )}

                            {/* Delete User Action (with explicit active ticket warning) */}
                            {!isSelf && (
                              <>
                                {confirmDeleteId === u.id ? (
                                  <div className="inline-flex items-center gap-1 bg-rust/10 border border-rust p-1.5 rounded-xs animate-in fade-in max-w-xs text-left">
                                    <AlertTriangle className="w-3.5 h-3.5 text-rust shrink-0" />
                                    <span className="font-mono text-[10px] text-rust font-bold">
                                      Unassigns active tickets. Delete?
                                    </span>
                                    <button
                                      onClick={() => deleteMutation.mutate(u.id)}
                                      className="text-rust font-bold hover:underline px-1 cursor-pointer text-xs"
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() => setConfirmDeleteId(null)}
                                      className="text-slate hover:text-ink px-1 cursor-pointer text-xs"
                                    >
                                      No
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => setConfirmDeleteId(u.id)}
                                    className="text-slate hover:text-rust p-1.5 rounded-xs transition-colors cursor-pointer border border-transparent hover:border-rust/30"
                                    title="Delete user account (admin only)"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                )}
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
