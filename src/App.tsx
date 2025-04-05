import React, { Fragment } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import ShipmentsPage from './pages/ShipmentsPage';
import UsersPage from './pages/UsersPage'; // Admin only
import SettingsPage from './pages/SettingsPage'; // Admin only
// import NotFoundPage from './pages/NotFoundPage'; // Not used directly here currently

// Components
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-jdc-black">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <Fragment>
      {!currentUser ? (
        <AuthModal />
      ) : (
        <Routes>
          {/* Protected Routes within Main Layout */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<DashboardPage />} />
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="shipments" element={<ShipmentsPage />} />
              {/* Admin Routes - TODO: Add role check in ProtectedRoute */}
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              {/* Add other nested routes for authenticated users here */}
            </Route>
          </Route>

          {/* Fallback for any unmatched authenticated routes */}
          {/* This redirects any logged-in user hitting an unknown path back to the dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />

          {/* Note: A 404 page for authenticated users might be better placed *inside* the MainLayout */}
          {/* Example: <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} /> */}
          {/* But the current setup redirects to '/' anyway */}
        </Routes>
      )}
      {/* Note: If a non-authenticated user hits an invalid path, they currently see nothing */}
      {/* because AuthModal is only shown for the root path implicitly. */}
      {/* A global non-authenticated 404 might require different routing structure. */}
      {/* Example: Add a <Route path="*" element={<NotFoundPage />} /> outside the conditional */}
    </Fragment>
  );
}

export default App;
