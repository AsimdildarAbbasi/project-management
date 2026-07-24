import React, { useState } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  CheckSquare,
  Users,
  Eye,
  LogOut,
  Menu,
  X,
  Search,
  Sparkles,
} from 'lucide-react';
import { Avatar } from '../components/Avatar';
import { useAuth } from '../context/AuthContext';

export function AppShell({ children, pageTitle = 'Dashboard' }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isAdmin = user?.role === 'admin';

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    {
      label: isAdmin ? 'All Tasks' : 'My Tasks',
      path: '/tasks',
      icon: CheckSquare,
    },
    ...(isAdmin ? [{ label: 'Team Control', path: '/team', icon: Users }] : []),
    { label: 'Design Preview', path: '/design-preview', icon: Eye },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen flex text-slate-100 font-body relative overflow-x-hidden">
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Glassmorphic Dark Sidebar */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-950/90 backdrop-blur-xl border-r border-white/10 flex flex-col justify-between
          transition-transform duration-200 ease-in-out md:translate-x-0
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div>
          {/* Header / Brand Logo */}
          <div className="h-16 flex items-center justify-between px-6 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center glow-brass">
                <Sparkles className="w-4 h-4 text-amber-400" />
              </div>
              <h1 className="font-display font-bold text-lg tracking-wide text-slate-100">
                DISPATCH<span className="text-amber-400">.</span>
              </h1>
            </div>
            <button
              onClick={() => setMobileOpen(false)}
              className="md:hidden text-slate-400 hover:text-slate-100 p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="mt-6 px-3 space-y-1.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center gap-3 px-3.5 py-2.5 text-xs font-semibold rounded-md transition-all duration-150
                    ${
                      isActive
                        ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30 glow-brass'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                  <span className="font-body">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* User Footer Strip */}
        <div className="p-4 border-t border-white/10 bg-slate-900/60 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            <Avatar name={user?.name || 'User'} size="md" className="border-amber-500/30" />
            <div className="min-w-0">
              <p className="text-xs font-semibold text-slate-100 truncate">{user?.name || 'Station User'}</p>
              <span className="inline-block font-mono text-[9px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20 uppercase">
                {user?.role || 'user'}
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-slate-400 hover:text-rose-400 transition-colors p-2 rounded hover:bg-rose-500/10 cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 min-w-0">
        {/* Glassmorphic Topbar */}
        <header className="h-16 bg-slate-950/80 backdrop-blur-xl border-b border-white/10 px-6 md:px-8 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-slate-200 hover:text-amber-400 p-1"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-display font-semibold text-xl text-slate-100 tracking-tight">
              {pageTitle}
            </h2>
          </div>

          {/* Search & Station Badge */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block w-48 lg:w-64">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search tickets..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900/80 text-slate-100 font-body text-xs rounded-md border border-white/10 focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none placeholder:text-slate-500"
              />
            </div>
            <div className="font-mono text-xs text-amber-400 bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded">
              OFFICE #01
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 px-6 md:px-8 py-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
