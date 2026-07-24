import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DesignPreview } from './pages/DesignPreview';
import { Dashboard } from './pages/Dashboard';
import { TasksAdmin } from './pages/TasksAdmin';
import { TasksUser } from './pages/TasksUser';
import { TaskDetail } from './pages/TaskDetail';
import { TeamManagement } from './pages/TeamManagement';
import { AppShell } from './layouts/AppShell';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function DynamicTasksRoute() {
  const { user } = useAuth();
  if (user?.role === 'admin') {
    return (
      <AppShell pageTitle="Dispatch Task Board">
        <TasksAdmin />
      </AppShell>
    );
  }
  return (
    <AppShell pageTitle="My Tasks Board">
      <TasksUser />
    </AppShell>
  );
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Design System Showcase */}
            <Route
              path="/design-preview"
              element={
                <AppShell pageTitle="Design System Preview">
                  <DesignPreview />
                </AppShell>
              }
            />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <AppShell pageTitle="Dashboard">
                    <Dashboard />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks"
              element={
                <ProtectedRoute>
                  <DynamicTasksRoute />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-tasks"
              element={
                <ProtectedRoute>
                  <AppShell pageTitle="My Tasks">
                    <TasksUser />
                  </AppShell>
                </ProtectedRoute>
              }
            />
            <Route
              path="/tasks/:id"
              element={
                <ProtectedRoute>
                  <AppShell pageTitle="Ticket Folder Detail">
                    <TaskDetail />
                  </AppShell>
                </ProtectedRoute>
              }
            />

            {/* Admin-Only Team Route */}
            <Route
              path="/team"
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AppShell pageTitle="Team Control">
                      <TeamManagement />
                    </AppShell>
                  </AdminRoute>
                </ProtectedRoute>
              }
            />

            {/* Fallback Route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
