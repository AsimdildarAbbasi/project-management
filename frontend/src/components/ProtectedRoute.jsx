import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

export function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center space-y-3 font-body text-ink">
        <Loader2 className="w-8 h-8 animate-spin text-brass" />
        <p className="font-mono text-xs text-slate uppercase tracking-wider">VERIFYING STATION CREDENTIALS...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export function AdminRoute({ children }) {
  const { user } = useAuth();

  if (user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}
