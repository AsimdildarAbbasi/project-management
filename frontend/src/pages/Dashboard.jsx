import React from 'react';
import { useAuth } from '../context/AuthContext';
import { DashboardAdmin } from './DashboardAdmin';
import { DashboardUser } from './DashboardUser';

export function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <DashboardAdmin />;
  }

  return <DashboardUser />;
}
