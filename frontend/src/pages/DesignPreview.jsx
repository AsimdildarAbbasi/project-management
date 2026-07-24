import React, { useState } from 'react';
import { TicketCard } from '../components/TicketCard';
import { StampBadge } from '../components/StampBadge';
import { TicketPerforation } from '../components/TicketPerforation';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Avatar } from '../components/Avatar';
import { Modal } from '../components/Modal';
import { Plus, Check, AlertTriangle, Filter } from 'lucide-react';

export function DesignPreview() {
  const [modalOpen, setModalOpen] = useState(false);
  const [stampKey, setStampKey] = useState(0);

  const triggerStampAnimation = () => {
    setStampKey((prev) => prev + 1);
  };

  const mockTickets = [
    {
      id: 'TCK-0101',
      title: 'Configure PostgreSQL Connection Pool & Schema Migrations',
      description: 'Set up node-postgres connection pooling with environment configurations and automated migration scripts.',
      status: 'DONE',
      priority: 'HIGH',
      assignee: { name: 'Asim Abbasi' },
      dueDate: '2026-07-25',
      fileCount: 3,
      commentCount: 5,
    },
    {
      id: 'TCK-0102',
      title: 'Implement JWT Authentication & RBAC Middleware',
      description: 'Issue 24h JWT tokens on login and implement authenticate + authorizeAdmin authorization guards.',
      status: 'IN PROGRESS',
      priority: 'URGENT',
      assignee: { name: 'Elena Rostova' },
      dueDate: '2026-07-28',
      fileCount: 1,
      commentCount: 2,
    },
    {
      id: 'TCK-0103',
      title: 'Add File Attachment Upload Capability via Multer',
      description: 'Store task attachments under /uploads/tasks/<task_id>/ with strict 10MB file limit and MIME type validation.',
      status: 'PENDING',
      priority: 'NORMAL',
      assignee: { name: 'Marcus Vance' },
      dueDate: '2026-08-01',
      fileCount: 0,
      commentCount: 1,
    },
    {
      id: 'TCK-0104',
      title: 'Audit Overdue Task Alerts and Admin Dashboard Metrics',
      description: 'Identify tasks past due date and calculate overdue metrics with activity timeline UNION query.',
      status: 'OVERDUE',
      priority: 'HIGH',
      assignee: { name: 'Sarah Chen' },
      dueDate: '2026-07-20',
      fileCount: 4,
      commentCount: 8,
    },
  ];

  return (
    <div className="space-y-10">
      {/* Design System Header */}
      <div className="border-b border-slate/20 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-mono text-xs text-brass uppercase font-bold tracking-widest">
            DESIGN SYSTEM // SPECIFICATION 1.0
          </span>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-ink mt-1">
            Dispatch Ticket System
          </h1>
          <p className="font-body text-slate text-sm mt-1 max-w-2xl">
            A tactile, work-order inspired visual language featuring punch tickets, hand-stamped badges,
            die-cut perforations, and ledger typography.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={triggerStampAnimation}>
            <Check className="w-4 h-4 text-sage" /> Re-trigger Stamp
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            <Plus className="w-4 h-4" /> Create Ticket
          </Button>
        </div>
      </div>

      {/* 1. Color Palette Tokens */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brass" /> Color Tokens
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
          {[
            { name: 'ink', hex: '#16213E', usage: 'Primary text, sidebar', bg: 'bg-ink text-paper' },
            { name: 'paper', hex: '#EFF1EF', usage: 'App background', bg: 'bg-paper text-ink border border-slate/30' },
            { name: 'paper-2', hex: '#E3E5E1', usage: 'Card background', bg: 'bg-paper-2 text-ink border border-slate/30' },
            { name: 'brass', hex: '#D89B3C', usage: 'Pending, warnings', bg: 'bg-brass text-paper' },
            { name: 'sage', hex: '#5B8266', usage: 'Completed, success', bg: 'bg-sage text-paper' },
            { name: 'rust', hex: '#B85C42', usage: 'Overdue, destructive', bg: 'bg-rust text-paper' },
            { name: 'slate', hex: '#5B6472', usage: 'Secondary text, border', bg: 'bg-slate text-paper' },
          ].map((token) => (
            <div key={token.name} className={`p-3 rounded-xs flex flex-col justify-between h-24 ${token.bg}`}>
              <div>
                <p className="font-mono text-xs font-bold uppercase">{token.name}</p>
                <p className="font-mono text-[10px] opacity-80">{token.hex}</p>
              </div>
              <p className="text-[10px] font-body opacity-90 line-clamp-1">{token.usage}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Typography Spec */}
      <section className="space-y-3">
        <h2 className="font-display text-lg font-semibold text-ink flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-brass" /> Typography System
        </h2>
        <div className="bg-paper-2 border border-slate/30 rounded-xs p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate/20 pb-3 gap-2">
            <span className="font-mono text-xs text-slate uppercase w-36">font-display (Fraunces)</span>
            <span className="font-display text-2xl font-semibold text-ink">Page Titles & Section Headers Only</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between border-b border-slate/20 pb-3 gap-2">
            <span className="font-mono text-xs text-slate uppercase w-36">font-body (IBM Plex Sans)</span>
            <span className="font-body text-sm text-ink">Body copy, form labels, buttons, navigation and description text.</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <span className="font-mono text-xs text-slate uppercase w-36">font-mono (IBM Plex Mono)</span>
            <span className="font-mono text-xs text-ink font-semibold">TCK-0142 • 2026-07-24T10:12:00Z • HTTP 200 OK</span>
          </div>
        </div>
      </section>

      {/* 3. Hand-Stamped Badges & Perforation */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-paper-2 border border-slate/30 rounded-xs p-5 space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink">StampBadges (Hand-Stamped)</h2>
          <p className="font-body text-xs text-slate">
            Rotated -4deg with irregular border-radius (3px 7px 4px 8px), 2px border, 10% opacity fill.
          </p>
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <StampBadge key={`pending-${stampKey}`} status="PENDING" animate={true} />
            <StampBadge key={`progress-${stampKey}`} status="IN_PROGRESS" animate={true} />
            <StampBadge key={`done-${stampKey}`} status="DONE" animate={true} />
            <StampBadge key={`overdue-${stampKey}`} status="OVERDUE" animate={true} />
          </div>
        </div>

        <div className="bg-paper-2 border border-slate/30 rounded-xs p-5 space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink">TicketPerforation Component</h2>
          <p className="font-body text-xs text-slate">
            Dashed top border with two circular cutouts matching the paper background.
          </p>
          <div className="bg-paper p-4 rounded-xs border border-slate/20">
            <p className="font-mono text-xs text-slate">UPPER TICKET STUB METADATA</p>
            <TicketPerforation />
            <p className="font-body text-xs text-ink">LOWER TICKET STUB CONTENT</p>
          </div>
        </div>
      </section>

      {/* 4. Button & Input Primitives */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-paper-2 border border-slate/30 rounded-xs p-5 space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink">Buttons & Variants</h2>
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary">Primary (Ink)</Button>
            <Button variant="secondary">Secondary (Paper-2)</Button>
            <Button variant="destructive">Destructive (Rust)</Button>
            <Button variant="outline">Outline</Button>
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large</Button>
          </div>
        </div>

        <div className="bg-paper-2 border border-slate/30 rounded-xs p-5 space-y-4">
          <h2 className="font-display text-lg font-semibold text-ink">Inputs & Focus Ring</h2>
          <div className="space-y-3">
            <Input label="Task Title" placeholder="Enter task title..." />
            <Input
              label="Assigned User Email"
              error="User email already registered"
              defaultValue="invalid-email"
            />
          </div>
        </div>
      </section>

      {/* 5. Avatars */}
      <section className="bg-paper-2 border border-slate/30 rounded-xs p-5 space-y-3">
        <h2 className="font-display text-lg font-semibold text-ink">Avatars</h2>
        <div className="flex items-center gap-4">
          <Avatar name="Asim Abbasi" size="sm" />
          <Avatar name="Elena Rostova" size="md" />
          <Avatar name="Marcus Vance" size="lg" />
          <Avatar name="Sarah Chen" size="lg" />
        </div>
      </section>

      {/* 6. Signature TicketCard Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-brass" /> Signature TicketCard Gallery
          </h2>
          <span className="font-mono text-xs text-slate">4 MOCK TICKETS</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockTickets.map((ticket) => (
            <TicketCard key={ticket.id} {...ticket} />
          ))}
        </div>
      </section>

      {/* Interactive Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Issue New Dispatch Ticket"
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); setModalOpen(false); }}>
          <Input label="Ticket Title" placeholder="e.g. Implement User Role Update Endpoint" required />
          <Input label="Description" placeholder="Provide detailed instructions..." />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Due Date" type="date" defaultValue="2026-08-01" />
            <Input label="Assignee ID" placeholder="User ID (e.g. 2)" />
          </div>
          <div className="flex justify-end gap-2 pt-2 border-t border-slate/20">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Dispatch Ticket
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
