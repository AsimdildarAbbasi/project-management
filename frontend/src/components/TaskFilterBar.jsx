import React from 'react';
import { Filter, ArrowUpDown } from 'lucide-react';

const statusOptions = [
  { id: 'ALL', label: 'ALL', activeClass: 'bg-slate/15 text-ink border-slate/40 font-bold' },
  { id: 'PENDING', label: 'PENDING', activeClass: 'bg-brass/15 text-brass border-brass font-bold' },
  { id: 'IN_PROGRESS', label: 'IN PROGRESS', activeClass: 'bg-brass/15 text-brass border-brass font-bold' },
  { id: 'COMPLETED', label: 'DONE', activeClass: 'bg-sage/15 text-sage border-sage font-bold' },
];

export function TaskFilterBar({
  selectedStatus = 'ALL',
  onStatusChange,
  selectedAssignee = '',
  onAssigneeChange,
  assignees = [],
  sortBy = 'due_date',
  onSortChange,
  showAssigneeFilter = true,
}) {
  return (
    <div className="bg-paper-2 border border-slate/30 p-3 rounded-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 font-body">
      {/* Segmented Status Controls */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
        <span className="font-mono text-[11px] text-slate font-semibold uppercase tracking-wider mr-1 hidden sm:inline">
          STATUS:
        </span>
        {statusOptions.map((opt) => {
          const isActive = selectedStatus === opt.id;

          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => onStatusChange(opt.id)}
              className={`
                px-2.5 py-1 rounded-xs font-mono text-xs transition-all cursor-pointer border select-none whitespace-nowrap
                ${
                  isActive
                    ? opt.activeClass
                    : 'bg-paper/50 text-slate border-slate/20 hover:border-slate/40 hover:text-ink'
                }
              `}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {/* Assignee Dropdown & Sort Controls */}
      <div className="flex items-center gap-3 self-end md:self-auto shrink-0">
        {showAssigneeFilter && assignees.length > 0 && (
          <div className="flex items-center gap-1.5">
            <label className="font-mono text-[11px] text-slate font-semibold uppercase hidden sm:inline">
              ASSIGNEE:
            </label>
            <select
              value={selectedAssignee}
              onChange={(e) => onAssigneeChange(e.target.value)}
              className="bg-paper text-ink font-body text-xs px-2.5 py-1 rounded-xs border border-slate/30 focus:border-brass"
            >
              <option value="">All Team Members</option>
              {assignees.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1.5">
          <ArrowUpDown className="w-3.5 h-3.5 text-slate hidden sm:inline" />
          <label className="font-mono text-[11px] text-slate font-semibold uppercase hidden sm:inline">
            SORT:
          </label>
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-paper text-ink font-body text-xs px-2.5 py-1 rounded-xs border border-slate/30 focus:border-brass"
          >
            <option value="due_date">Due Date (Soonest)</option>
            <option value="created_at">Created Date (Newest)</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>
    </div>
  );
}
