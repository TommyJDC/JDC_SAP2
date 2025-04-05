import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import DashboardPage from './pages/DashboardPage';
import TicketsPage from './pages/TicketsPage';
import ShipmentsPage from './pages/ShipmentsPage';
import UsersPage from './pages/UsersPage'; // Admin only
import SettingsPage from './pages/SettingsPage'; // Admin only
import NotFoundPage from './pages/NotFoundPage';

// Components
import AuthModal from './components/auth/AuthModal';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoadingSpinner from './components/common/LoadingSpinner';

function App() {
  const { currentUser, loading } = useAuth();

  if (loading) {
    // Optional: Show a full-screen loader while auth state is initially checked
    return (
      <div className="flex items-center justify-center h-screen bg-jdc-black">
        <LoadingSpinner size={48} />
      </div>
    );
  }

  return (
    <Router>
      {!currentUser ? (
        // Show Login Modal if not authenticated
        <AuthModal />
      ) : (
        // Show main application routes if authenticated
        <Routes>
          <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
            <Route path="/" element={<MainLayout />}> {/* Nested layout route */}
              <Route index element={<DashboardPage />} /> {/* Default child route */}
              <Route path="tickets" element={<TicketsPage />} />
              <Route path="shipments" element={<ShipmentsPage />} />
              {/* Admin Routes - Add role check in ProtectedRoute later */}
              <Route path="users" element={<UsersPage />} />
              <Route path="settings" element={<SettingsPage />} />
              {/* Add other nested routes here */}
            </Route>
          </Route>
          {/* Fallback for unmatched authenticated routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
          {/* You might want a dedicated 404 page within the layout too */}
           {/* <Route path="*" element={<MainLayout><NotFoundPage /></MainLayout>} /> */}
        </Routes>
      )}
      {/* Consider a global 404 for non-authenticated unmatched routes if needed */}
       {/* {!currentUser && <Route path="*" element={<NotFoundPage />} />} */}
    </Router>
  );
}

export default App;
